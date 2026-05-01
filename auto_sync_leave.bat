@echo off
cd /d "C:\Users\yusufbayram\.gemini\antigravity\scratch\Borsan_Akademi"
echo [%date% %time%] Senkronizasyon baslatiliyor... >> sync_log.txt
node sync_ifs_leave.js >> sync_log.txt 2>&1
echo [%date% %time%] Senkronizasyon tamamlandi. >> sync_log.txt
echo ------------------------------------------ >> sync_log.txt
