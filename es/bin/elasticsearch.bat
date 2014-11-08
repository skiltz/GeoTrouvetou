@echo off

SETLOCAL
TITLE GeoTrouvetou Elasticsearch 1.4.0

set JAVA_HOME="c:\PROGRA~1\JAVA\jre7"

CALL %~dp0elasticsearch.in.bat

"%JAVA_HOME%\bin\java" %JAVA_OPTS% %ES_JAVA_OPTS% %ES_PARAMS% %* -cp "%ES_CLASSPATH%" "org.elasticsearch.bootstrap.Elasticsearch"

ENDLOCAL