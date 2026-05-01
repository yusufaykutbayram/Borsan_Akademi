const oracledb = require('oracledb');

async function testIzinler3() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("TRIFM_IZINLER3 test ediliyor...");
    const result = await connection.execute(
      `SELECT EMP_NO, HAK_TAR, YIL 
       FROM IFSAPP.TRIFM_IZINLER3 
       WHERE COMPANY_ID = 'BORSAN' 
       AND EMP_NO = '3580'
       ORDER BY HAK_TAR DESC
       FETCH FIRST 1 ROWS ONLY`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
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

testIzinler3();
