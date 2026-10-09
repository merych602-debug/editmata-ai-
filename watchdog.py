#!/usr/bin/env python3
"""EditMate AI watchdog: keeps the backend alive (auto-heal layer).

Polls /api/health; if the server process dies or stops answering,
it restarts it. Gives up after MAX_RESTARTS failures in WINDOW_S.
Run (it daemonizes itself via the launcher):  python watchdog.py [port]
"""
import subprocess
import sys
import time
import os
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(ROOT, "data", "watchdog.log")
MAX_RESTARTS = 5
WINDOW_S = 300
CHECK_EVERY = 10
FAIL_BEFORE_RESTART = 3


def log(msg):
    line = "[%s] %s" % (time.strftime("%Y-%m-%d %H:%M:%S"), msg)
    print(line, flush=True)
    try:
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def healthy(port):
    try:
        with urllib.request.urlopen("http://127.0.0.1:%d/api/health" % port, timeout=5) as r:
            return r.status == 200
    except Exception:
        return False


def main():
    try:
        _f = open(os.path.join(ROOT, "data", "watchdog.out.log"), "a", encoding="utf-8")
        _old, _olderr = sys.stdout, sys.stderr

        class _Tee:
            def __init__(self, *s):
                self.s = s

            def write(self, t):
                for st in self.s:
                    try:
                        st.write(t)
                    except Exception:
                        pass
                return len(t) if isinstance(t, str) else 0

            def flush(self):
                for st in self.s:
                    try:
                        st.flush()
                    except Exception:
                        pass

        sys.stdout = _Tee(_old, _f)
        sys.stderr = _Tee(_olderr, _f)
    except Exception:
        pass
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    restarts = []
    fails = 0
    proc = None
    log("watchdog watching port %d" % port)
    try:
        while True:
            alive = proc is not None and proc.poll() is None
            if not alive or not healthy(port):
                fails += 1
                log("unhealthy (fail %d/%d, process alive=%s)" % (fails, FAIL_BEFORE_RESTART, alive))
            else:
                fails = 0
            if fails >= FAIL_BEFORE_RESTART:
                now = time.time()
                restarts = [t for t in restarts if now - t < WINDOW_S]
                if len(restarts) >= MAX_RESTARTS:
                    log("GIVING UP: %d restarts in %ds — needs a human" % (MAX_RESTARTS, WINDOW_S))
                    return 1
                if proc is not None:
                    try:
                        proc.kill()
                    except Exception:
                        pass
                log("restarting backend…")
                _slog = open(os.path.join(ROOT, "data", "server.log"), "a", encoding="utf-8")
                proc = subprocess.Popen([sys.executable, os.path.join(ROOT, "server.py"), str(port)],
                                        cwd=ROOT, stdout=_slog, stderr=subprocess.STDOUT,
                                        stdin=subprocess.DEVNULL)
                restarts.append(now)
                fails = 0
                time.sleep(6)
                log("restarted (alive=%s healthy=%s)" % (proc.poll() is None, healthy(port)))
            if proc is None:
                log("starting backend…")
                _slog = open(os.path.join(ROOT, "data", "server.log"), "a", encoding="utf-8")
                proc = subprocess.Popen([sys.executable, os.path.join(ROOT, "server.py"), str(port)],
                                        cwd=ROOT, stdout=_slog, stderr=subprocess.STDOUT,
                                        stdin=subprocess.DEVNULL)
                time.sleep(6)
            time.sleep(CHECK_EVERY)
    except KeyboardInterrupt:
        log("watchdog stopped.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
