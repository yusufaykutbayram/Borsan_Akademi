const oracledb = require('oracledb');

async function checkHatice() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "YUSUFBAYRAM",
      password: "123",
      connectString: "10.55.70.11:1521/PROD"
    });

    console.log(`Personel 7661 (Hatice) için kayıtlar inceleniyor...`);

    const result = await connection.execute(
      `SELECT IZIN_KODU, SURE_GUN, CIKIS_TARIHI, STATE 
       FROM IFSAPP.TRIFM_IZINLER 
       WHERE EMP_NO = '7661'`,
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

checkHatice();
