const oracledb = require('oracledb');

async function checkHesapSekli() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    const result = await connection.execute(
      `SELECT DISTINCT IZIN_HESAP_SEKLI FROM IFSAPP.TRIFM_IZINLER1`
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

checkHesapSekli();
