@echo off

start "" "%~dp0chromium\chrome.exe" --debug-devtools-frontend --js-flags="--expose_gc" http://localhost:8080/
