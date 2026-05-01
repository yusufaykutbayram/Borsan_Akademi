const oracledb = require('oracledb');

async function peekLimit() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("TRIFM_LIMIT_KONTROL inceleniyor...");

    const result = await connection.execute(
      `SELECT * FROM IFSAPP.TRIFM_LIMIT_KONTROL FETCH FIRST 1 ROWS ONLY`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      console.log("Sütunlar:", Object.keys(result.rows[0]));
      console.log("Örnek:", result.rows[0]);
    } else {
      console.log("Tablo boş.");
    }

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

peekLimit();
