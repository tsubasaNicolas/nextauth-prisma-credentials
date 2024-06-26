import prisma from "@/libs/db";
import { NextResponse } from "next/server";

// Función para obtener todos los usuarios
const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      // Puedes seleccionar solo las propiedades que necesites aquí
      select: {
        id: true,
        email: true,
        // Otras propiedades que necesites
      },
    });

    return users;
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw error; // Manejo de errores según tu caso
  }
};

// Función de manejo para la solicitud GET
export async function GET(req, res) {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener todos los usuarios" },
      { status: 500 }
    );
  }
}
