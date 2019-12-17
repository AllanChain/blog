@echo off

:ask_type
set /p blog_type="0 for programing, 1 for acdemy: "

if %blog_type%==0 set blog_folder="programing"
if %blog_type%==1 set blog_folder="academy"

if not defined blog_folder goto ask_type

set /p blog_name="______.md: "

hugo new %blog_folder%/%blog_name%.md

explorer content\%blog_folder%\%blog_name%.md

pause
