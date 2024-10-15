@echo off
setlocal enabledelayedexpansion
set i=161
for %%f in (*.*) do (
  ren "%%f" "!i!%%~xf"
  set /a i+=1
)
