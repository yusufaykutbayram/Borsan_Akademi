const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'ZAYIF AKIM PERSONEL LİSTESİ.xlsx');

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('Sheet Name:', sheetName);
    console.log('Total Rows:', data.length);
    console.log('Columns:', Object.keys(data[0] || {}));
    console.log('\nSample Row:', JSON.stringify(data[0], null, 2));
} catch (error) {
    console.error('Error reading excel:', error.message);
}
