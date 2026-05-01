const oracledb = require('oracledb');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncIfsLeaveOneByOne() {
  let connection;

  try {
    // 1. IFS Oracle Bağlantısı
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("IFS Bağlantısı Başarılı. TRIFM_IZINLER4 üzerinden tek tek veri çekiliyor...");

    // 2. Sistemdeki tüm personelleri çek
    const users = await prisma.user.findMany({
      where: { sicil_no: { not: null } }
    });

    console.log(`${users.length} personel için güncelleniyor...`);

    for (const user of users) {
      try {
        const result = await connection.execute(
          `SELECT TOPLAM_HAKETTIGI_IZIN, TOPLAM_KULLANDIGI_IZIN, KALAN_IZIN 
           FROM IFSAPP.TRIFM_IZINLER4 
           WHERE EMP_NO = :emp AND COMPANY_ID = 'BORSAN'
           FETCH FIRST 1 ROWS ONLY`,
          { emp: user.sicil_no },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length > 0) {
            const row = result.rows[0];
            const hakedilen = parseFloat(row.TOPLAM_HAKETTIGI_IZIN) || 0;
            const kullanilan = Math.abs(parseFloat(row.TOPLAM_KULLANDIGI_IZIN)) || 0;
            const kalan = parseFloat(row.KALAN_IZIN) || 0;

            // Prisma'da güncelle
            await prisma.user.update({
              where: { id: user.id },
              data: {
                annual_leave_entitled: hakedilen,
                annual_leave_used: kullanilan,
                annual_leave_remaining: kalan
              }
            });

            console.log(`Güncellendi: ${user.name} (${user.sicil_no}) -> Hak: ${hakedilen}, Kul: ${kullanilan}, Kalan: ${kalan}`);
        } else {
            console.warn(`Uyarı: ${user.name} (${user.sicil_no}) için özet veri bulunamadı.`);
        }

      } catch (err) {
        console.error(`${user.name} için hata:`, err.message);
      }
    }

    console.log("--- Senkronizasyon Tamamlandı ---");

  } catch (err) {
    console.error("Ana hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
    await prisma.$disconnect();
  }
}

syncIfsLeaveOneByOne();
