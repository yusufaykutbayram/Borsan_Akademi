const oracledb = require('oracledb');

async function peekTable() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("Bağlantı başarılı. Sütunlar inceleniyor...");

    const result = await connection.execute(
      `SELECT * FROM IFSAPP.TRIFM_IZINLER FETCH FIRST 1 ROWS ONLY`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log("Sütun İsimleri:");
    console.log(Object.keys(result.rows[0]));
    console.log("Örnek Veri:");
    console.log(result.rows[0]);

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

peekTable();
