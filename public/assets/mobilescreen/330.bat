@echo off
setlocal enabledelayedexpansion
set i=1
for %%f in (*.*) do (
  ren "%%f" "!i!%%~xf"
  set /a i+=1
)
