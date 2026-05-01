const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const oracledb = require('oracledb'); // Oracle kullanmak isterseniz: npm install oracledb

/**
 * BU BETİĞİ YEREL BİLGİSAYARINIZDA ÇALIŞTIRMALISINIZ.
 * Oracle veritabanına bağlanıp yıllık izin verilerini çeker ve Bulut (Neon) veritabanına aktarır.
 */

async function syncFromOracle() {
  console.log("--- Oracle Yıllık İzin Senkronizasyonu Başladı ---");

  // ÖNEMLİ: Oracle bağlantı bilgilerinizi buraya girin
  const oracleConfig = {
    user: "ORACLE_KULLANICI_ADI",
    password: "ORACLE_SIFRESI",
    connectString: "localhost:1521/xe" // veya host:port/service_name
  };

  let connection;

  try {
    /* 
    // ORACLE BAĞLANTISI (oracledb paketi yüklü olmalıdır)
    connection = await oracledb.getConnection(oracleConfig);
    const result = await connection.execute(
      `SELECT SICIL_NO, KALAN_IZIN FROM PERSONEL_IZIN_TABLOSU`
    );
    const rows = result.rows; // [[ '8196', 15 ], [ '5088', 12 ], ...]
    */

    // TEST VERİSİ (Oracle bağlantınız hazır olana kadar simüle edebilirsiniz)
    const mockData = [
      { sicil: '8196', izin: 18.5 },
      { sicil: '5088', izin: 12.0 },
      { sicil: '4625', izin: 7.0 }
    ];

    console.log(`${mockData.length} personelin verisi işleniyor...`);

    for (const data of mockData) {
      const user = await prisma.user.findUnique({
        where: { sicil_no: data.sicil }
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { annual_leave_days: data.izin }
        });
        console.log(`Güncellendi: ${user.name} (${data.sicil}) -> ${data.izin} gün`);
      } else {
        console.warn(`Uyarı: Sicil No ${data.sicil} veritabanında bulunamadı.`);
      }
    }

    console.log("--- Senkronizasyon Başarıyla Tamamlandı ---");
  } catch (err) {
    console.error("Hata oluştu:", err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    await prisma.$disconnect();
  }
}

syncFromOracle();
