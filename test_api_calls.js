const oracledb = require('oracledb');

async function callFunctionsCorrect() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    const empNo = '3580';
    const companyId = 'BORSAN';
    const today = new Date();

    console.log(`Personel ${empNo} için API çağrıları yapılıyor...`);

    // Hakedilen İzin
    const hakedilen = await connection.execute(
      `SELECT IFSAPP.TRIFM_IZINLER_API.GET_HAKEDILEN(:comp, :emp, :tarih) FROM DUAL`,
      { comp: companyId, emp: empNo, tarih: today }
    );

    // Kullanılan İzin
    const kullanılan = await connection.execute(
      `SELECT IFSAPP.TRIFM_IZINLER_API.GET_IZIN_KULLANILAN(:comp, :emp, :tarih) FROM DUAL`,
      { comp: companyId, emp: empNo, tarih: today }
    );

    // İzin Limit (Kalan?)
    const limit = await connection.execute(
      `SELECT IFSAPP.TRIFM_IZINLER_API.GET_IZIN_LIMIT(:comp, :emp, :tarih) FROM DUAL`,
      { comp: companyId, emp: empNo, tarih: today }
    );

    console.log("Sonuçlar:");
    console.log("Hakedilen:", hakedilen.rows[0][0]);
    console.log("Kullanılan:", kullanılan.rows[0][0]);
    console.log("Limit (Kalan?):", limit.rows[0][0]);

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

callFunctionsCorrect();
