@echo off
cd /d "%~dp0"
echo Starting EditMate AI on http://localhost:8000/ ...
echo Keep this window open, then open the link in your browser.
python server.py 8000
pause
