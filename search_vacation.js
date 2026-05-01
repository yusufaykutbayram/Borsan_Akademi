const oracledb = require('oracledb');

async function findTableSpecific() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    const result = await connection.execute(
      `SELECT owner, view_name 
       FROM all_views 
       WHERE view_name LIKE '%VACATION%' OR view_name LIKE '%HOLIDAY%' OR view_name LIKE '%ABSENCE%'
       FETCH FIRST 30 ROWS ONLY`
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

findTableSpecific();
