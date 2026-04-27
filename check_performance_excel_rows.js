const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'PERFORMANS DEĞERLENDİRME MAYIS-TEMMUZ DÖNEMİ.xlsx');

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('Sheet Name:', sheetName);
    console.log('Total Rows:', data.length);
    
    // Log first 5 rows to see structure
    for (let i = 0; i < 5; i++) {
        console.log(`Row ${i}:`, JSON.stringify(data[i], null, 2));
    }
} catch (error) {
    console.error('Error reading excel:', error.message);
}
