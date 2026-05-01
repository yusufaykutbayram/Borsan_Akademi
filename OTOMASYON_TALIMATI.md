# Borsan Akademi İzin Senkronizasyonu Otomasyon Talimatı

Bu belge, IFS (Oracle) veritabanındaki izin bilgilerinin Borsan Akademi web sitesine her gün otomatik olarak nasıl aktarılacağını açıklar.

## Gerekli Dosyalar
Proje klasöründe (`C:\Users\yusufbayram\.gemini\antigravity\scratch\Borsan_Akademi`) şu dosyalar hazır durumdadır:
1.  **sync_ifs_leave.js**: Senkronizasyon mantığını içeren Node.js betiği.
2.  **auto_sync_leave.bat**: Bu betiği çalıştıran ve kayıt (log) tutan komut dosyası.

## Otomatik Görev Kurulumu (Windows)

Senkronizasyonu her gün otomatik çalıştırmak için şu adımları izleyin:

1.  **Görev Zamanlayıcıyı Açın:** Windows arama çubuğuna "Görev Zamanlayıcı" (Task Scheduler) yazıp açın.
2.  **Yeni Görev:** Sağ panelden "Temel Görev Oluştur..." seçeneğine tıklayın.
3.  **Ad ve Açıklama:** 
    *   **Ad:** `Borsan Izin Senkronizasyonu`
    *   **Açıklama:** `IFS Oracle veritabanından izin verilerini günlük çeker.`
4.  **Tetikleyici:** "Günlük" seçeneğini işaretleyin.
5.  **Zamanlama:** Senkronizasyonun her gün hangi saatte çalışmasını istiyorsanız onu belirleyin (Örnek: 08:00).
6.  **Eylem:** "Program Başlat" seçeneğini seçin.
7.  **Dosya Seçimi:** "Gözat" butonuna basın ve şu dosyayı seçin:
    `C:\Users\yusufbayram\.gemini\antigravity\scratch\Borsan_Akademi\auto_sync_leave.bat`
8.  **Başlangıç Yeri (Önemli):** "Başlangıç yeri (isteğe bağlı)" kutusuna şu yolu yapıştırın:
    `C:\Users\yusufbayram\.gemini\antigravity\scratch\Borsan_Akademi\`
9.  **Bitir:** "Son" butonuna tıklayarak görevi kaydedin.

## Kontrol ve Hata Ayıklama
Senkronizasyonun çalışıp çalışmadığını proje klasöründeki **sync_log.txt** dosyasından takip edebilirsiniz. Bu dosyada her gün yapılan işlemin başarı durumu ve varsa hata mesajları tarihli olarak kaydedilir.

---
*Hazırlayan: Antigravity AI Assistant*
*Tarih: 1 Mayıs 2026*
