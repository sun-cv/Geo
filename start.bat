@echo off
cd C:\dev\project\geo\dev

call "C:\Users\sun\AppData\Roaming\npm\pm2.cmd" start Geo

if errorlevel 1 (
    call "C:\Users\sun\AppData\Roaming\npm\pm2.cmd" start main.js --name Geo
    call "C:\Users\sun\AppData\Roaming\npm\pm2.cmd" save
)
