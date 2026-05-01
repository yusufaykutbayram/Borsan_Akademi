const oracledb = require('oracledb');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncIfsLeaveOneByOneFinal() {
  let connection;

  try {
    // 1. IFS Oracle Bağlantısı
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("IFS Bağlantısı Başarılı. Tek tek veri çekiliyor...");

    // 2. Sistemdeki personelleri al
    const users = await prisma.user.findMany({
      where: { sicil_no: { not: null } },
      select: { id: true, name: true, sicil_no: true }
    });

    console.log(`${users.length} personel güncelleniyor...`);

    for (const user of users) {
      try {
        // Özet Veri (TRIFM_IZINLER4)
        const resSummary = await connection.execute(
          `SELECT TOPLAM_HAKETTIGI_IZIN, TOPLAM_KULLANDIGI_IZIN, KALAN_IZIN 
           FROM IFSAPP.TRIFM_IZINLER4 
           WHERE EMP_NO = :emp AND COMPANY_ID = 'BORSAN'
           FETCH FIRST 1 ROWS ONLY`,
          { emp: user.sicil_no },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        // Hak Ediş Tarihi (TRIFM_IZINLER3)
        const resDate = await connection.execute(
          `SELECT MAX(HAK_TAR) as HAK_TAR 
           FROM IFSAPP.TRIFM_IZINLER3 
           WHERE EMP_NO = :emp AND COMPANY_ID = 'BORSAN'
           GROUP BY EMP_NO`,
          { emp: user.sicil_no },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const summary = resSummary.rows[0];
        const hakTar = resDate.rows[0]?.HAK_TAR;

        const hakedilen = parseFloat(summary?.TOPLAM_HAKETTIGI_IZIN) || 0;
        const kullanilan = Math.abs(parseFloat(summary?.TOPLAM_KULLANDIGI_IZIN)) || 0;
        const kalan = parseFloat(summary?.KALAN_IZIN) || 0;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            annual_leave_entitled: hakedilen,
            annual_leave_used: kullanilan,
            annual_leave_remaining: kalan,
            annual_leave_entitlement_date: hakTar ? new Date(hakTar) : null
          }
        });

        console.log(`Güncellendi: ${user.name} (${user.sicil_no}) -> Hak: ${hakedilen}, Kul: ${kullanilan}, Kalan: ${kalan}, Hak.Tar: ${hakTar ? new Date(hakTar).toLocaleDateString('tr-TR') : '-'}`);

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

syncIfsLeaveOneByOneFinal();
