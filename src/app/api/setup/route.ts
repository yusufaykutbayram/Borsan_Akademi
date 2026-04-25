import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hashedPassword = await hash("123456", 10);
    
    await prisma.user.upsert({
      where: { tc_number: "111111" },
      update: {
        name: "Admin",
        password_hash: hashedPassword,
        role: "ADMIN"
      },
      create: {
        name: "Admin",
        tc_number: "111111",
        password_hash: hashedPassword,
        role: "ADMIN",
        xp_points: 0,
        force_pw_change: false
      }
    });

    return NextResponse.json({ message: "Admin hesabı güncellendi/oluşturuldu! Kullanıcı adı: Admin, Şifre: 123456" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Kurulum hatasi." }, { status: 500 });
  }
}
