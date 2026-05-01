const oracledb = require('oracledb');

async function checkIzinler3() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("TRIFM_IZINLER3 inceleniyor...");
    const result = await connection.execute(
      `SELECT column_name, data_type FROM all_tab_columns WHERE table_name = 'TRIFM_IZINLER3' AND owner = 'IFSAPP'`
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

checkIzinler3();
