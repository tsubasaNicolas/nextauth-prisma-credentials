// Importa prisma y las herramientas necesarias

import prisma from "@/libs/db";
import { NextResponse, NextRequest } from "next/server";

// Manejador para la petición GET
export async function GET(request) {
  try {
    // Consulta todas las categorías desde la base de datos
    const categories = await prisma.swim_categories.findMany();

    // Devuelve las categorías como respuesta en formato JSON
    return NextResponse.json(categories);
  } catch (error) {
    // Si hay algún error, devuelve una respuesta de error con el mensaje
    console.log(error);
  }
}
