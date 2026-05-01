const oracledb = require('oracledb');

async function peekAbsence() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("ABSENCE_LIMIT inceleniyor...");

    const result = await connection.execute(
      `SELECT * FROM IFSAPP.ABSENCE_LIMIT FETCH FIRST 1 ROWS ONLY`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log("Sütunlar:", Object.keys(result.rows[0]));
    console.log("Örnek:", result.rows[0]);

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

peekAbsence();
