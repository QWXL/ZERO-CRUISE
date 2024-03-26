cd %cd%
echo CreateObject("Scripting.FileSystemObject").DeleteFile(WScript.ScriptFullName) >%Temp%\Wait.vbs
echo wscript.sleep 1000 >>%Temp%\Wait.vbs
start /wait %Temp%\Wait.vbs
start full-setup.exe
exit 0


