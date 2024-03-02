echo CreateObject("Scripting.FileSystemObject").DeleteFile(WScript.ScriptFullName) >%Temp%\Wait.vbs
echo wscript.sleep 1000 >>%Temp%\Wait.vbs
start /wait %Temp%\Wait.vbs
taskkill /im "ZERO Cruise Installer and Updater.exe" /F
rd %LocalAppData%\cruise_installer /S /Q
exit 0