const oracledb = require('oracledb');

async function checkColumnsDetailed() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("TRIFM_IZINLER_CFV sütunları detaylı inceleniyor...");

    const result = await connection.execute(
      `SELECT column_name 
       FROM all_tab_columns 
       WHERE table_name = 'TRIFM_IZINLER_CFV' AND owner = 'IFSAPP'`
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

checkColumnsDetailed();
