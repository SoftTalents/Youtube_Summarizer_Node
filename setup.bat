@echo off
echo ====================================
echo  SummarAI MCP Server Setup
echo ====================================
echo.

echo 1. Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 2. Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build project
    pause
    exit /b 1
)

echo.
echo 3. Testing the server...
call npm test

echo.
echo ====================================
echo  Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Update package.json with your information (author, repository, etc.)
echo 2. Run 'npm login' to login to npm
echo 3. Run 'npm publish' to publish your package
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo.
pause
