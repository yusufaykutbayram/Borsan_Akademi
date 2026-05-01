const oracledb = require('oracledb');

async function findFunctions() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("API paketi fonksiyonları inceleniyor...");

    const result = await connection.execute(
      `SELECT procedure_name 
       FROM all_procedures 
       WHERE object_name = 'TRIFM_IZINLER_API' AND owner = 'IFSAPP'
       FETCH FIRST 50 ROWS ONLY`
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

findFunctions();
