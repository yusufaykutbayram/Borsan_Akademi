const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const xlsx = require('xlsx');

/**
 * Excel'den Yıllık İzin İçe Aktarma
 * Oracle'dan veriyi Excel olarak dışa aktarıp bu betikle yükleyebilirsiniz.
 */

async function importFromExcel() {
  const filePath = './YILLIK_IZIN_LISTESI.xlsx'; // Dosya adını buraya yazın
  
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`${data.length} kayıt okunuyor...`);

    for (const row of data) {
      const sicil = row['SICIL_NO']?.toString();
      const izin = parseFloat(row['KALAN_IZIN']);

      if (!sicil || isNaN(izin)) continue;

      const user = await prisma.user.findUnique({
        where: { sicil_no: sicil }
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { annual_leave_days: izin }
        });
        console.log(`Güncellendi: ${user.name} (${sicil}) -> ${izin} gün`);
      }
    }
    console.log("İşlem tamamlandı.");
  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

importFromExcel();
