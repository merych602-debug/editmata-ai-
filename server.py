#!/usr/bin/env python3
"""EditMate AI backend (stdlib only, no pip needed).

Serves the frontend + JSON API, with an auto-debug layer:
  1. STARTUP SELF-TESTS  - logic is verified before the port opens (fail fast).
  2. REQUEST GUARDRAILS  - every request is timed, validated, try/except wrapped.
  3. ERROR INTAKE        - server crashes AND browser errors land in data/errors.jsonl.
  4. HEALTH + DASHBOARD  - /api/health and debug.html show live status anytime.
Run:  python server.py [port]   (default 8000, binds 127.0.0.1 only)
"""
import json
import os
import re
import sys
import time
import random
import threading
import traceback
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
os.makedirs(DATA, exist_ok=True)
FEEDBACK_FILE = os.path.join(DATA, "feedback.json")
ERROR_FILE = os.path.join(DATA, "errors.jsonl")
ASSETS_FILE = os.path.join(ROOT, "assets.json")

VERSION = "1.0.0"
START = time.time()
LOCK = threading.Lock()
REQ_COUNT = 0
MAX_BODY = 1024 * 1024  # 1 MB
MAX_ERRORS = 200

DIALOGUES = [
    ("funny", "Funny mistake", "oh no - that was NOT supposed to happen...", "laughter peak + face-palm", 92),
    ("awkward", "Awkward silence", "...so... anyway...", "2.1s pause, gaze drift", 78),
    ("hype", "Epic win", "LET'S GOOO!", "volume spike + arms up", 95),
    ("shock", "Plot twist", "wait, WHAT?!", "eyebrow raise, zoom-in", 88),
    ("fail", "Fail cam", "my bad, my bad", "stumble / prop drop", 84),
    ("win", "Wholesome praise", "that was actually perfect", "smile + applause tail", 81),
]
EMOS = {d[0] for d in DIALOGUES}
HASHTAGS = "#memes #videoediting #reels #shorts #tiktok #editmateai"


class ApiError(Exception):
    def __init__(self, code, msg):
        super().__init__(msg)
        self.code = code
        self.msg = msg


# ---------------- auto-debug: error intake ----------------
def log_error(msg, url="", where="server"):
    entry = {"ts": time.strftime("%Y-%m-%dT%H:%M:%S"), "where": where,
             "url": (url or "")[:300], "msg": str(msg)[:800]}
    try:
        with LOCK:
            lines = []
            if os.path.exists(ERROR_FILE):
                with open(ERROR_FILE, "r", encoding="utf-8", errors="replace") as f:
                    lines = f.read().splitlines()
            lines.append(json.dumps(entry, ensure_ascii=False))
            with open(ERROR_FILE, "w", encoding="utf-8") as f:
                f.write("\n".join(lines[-MAX_ERRORS:]) + "\n")
    except Exception:
        pass
    print("[autodebug] %s | %s | %s" % (entry["ts"], where, entry["msg"][:160]), flush=True)
    return entry


def read_errors(limit=50):
    try:
        with open(ERROR_FILE, "r", encoding="utf-8", errors="replace") as f:
            lines = [l for l in f.read().splitlines() if l.strip()]
    except FileNotFoundError:
        return []
    out = []
    for l in lines[-max(1, limit):]:
        try:
            out.append(json.loads(l))
        except Exception:
            pass
    return list(reversed(out))


# ---------------- data ----------------
def load_assets():
    try:
        with open(ASSETS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except Exception as e:
        log_error("assets.json unreadable: %s" % e, where="startup")
        return []


ASSETS = load_assets()


def load_feedback():
    try:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except FileNotFoundError:
        return []
    except Exception as e:
        log_error("feedback.json unreadable: %s" % e, where="server")
        return []


def save_feedback(items):
    tmp = FEEDBACK_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(items[-200:], f, ensure_ascii=False, indent=1)
    os.replace(tmp, FEEDBACK_FILE)


# ---------------- core logic (mirrors frontend) ----------------
def analyze(duration):
    try:
        duration = float(duration)
    except (TypeError, ValueError):
        raise ApiError(400, "duration must be a number (seconds)")
    if not (1 <= duration <= 36000):
        raise ApiError(400, "duration must be between 1 and 36000 seconds")
    n = max(4, min(7, round(duration / 9)))
    moments = []
    for i in range(n):
        t = round(duration * (i + 0.7) / n, 1)
        d = DIALOGUES[i % len(DIALOGUES)]
        moments.append({"id": i, "time": t, "emo": d[0], "label": d[1],
                        "dialogue": d[2], "ctx": d[3],
                        "score": d[4] + random.randint(0, 4)})
    if duration > 25 and len(moments) > 1:
        moments[1]["time"] = 18.0
    moments.sort(key=lambda m: m["time"])
    return {"moments": moments, "count": len(moments)}


def score_asset(a, emo):
    s = 0.0
    if emo in (a.get("vibe") or []):
        s += 2
    elif a.get("type") == "meme":
        s += 1
    if a.get("hot"):
        s += 1.2
    return s + random.random()


def suggest(emo, atype="all", query="", limit=10, hot_only=False):
    if emo not in EMOS:
        raise ApiError(400, "emo must be one of: %s" % ", ".join(sorted(EMOS)))
    try:
        limit = max(1, min(25, int(limit)))
    except (TypeError, ValueError):
        raise ApiError(400, "limit must be 1-25")
    q = (query or "").strip().lower()
    ranked = sorted(ASSETS, key=lambda a: score_asset(a, emo), reverse=True)
    out = []
    for a in ranked:
        if hot_only and not a.get("hot"):
            continue
        if atype != "all" and a.get("type") != atype:
            continue
        if q and q not in ("%s %s %s" % (a.get("name", ""), a.get("type", ""), a.get("src", ""))).lower():
            continue
        out.append(a)
        if len(out) >= limit:
            break
    return {"emo": emo, "count": len(out), "assets": out}


def make_caption(placements):
    lines = ["My edit with EditMate AI"]
    for p in (placements or [])[:6]:
        try:
            lines.append("%s %s @ %s" % (p.get("emoji", ""), p.get("name", ""), p.get("t", "")))
        except Exception:
            continue
    lines += ["", HASHTAGS]
    return {"caption": "\n".join(lines)}


def add_feedback(n, a, t):
    n, a, t = (n or "").strip(), (a or "").strip(), (t or "").strip()
    if not t:
        raise ApiError(400, "feedback text is required")
    if len(t) > 2000 or len(n) > 80:
        raise ApiError(400, "feedback too long")
    items = load_feedback()
    items.insert(0, {"n": n or "Anonymous", "a": a or "general",
                     "t": t, "ts": time.strftime("%Y-%m-%dT%H:%M:%S")})
    save_feedback(items)
    return {"ok": True, "count": len(items)}


# ---------------- 9gag proxy (same-origin feed for the Social page) ----------------
# Direct browser calls to meme CDNs are blocked on many networks and lack CORS,
# so the frontend loads these through here instead. Tags are whitelisted (no SSRF).
GAG_TAGS = {"desi", "india", "bollywood", "default",
            "memes", "funny", "dankmemes", "dank-memes",
            "wholesome", "wholesomememes"}
GAG_UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) EditMateAI/1.0"}


def gag_items(payload):
    """Normalize a 9gag JSON payload -> [{id, t, u}]. Pure function (offline-testable)."""
    out = []
    try:
        posts = (payload or {}).get("data", {}).get("posts", []) or []
    except AttributeError:
        return []
    for p in posts:
        try:
            if not isinstance(p, dict) or p.get("nsfw"):
                continue
            if str(p.get("type") or "photo").lower() not in ("photo", "animated"):
                continue
            imgs = p.get("images") or {}
            u = ((imgs.get("image700") or {}).get("url")
                 or (imgs.get("image460") or {}).get("url") or "")
            if not (isinstance(u, str) and u.startswith("http")):
                continue
            anim = ((imgs.get("image460sv") or {}).get("url") or "")
            if not (isinstance(anim, str) and anim.startswith("http")):
                anim = ""
            out.append({"id": str(p.get("id", "")),
                        "t": str(p.get("title", "") or "Untitled")[:140],
                        "u": u, "anim": anim})
        except Exception:
            continue
    return out


def fetch_gag(tag, after=""):
    if tag not in GAG_TAGS:
        raise ApiError(400, "unknown gag tag (allowed: %s)" % ", ".join(sorted(GAG_TAGS)))
    if tag == "default":
        base = "https://9gag.com/v1/group-posts/group/default/type/hot"
    else:
        base = "https://9gag.com/v1/tag-posts/tag/%s/type/hot" % tag
    url = base + ("?after=%s&c=10" % urllib.parse.quote(str(after or ""), safe="") if after else "")
    try:
        req = urllib.request.Request(url, headers=GAG_UA)
        with urllib.request.urlopen(req, timeout=12) as r:
            payload = json.load(r)
    except ApiError:
        raise
    except Exception as e:
        raise ApiError(502, "9gag unreachable: %s" % str(e)[:120])
    items = gag_items(payload)
    return {"tag": tag, "count": len(items), "after": after or "",
            "next": items[-1]["id"] if items else "", "items": items}


# ---------------- startup self-tests (autodebug step 1) ----------------
def self_test():
    checks = []
    m = analyze(60)
    checks.append(("analyze(60) -> 7 moments", m["count"] == 7))
    m2 = analyze(10)
    checks.append(("analyze(10) -> >=4 moments", m2["count"] >= 4))
    s = suggest("funny", limit=5)
    checks.append(("suggest(funny) ranks funny first",
                   bool(s["assets"]) and "funny" in (s["assets"][0].get("vibe") or [])))
    s2 = suggest("win", hot_only=True, limit=25)
    checks.append(("hot_only returns only hot", all(x.get("hot") for x in s2["assets"])))
    c = make_caption([{"emoji": "X", "name": "Test", "t": "00:01.0"}])
    checks.append(("caption has hashtags", "#editmateai" in c["caption"]))
    g = gag_items({"data": {"posts": [
        {"id": "a1", "title": "Desi test", "nsfw": 0, "type": "Animated",
         "images": {"image460": {"url": "https://img-9gag-fun.9cache.com/photo/x_460s.jpg"},
                    "image460sv": {"url": "https://img-9gag-fun.9cache.com/photo/x_460sv.mp4"}}},
        {"id": "a2", "title": "NSFW skip", "nsfw": 1, "type": "photo",
         "images": {"image460": {"url": "https://x/y.jpg"}}},
        {"id": "a3", "title": "Video skip", "nsfw": 0, "type": "video", "images": {}},
    ]}})
    checks.append(("gag_items keeps photo, drops nsfw/video",
                   len(g) == 1 and g[0]["id"] == "a1" and g[0]["anim"].endswith(".mp4")))
    try:
        fetch_gag("evil';DROP", "")
        checks.append(("gag rejects bad tag", False))
    except ApiError as e:
        checks.append(("gag rejects bad tag", e.code == 400))
    try:
        analyze("nope")
        checks.append(("analyze rejects bad input", False))
    except ApiError as e:
        checks.append(("analyze rejects bad input", e.code == 400))
    try:
        suggest("boring")
        checks.append(("suggest rejects bad emo", False))
    except ApiError as e:
        checks.append(("suggest rejects bad emo", e.code == 400))
    try:
        add_feedback("t", "a", "   ")
        checks.append(("feedback rejects empty", False))
    except ApiError:
        checks.append(("feedback rejects empty", True))
    bad = [n for n, ok in checks if not ok]
    for n, ok in checks:
        print("[selftest] %s %s" % ("PASS" if ok else "FAIL", n), flush=True)
    print("[selftest] assets loaded: %d" % len(ASSETS), flush=True)
    if bad:
        raise SystemExit("self-tests failed: %s" % bad)
    return True


# ---------------- auto-debug: stdio guard (detached processes have no console) ----------------
class _Tee:
    """Write to console AND log file; a dead stream never kills the process."""

    def __init__(self, *streams):
        self.streams = streams

    def write(self, s):
        for st in self.streams:
            try:
                st.write(s)
            except Exception:
                pass
        return len(s) if isinstance(s, str) else 0

    def flush(self):
        for st in self.streams:
            try:
                st.flush()
            except Exception:
                pass


def _safe_stdio(path):
    try:
        f = open(path, "a", encoding="utf-8")
    except Exception:
        return
    sys.stdout = _Tee(sys.stdout, f)
    sys.stderr = _Tee(sys.stderr, f)


# ---------------- HTTP layer ----------------
MIME = {".html": "text/html; charset=utf-8", ".js": "text/javascript",
        ".css": "text/css", ".json": "application/json",
        ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
        ".webm": "video/webm", ".mp4": "video/mp4", ".txt": "text/plain"}


class Handler(BaseHTTPRequestHandler):
    server_version = "EditMateAI/1.0"

    def log_message(self, fmt, *args):
        pass  # we log our own request lines

    def _req_id(self):
        global REQ_COUNT
        with LOCK:
            REQ_COUNT += 1
            return REQ_COUNT

    def send_json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        try:
            ln = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            ln = 0
        if ln <= 0 or ln > MAX_BODY:
            raise ApiError(400 if ln > MAX_BODY else 400, "empty or oversized body (max 1MB)")
        try:
            return json.loads(self.rfile.read(ln).decode("utf-8"))
        except ApiError:
            raise
        except Exception:
            raise ApiError(400, "invalid JSON body")

    def serve_static(self, path):
        rel = (path or "/").split("?")[0]
        if rel == "/":
            rel = "/index.html"
        safe = os.path.normpath(rel).lstrip("/\\")
        if safe.startswith("..") or os.path.isabs(safe):
            raise ApiError(403, "forbidden")
        if os.path.basename(safe).startswith("."):
            raise ApiError(403, "forbidden")
        full = os.path.join(ROOT, safe)
        if not os.path.isfile(full):
            raise ApiError(404, "not found: %s" % rel)
        ext = os.path.splitext(full)[1].lower()
        ctype = MIME.get(ext, "application/octet-stream")
        try:
            with open(full, "rb") as f:
                body = f.read()
        except Exception as e:
            raise ApiError(500, "read failed")
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        if ext == ".html":
            self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def route(self, method, path, qs, body):
        if method == "GET" and (path == "/api/health" or path == "/api/health/"):
            return {"ok": True, "version": VERSION, "uptime_s": round(time.time() - START, 1),
                    "requests": REQ_COUNT, "assets": len(ASSETS),
                    "errors_logged": len(read_errors(MAX_ERRORS))}
        if method == "GET" and path == "/api/assets":
            return {"count": len(ASSETS), "assets": ASSETS}
        if method == "GET" and path == "/api/gag":
            tag = str((qs.get("tag") or ["default"])[0])[:20]
            after = str((qs.get("after") or [""])[0])[:40]
            return fetch_gag(tag, after)
        if method == "POST" and path == "/api/analyze":
            return analyze((body or {}).get("duration"))
        if method == "POST" and path == "/api/suggest":
            b = body or {}
            return suggest(b.get("emo"), b.get("type", "all"), b.get("query", ""),
                           b.get("limit", 10), bool(b.get("hot_only")))
        if method == "POST" and path == "/api/caption":
            return make_caption((body or {}).get("placements"))
        if method == "GET" and path == "/api/feedback":
            return {"count": len(load_feedback()), "items": load_feedback()}
        if method == "POST" and path == "/api/feedback":
            b = body or {}
            return add_feedback(b.get("n"), b.get("a"), b.get("t"))
        if method == "POST" and path == "/api/report":
            b = body or {}
            msg = str(b.get("msg", ""))[:800] or "empty client report"
            log_error(msg, url=str(b.get("url", ""))[:300], where="browser")
            return {"ok": True}
        if method == "GET" and path == "/api/errors":
            try:
                limit = max(1, min(200, int((qs.get("limit") or ["50"])[0])))
            except ValueError:
                limit = 50
            return {"count": len(read_errors(limit)), "errors": read_errors(limit)}
        if method == "POST" and path == "/api/errors/clear":
            try:
                open(ERROR_FILE, "w", encoding="utf-8").write("")
            except Exception:
                pass
            return {"ok": True}
        if path.startswith("/api/"):
            raise ApiError(404, "unknown api route: %s %s" % (method, path))
        if method == "GET":
            return self.serve_static(path)
        raise ApiError(405, "method not allowed")

    def handle_one(self, method):
        rid = self._req_id()
        t0 = time.time()
        parsed = urlparse(self.path)
        try:
            body = self.read_json() if method == "POST" else None
            if method == "POST" and parsed.path.startswith("/api/") and body is None:
                body = {}
            res = self.route(method, parsed.path, parse_qs(parsed.query), body)
            if res is not None:
                self.send_json(200, res)
        except ApiError as e:
            self.send_json(e.code, {"ok": False, "error": e.msg})
        except BrokenPipeError:
            pass
        except Exception:
            log_error(traceback.format_exc(limit=3), url=self.path, where="server")
            try:
                self.send_json(500, {"ok": False, "error": "internal error (logged for auto-debug)"})
            except Exception:
                pass
        finally:
            dt = (time.time() - t0) * 1000
            slow = " SLOW" if dt > 1000 else ""
            print("[req #%d] %s %s %.0fms%s" % (rid, method, parsed.path, dt, slow), flush=True)

    def do_GET(self):
        self.handle_one("GET")

    def do_POST(self):
        self.handle_one("POST")


def main():
    _safe_stdio(os.path.join(DATA, "server.log"))
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("usage: python server.py [port]")
            return 2
    print("[boot] EditMate AI backend v%s — running self-tests…" % VERSION, flush=True)
    self_test()
    print("[boot] self-tests passed. Serving %s on http://127.0.0.1:%d" % (ROOT, port), flush=True)
    print("[boot] auto-debug active: requests logged, errors -> data/errors.jsonl, dashboard at /debug.html", flush=True)
    srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n[boot] stopped.", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
