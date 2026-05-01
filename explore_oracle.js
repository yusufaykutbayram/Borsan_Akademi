const oracledb = require('oracledb');

async function testConnection() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("Bağlantı başarılı!");

    // İzin ile ilgili tabloları/viewları ara
    const result = await connection.execute(
      `SELECT owner, view_name 
       FROM all_views 
       WHERE view_name LIKE '%IZIN%' OR view_name LIKE '%LEAVE%' OR view_name LIKE '%VACATION%'
       FETCH FIRST 20 ROWS ONLY`
    );

    console.log("İlgili View'lar bulundu:");
    console.table(result.rows);

  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

testConnection();
