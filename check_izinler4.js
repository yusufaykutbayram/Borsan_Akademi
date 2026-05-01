const oracledb = require('oracledb');

async function checkIzinler4() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("TRIFM_IZINLER4 inceleniyor...");
    const result = await connection.execute(
      `SELECT * FROM IFSAPP.TRIFM_IZINLER4 FETCH FIRST 5 ROWS ONLY`,
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

checkIzinler4();
