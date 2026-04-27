const ExcelJS = require('exceljs');
const path = require('path');

async function checkExcel() {
    const workbook = new ExcelJS.Workbook();
    try {
        await workbook.xlsx.readFile(path.join(__dirname, 'kilif hatti sinav sorulari.xlsx'));
        const worksheet = workbook.worksheets[0];
        
        console.log('--- DETAYLI EXCEL INCELEMESI ---');

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            // Soru 8 ve 14 civarındaki satırlara odaklanalım (Genelde 20-50 arasıdır)
            if (rowNumber < 20 || rowNumber > 50) return; 

            let output = `Satır ${rowNumber}: `;
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                let val = "";
                try {
                    if (cell.isMerged && cell.master.address !== cell.address) {
                        val = "(M)";
                    } else {
                        val = cell.value ? cell.value.toString() : "";
                    }
                } catch (e) { val = "[E]"; }

                let color = "No";
                if (cell.fill && cell.fill.fgColor && cell.fill.fgColor.argb) {
                    color = cell.fill.fgColor.argb;
                }

                if (val || color !== "No") {
                    output += `| C${colNumber}: ${val.substring(0, 30)} (${color}) `;
                }
            });
            if (output.length > 10) console.log(output);
        });

    } catch (error) {
        console.error('Dosya okuma hatası:', error);
    }
}

checkExcel();
