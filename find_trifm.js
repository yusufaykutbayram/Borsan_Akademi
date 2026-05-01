const oracledb = require('oracledb');

async function findTrifm() {
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
       WHERE view_name LIKE 'TRIFM%'
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

findTrifm();
