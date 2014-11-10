@echo off

set APPDATA=%~dp0josm
set JAVA_HOME=%~dp0jre
set PATH=%~dp0jre\bin;%PATH%

javaws -J-Djava.net.useSystemProxies=true josm\josm.jnlp