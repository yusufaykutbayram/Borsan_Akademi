const oracledb = require('oracledb');

async function checkHakedisApi() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("TRIFM_IZIN_HAKEDIS_API inceleniyor...");

    const result = await connection.execute(
      `SELECT procedure_name 
       FROM all_procedures 
       WHERE object_name = 'TRIFM_IZIN_HAKEDIS_API' AND owner = 'IFSAPP'`
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

checkHakedisApi();
