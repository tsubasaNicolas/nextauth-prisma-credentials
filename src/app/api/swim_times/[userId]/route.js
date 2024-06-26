import prisma from "@/libs/db";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

const getSwimTimeByUserId = async (userId) => {
  try {
    const swimTimes = await prisma.swim_times.findMany({
      where: { swimmer_id: parseInt(userId, 10) },
    });
    return swimTimes;
  } catch (error) {
    throw new Error(`Error al obtener los tiempos de nado: ${error.message}`);
  }
};

export async function GET(request, { params }) {
  try {
    const swimTimes = await getSwimTimeByUserId(params.userId);

    if (!swimTimes || swimTimes.length === 0) {
      return NextResponse.json(
        {
          message: `No se encontraron tiempos de nado para el usuario con id ${params.userId}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(swimTimes);
  } catch (error) {
    console.error("Error en la API al obtener los tiempos de nado:", error);
    return NextResponse.json(
      { message: "Error al obtener los tiempos de nado", error: error.message },
      { status: 500 }
    );
  }
}
