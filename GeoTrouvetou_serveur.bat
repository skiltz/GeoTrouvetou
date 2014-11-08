@ECHO OFF
delete es\log\*.* /Q
start "" /MIN "cmd /C es\bin\elasticsearch.bat"
start "" /MIN "cmd /C node\app.bat"

