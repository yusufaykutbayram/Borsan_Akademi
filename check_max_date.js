const oracledb = require('oracledb');

async function checkMaxDate() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    const result = await connection.execute(
      `SELECT MAX(RAPOR_TARIHI) FROM IFSAPP.TRIFM_IZINLER4`
    );

    console.log("En güncel rapor tarihi:", result.rows[0][0]);

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

checkMaxDate();
