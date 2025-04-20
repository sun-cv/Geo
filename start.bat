@echo off
cd C:\coding\Project\geo
pm2 start main.js --name "Geo"
pm2 Log Geo