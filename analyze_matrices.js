const XLSX = require('xlsx');

function readExcel(filename) {
    console.log(`\n--- Reading ${filename} ---`);
    const workbook = XLSX.readFile(filename);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Print first 5 rows to see structure
    data.slice(0, 5).forEach((row, i) => {
        console.log(`Row ${i}:`, row);
    });
    return data;
}

readExcel('ÇALIŞAN YETKİNLİK MATRİSİ.xlsx');
readExcel('EĞİTİM EŞLEŞTİRME LİSTESİ.xlsx');
