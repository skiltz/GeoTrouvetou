@echo off

SETLOCAL
TITLE GeoTrouvetou Elasticsearch 1.4.0

SET mypath=%~dp0
set JAVA_HOME=%mypath%jre7

CALL %~dp0elasticsearch.in.bat

"%JAVA_HOME%\bin\java" %JAVA_OPTS% %ES_JAVA_OPTS% %ES_PARAMS% %* -cp "%ES_CLASSPATH%" "org.elasticsearch.bootstrap.Elasticsearch"

ENDLOCAL
