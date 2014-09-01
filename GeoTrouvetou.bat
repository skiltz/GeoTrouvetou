@echo off
start "" "chrome-win32\chrome.exe" --debug-devtools-frontend --js-flags="--expose_gc" http://localhost:8080/