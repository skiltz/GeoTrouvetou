@echo off

set JAVA_HOME=%~dp0jre
set PATH=%~dp0jre\bin;%PATH%

SETLOCAL
rem ELASTIC SEARCH
pushd "%~dp0es\bin"
CALL %~dp0es\bin\elasticsearch.in.bat

rem set ES_PARAMS=%ES_PARAMS% -Des.node.data=true

start "GeoTrouvetou Elasticsearch 1.4.0" /MIN "%JAVA_HOME%\bin\java" %JAVA_OPTS% %ES_JAVA_OPTS% %ES_PARAMS% %* -cp "%ES_CLASSPATH%" "org.elasticsearch.bootstrap.Elasticsearch"
popd

rem NODEJS
pushd "%~dp0nodejs"

CALL %~dp0nodejs/nodevars.bat
start "GeoTrouvetou Server" /MIN "%~dp0nodejs/node.exe" "%~dp0server/server.js"

popd
ENDLOCAL