@echo off

SETLOCAL
TITLE GeoTrouvetou Elastic Elasticsearch 1.3.2
set JAVA_HOME="c:\PROGRA~1\JAVA\jre7"

CALL %~dp0elasticsearch.in.bat

set ES_CLASSPATH=%ES_CLASSPATH%;%ES_HOME%/lib/elasticsearch-1.3.2.jar;%ES_HOME%/lib/*;%ES_HOME%/lib/sigar/*
set ES_PARAMS=-Delasticsearch -Des-foreground=yes -Des.path.home="%ES_HOME%" -Des.node.data=true

"%JAVA_HOME%\bin\java" %JAVA_OPTS% %ES_JAVA_OPTS% %ES_PARAMS% %* -cp "%ES_CLASSPATH%" "org.elasticsearch.bootstrap.Elasticsearch"

ENDLOCAL