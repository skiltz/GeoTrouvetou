@echo off

set JAVA_HOME=%~dp0jre
set PATH=%~dp0jre\bin;%PATH%

SETLOCAL
TITLE GeoTrouvetou-data Elasticsearch 1.4.0
pushd "%~dp0es\bin"
CALL %~dp0es\bin\elasticsearch.in.bat

set ES_PARAMS=%ES_PARAMS% -Des.node.data=true

start "GeoTrouvetou-data Elasticsearch 1.4.0" /MIN "%JAVA_HOME%\bin\java" %JAVA_OPTS% %ES_JAVA_OPTS% %ES_PARAMS% %* -cp "%ES_CLASSPATH%" "org.elasticsearch.bootstrap.Elasticsearch"
popd
ENDLOCAL