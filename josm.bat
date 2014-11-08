SET APPDATA=JOSM
SET mypath=%~dp0
set JAVA_HOME=%mypath%jre7

javaws -J-Djava.net.useSystemProxies=true josm.jnlp
