const oracledb = require('oracledb');

async function testIzinler4All() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log("TRIFM_IZINLER4'ten 100 satır çekiliyor...");
    const result = await connection.execute(
      `SELECT EMP_NO, TOPLAM_HAKETTIGI_IZIN, TOPLAM_KULLANDIGI_IZIN, KALAN_IZIN 
       FROM IFSAPP.TRIFM_IZINLER4 
       WHERE TOPLAM_HAKETTIGI_IZIN > 0 
       FETCH FIRST 10 ROWS ONLY`,
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

testIzinler4All();
