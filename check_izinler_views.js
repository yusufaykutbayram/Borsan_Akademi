const oracledb = require('oracledb');

async function checkIzinlerViews() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    for (let i = 1; i <= 4; i++) {
      console.log(`TRIFM_IZINLER${i} inceleniyor...`);
      const result = await connection.execute(
        `SELECT * FROM IFSAPP.TRIFM_IZINLER${i} FETCH FIRST 1 ROWS ONLY`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (result.rows.length > 0) {
        console.log(`Sütunlar (${i}):`, Object.keys(result.rows[0]));
        console.log(`Örnek (${i}):`, result.rows[0]);
      }
    }

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

checkIzinlerViews();
