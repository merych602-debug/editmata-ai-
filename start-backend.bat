@echo off
cd /d "%~dp0"
echo EditMate AI backend -> http://localhost:8000/
echo Dashboard         -> http://localhost:8000/debug.html
echo Keep this window open. Press Ctrl+C to stop.
python server.py 8000
pause
