@echo off
SETLOCAL

:ask_type
set /p blog_type="0 for programing, 1 for acdemy: "

if %blog_type%==0 set blog_folder="programing"
if %blog_type%==1 set blog_folder="academy"

if not defined blog_folder goto ask_type

set /p blog_name="blog post file name: "
set /p create_folder="need a folder? Empty means no: "

if "%create_folder%" == "" (
    hugo new %blog_folder%/%blog_name%.md
    explorer content\%blog_folder%\%blog_name%.md
) else (
    hugo new %blog_folder%/%blog_name%/index.md
    explorer content\%blog_folder%\%blog_name%
    explorer content\%blog_folder%\%blog_name%\index.md
)
ENDLOCAL
