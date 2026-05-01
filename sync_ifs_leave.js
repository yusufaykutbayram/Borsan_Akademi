const oracledb = require('oracledb');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncIfsLeave() {
  let connection;

  try {
    // 1. IFS Oracle Bağlantısı
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("IFS Bağlantısı Başarılı. Senkronizasyon başlıyor...");

    // 2. Sistemdeki tüm personelleri çek
    const users = await prisma.user.findMany({
      where: { sicil_no: { not: null } }
    });

    console.log(`${users.length} personel için veri güncellenecek.`);

    const companyId = 'BORSAN';
    const today = new Date();
    const izinKodu = '01'; // Yıllık İzin Kodu

    for (const user of users) {
      try {
        // IFS API'den verileri çek
        const resHakedilen = await connection.execute(
          `SELECT IFSAPP.TRIFM_IZINLER_API.GET_HAKEDILEN(:comp, :emp, :tarih) FROM DUAL`,
          { comp: companyId, emp: user.sicil_no, tarih: today }
        );

        const resKullanilan = await connection.execute(
          `SELECT IFSAPP.TRIFM_IZINLER_API.GET_IZIN_KULLANILAN(:comp, :emp, :kod, :tarih) FROM DUAL`,
          { comp: companyId, emp: user.sicil_no, kod: izinKodu, tarih: today }
        );

        const resKalan = await connection.execute(
          `SELECT IFSAPP.TRIFM_IZINLER_API.GET_IZIN_LIMIT(:comp, :emp, :kod, :tarih) FROM DUAL`,
          { comp: companyId, emp: user.sicil_no, kod: izinKodu, tarih: today }
        );

        const hakedilen = resHakedilen.rows[0][0] || 0;
        const kullanilan = resKullanilan.rows[0][0] || 0;
        const kalan = hakedilen - kullanilan;

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

      } catch (userErr) {
        console.error(`${user.name} (${user.sicil_no}) güncellenirken hata:`, userErr.message);
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

syncIfsLeave();
