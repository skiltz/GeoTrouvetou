@ECHO OFF
SETLOCAL EnableDelayedExpansion

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::                                                                                ::
::  Node.js Portable                                                              ::
::                                                                                ::
::  A DOS Batch script to make Node.js portable on Windows systems.               ::
::                                                                                ::
::  Copyright (C) 2013-2014 Cr@zy <webmaster@crazyws.fr>                          ::
::                                                                                ::
::  Node.js Portable is free software; you can redistribute it and/or modify      ::
::  it under the terms of the GNU Lesser General Public License as published by   ::
::  the Free Software Foundation, either version 3 of the License, or             ::
::  (at your option) any later version.                                           ::
::                                                                                ::
::  Node.js Portable is distributed in the hope that it will be useful,           ::
::  but WITHOUT ANY WARRANTY; without even the implied warranty of                ::
::  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the                  ::
::  GNU Lesser General Public License for more details.                           ::
::                                                                                ::
::  You should have received a copy of the GNU Lesser General Public License      ::
::  along with this program. If not, see http://www.gnu.org/licenses/.            ::
::                                                                                ::
::  Related post: http://goo.gl/gavL4                                             ::
::  Usage: nodejs-portable.bat                                                    ::
::                                                                                ::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

TITLE GeoTrouvetou Server

:: Settings
SET nodejsVersion=0.10.26
SET nodejsArch=x86

:: Batch vars (no edits necessary)
SET nodejsPath=%~dp0
SET nodejsPath=!nodejsPath:~0,-1!
SET nodejsWork=%nodejsPath%\app
SET npmPath=%nodejsPath%\node_modules\npm
SET npmGlobalConfigFilePath=%npmPath%\npmrc
SET nodejsInstallVbs=%TEMP%\nodejs_install.vbs
SET nodejsMsiPackage=node-v%nodejsVersion%-%nodejsArch%.msi
IF %nodejsArch%==x64 SET nodejsUrl=http://nodejs.org/dist/v%nodejsVersion%/x64/%nodejsMsiPackage%
IF %nodejsArch%==x86 SET nodejsUrl=http://nodejs.org/dist/v%nodejsVersion%/%nodejsMsiPackage%

rem Ensure this Node.js and npm are first in the PATH
set PATH=%APPDATA%\npm;%~dp0;%PATH%

setlocal enabledelayedexpansion
pushd "%~dp0"

rem Figure out the node version.
set print_version=.\node.exe -p -e "process.versions.node + ' (' + process.arch + ')'"
for /F "usebackq delims=" %%v in (`%print_version%`) do set version=%%v

rem Print message.
if exist npm.cmd (
  echo Your environment has been set up for using Node.js !version! and npm.
) else (
  echo Your environment has been set up for using Node.js !version!.
)

start "" /MIN "cmd /C ..\es\bin\elasticsearch.bat"

node app/app.js
popd
endlocal
