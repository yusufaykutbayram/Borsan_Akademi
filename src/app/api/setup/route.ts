import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { tc_number: "111111" }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Sistem zaten kurulu!" });
    }

    const hashedPassword = await hash("123456", 10);
    
    await prisma.user.create({
      data: {
        name: "Admin",
        tc_number: "111111",
        password_hash: hashedPassword,
        role: "ADMIN",
        xp_points: 0,
        force_pw_change: false
      }
    });

    return NextResponse.json({ message: "Admin hesabı basariyla olusturuldu! Giris yapabilirsiniz." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Kurulum hatasi." }, { status: 500 });
  }
}
