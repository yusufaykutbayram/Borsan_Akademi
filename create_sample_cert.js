const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find Birkan Yarar
    const users = await prisma.user.findMany({
        where: {
            name: {
                contains: 'Birkan',
                mode: 'insensitive'
            }
        }
    });
    
    console.log("Found Users:", users.map(u => ({ id: u.id, name: u.name })));

    // Find any training
    const training = await prisma.training.findFirst();
    if (!training) {
        console.log("No training found.");
        return;
    }
    console.log("Using training:", training.title, training.id);

    if (users.length > 0) {
        const user = users[0];
        
        // Generate a sample certificate
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        const certNumber = `BRSN-${new Date().getFullYear()}-${randomPart}`;

        const cert = await prisma.certificate.create({
            data: {
                user_id: user.id,
                training_id: training.id,
                cert_number: certNumber,
                url: `/dashboard/certificates/${certNumber}`
            }
        });
        
        console.log("Certificate created:", cert);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
