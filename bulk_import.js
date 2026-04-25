const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bucketUrl = "https://sarexqiaokpesnzdybdx.supabase.co/storage/v1/object/public/egitimler/";

const files = [
  { name: "4+1.mp4", type: "VIDEO" },
  { name: "5S SUNUMU.pptx", type: "PTX" },
  { name: "AKTARMA MAKINE BASINDA CALISMA KURALLARI.pptx", type: "PTX" },
  { name: "BUNCHER MAKARA INDIRME.mp4", type: "VIDEO" },
  { name: "BUNCHER MAKARA YUKLEME.mp4", type: "VIDEO" },
  { name: "DAMAR BUKUM MAKINE BASINDA CALISMA KURALLARI.pptx", type: "PTX" },
  { name: "EKSTRUDER IZOLE MAKINE BASINDA CALISMA KURALLARI.pptx", type: "PTX" },
  { name: "EKSTRUDER KILIF MAKINE BASINDA CALISMA KURALLARI.pptx", type: "PTX" },
  { name: "FALCATA KULLANIMI.mp4", type: "VIDEO" },
  { name: "FORKLIFT.mp4", type: "VIDEO" },
  { name: "IZOLASYON.mp4", type: "VIDEO" },
  { name: "KALIN TEL KAYNAK.mp4", type: "VIDEO" },
  { name: "KILIF TEMIZLIK.mp4", type: "VIDEO" },
  { name: "KKD.mp4", type: "VIDEO" },
  { name: "TEL BUKUM MAKINE BASINDA CALISMA KURALLARI.pptx", type: "PTX" },
  { name: "TEL INCELTME MAKINE BASINDA CALISMA KURALLARI.pptx", type: "PTX" },
  { name: "TEL INCELTME SON ISLEM.mp4", type: "VIDEO" },
  { name: "TEL INCELTME SURECI.mp4", type: "VIDEO" },
  { name: "TEL INCELTME.mp4", type: "VIDEO" },
  { name: "Uretim Surecleri Egitimi (Genel Bilgilendirme).pptx", type: "PTX" }
];

async function main() {
  console.log("Eğitimler ekleniyor...");
  
  const users = await prisma.user.findMany({ where: { role: 'EMPLOYEE' } });
  
  for (const file of files) {
    // Önce bu URL zaten var mı kontrol et (tekrar yüklememek için)
    const url = bucketUrl + encodeURIComponent(file.name);
    const exists = await prisma.training.findFirst({ where: { file_url: url } });
    
    if (exists) {
      console.log(`Atlanıyor (Zaten var): ${file.name}`);
      continue;
    }

    const title = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    
    const newTraining = await prisma.training.create({
      data: {
        title: title,
        description: `${title} hakkında eğitim materyali.`,
        type: file.type,
        file_url: url
      }
    });

    // Her yeni eğitimi tüm çalışanlara ata
    if (users.length > 0) {
      await prisma.trainingProgress.createMany({
        data: users.map(u => ({
          user_id: u.id,
          training_id: newTraining.id,
          status: 'IN_PROGRESS',
          progress_percentage: 0
        }))
      });
    }
    
    console.log(`Eklendi: ${file.name}`);
  }

  console.log("Tüm işlemler tamamlandı.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
