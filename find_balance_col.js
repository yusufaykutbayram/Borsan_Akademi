const oracledb = require('oracledb');

async function findCalculatedBalance() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("Kalan bakiye sütunu olan viewlar aranıyor...");

    const result = await connection.execute(
      `SELECT table_name, column_name 
       FROM all_tab_columns 
       WHERE (column_name LIKE '%BAKIYE%' OR column_name LIKE '%REMAINING%' OR column_name LIKE '%KALAN%')
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

findCalculatedBalance();
