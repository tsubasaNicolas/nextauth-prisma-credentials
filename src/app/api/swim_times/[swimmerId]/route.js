import prisma from "@/libs/db";
import { NextResponse } from "next/server";

const getSwimTimes = async (swimmerId) => {
  const swimTimes = await prisma.swim_times.findMany({
    where: { swimmer_id: parseInt(swimmerId, 10) },
    orderBy: { date_of_register: "desc" }, // Ordenar por fecha de registro descendente
  });
  return swimTimes;
};

export async function GET(request, { params }) {
  const swimmerId = params.swimmerId;

  try {
    const swimTimes = await getSwimTimes(swimmerId);

    if (!swimTimes || swimTimes.length === 0) {
      return NextResponse.json(
        {
          message: `No se encontraron tiempos de natación para el nadador con id ${swimmerId}`,
        },
        { status: 404 }
      );
    }

    const formattedTimes = swimTimes.map((time) => ({
      value: time.time_in_seconds,
      time: new Date(time.date_of_register).getTime() / 1000,
    }));

    return NextResponse.json(formattedTimes);
  } catch (error) {
    console.error("Error al obtener los tiempos de natación:", error);
    return NextResponse.json(
      { message: "Error al obtener los tiempos de natación", error },
      { status: 500 }
    );
  }
}

/* export async function POST(req, res) {
  const { id } = req.query;

  try {
    const swimmerId = parseInt(id, 10);
    const { time_in_seconds, competition_id, swim_category_id, date_of_register } = req.body;

    await postSwimTimeSchema.validate({
      time_in_seconds,
      competition_id,
      swim_category_id,
      date_of_register,
    });

    const newSwimTime = await prisma.swim_times.create({
      data: {
        swimmer_id: swimmerId,
        competition_id: parseInt(competition_id, 10),
        swim_category_id: parseInt(swim_category_id, 10),
        time_in_seconds: parseFloat(time_in_seconds),
        date_of_register: new Date(date_of_register),
      },
    });

    return NextResponse.json(newSwimTime);
  } catch (error) {
    console.error('Error al crear el tiempo de natación:', error);
    return NextResponse.json(
      { message: 'Error al crear el tiempo de natación', error },
      { status: 400 }
    );
  }
} */

/* import prisma from "@/libs/db";
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
 */
