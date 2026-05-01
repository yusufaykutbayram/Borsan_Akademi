const oracledb = require('oracledb');

async function findVacationTable() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    const result = await connection.execute(
      `SELECT table_name, column_name 
       FROM all_tab_columns 
       WHERE table_name LIKE '%VACATION%' OR table_name LIKE '%HOLIDAY%'
       AND owner = 'IFSAPP'
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

findVacationTable();
