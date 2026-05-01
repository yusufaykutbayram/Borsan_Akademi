const oracledb = require('oracledb');

async function checkIzinKodlari() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("Sistemdeki İzin Kodları inceleniyor...");

    const result = await connection.execute(
      `SELECT DISTINCT IZIN_KODU FROM IFSAPP.TRIFM_IZINLER`
    );

    console.table(result.rows);

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

checkIzinKodlari();
