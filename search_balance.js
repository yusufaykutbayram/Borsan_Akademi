const oracledb = require('oracledb');

async function findBalanceTable() {
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
       WHERE view_name LIKE '%HAK%' OR view_name LIKE '%BAKIYE%' OR view_name LIKE '%PLAN%'
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

findBalanceTable();
