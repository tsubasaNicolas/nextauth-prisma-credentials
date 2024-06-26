// src/app/api/users/[email]/route.js
import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const email = decodeURIComponent(params.email);

  if (!email) {
    return NextResponse.json({ error: "Email not provided" }, { status: 400 });
  }

  try {
    // Buscar al usuario por su email en la base de datos usando Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        username: true, // Ajustar aquí según el campo correcto en tu base de datos
        isCompetitor: true,
        requestCompetitor: true,
      },
    });

    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error al buscar usuario por email:", error);
    return NextResponse.json(
      { error: "Error al buscar usuario por email" },
      { status: 500 }
    );
  }
}
