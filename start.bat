@echo off
<<<<<<< HEAD
cd C:\dev\project\geo\dev
=======
cd C:\dev\projects\geo\prod
>>>>>>> 2fadb41aadff3e28f7cb0f1e15e9ef868c1cf78c

call "C:\Users\sun\AppData\Roaming\npm\pm2.cmd" start Geo

if errorlevel 1 (
    call "C:\Users\sun\AppData\Roaming\npm\pm2.cmd" start main.js --name Geo
    call "C:\Users\sun\AppData\Roaming\npm\pm2.cmd" save
)
