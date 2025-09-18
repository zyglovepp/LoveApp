@echo off

REM 检查Python是否可用
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到Python。请先安装Python。
    pause
    exit /b 1
)

REM 设置环境变量
echo 设置Flask环境变量...
set FLASK_APP=app.py
set FLASK_ENV=development

REM 启动Flask应用
echo 正在启动Love APP...
python -m flask run --host=0.0.0.0 --port=5000

REM 如果启动失败，显示错误信息
if %errorlevel% neq 0 (
    echo 应用启动失败，请检查错误信息。
    pause
    exit /b 1
)

pause