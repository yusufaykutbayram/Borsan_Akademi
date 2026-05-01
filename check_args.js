const oracledb = require('oracledb');

async function checkArgs() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    const result = await connection.execute(
      `SELECT argument_name, data_type, in_out 
       FROM all_arguments 
       WHERE object_name = 'GET_HAKEDILEN' AND package_name = 'TRIFM_IZINLER_API'
       ORDER BY sequence`
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

checkArgs();
