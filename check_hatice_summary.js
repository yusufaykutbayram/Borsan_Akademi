const oracledb = require('oracledb');

async function checkHaticeSummary() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("Hatice (7661) Özeti...");
    const result = await connection.execute(
      `SELECT * FROM IFSAPP.TRIFM_IZINLER4 WHERE EMP_NO = '7661'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
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

checkHaticeSummary();
