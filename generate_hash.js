const bcrypt = require('bcryptjs');

async function main() {
  const password = 'Borsan2026';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('=== KOPYALA VE SUPABASE\'E YAPISTIR ===');
  console.log('');
  console.log('Şifre:', password);
  console.log('Hash (password_hash sütununa yapıştır):');
  console.log(hash);
  console.log('');
  console.log('=======================================');
}

main().catch(console.error);
