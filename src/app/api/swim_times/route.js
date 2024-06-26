import prisma from "@/libs/db";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";
import useUserStore from "@/userStore"; // Importa tu Zustand store aquí
import { getSession } from "next-auth/react";

export async function GET(request) {
  try {
    // Obtener la sesión del usuario autenticado
    const session = await getSession({ req: request });

    // Verificar si hay una sesión válida
    if (!session) {
      return NextResponse.json(
        { message: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Obtener el userId del usuario autenticado desde Zustand
    const userId = useUserStore.getState().userId;

    // Si userId no está definido en el estado, se podría intentar establecerlo
    if (!userId) {
      // Si userId no está en el estado, intenta obtenerlo del session.user.id
      useUserStore.setState({ userId: session.user.id });
    }

    // Obtener el id del nadador correspondiente al usuario autenticado
    const swimmer = await prisma.swimmers.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!swimmer) {
      return NextResponse.json(
        { message: "No se encontró el nadador correspondiente al usuario" },
        { status: 404 }
      );
    }

    // Obtener los tiempos de nado del nadador encontrado
    const swim_times = await prisma.swim_times.findMany({
      where: {
        swimmer_id: swimmer.id, // Filtrar por el id del nadador encontrado
      },
    });

    // Devuelve los tiempos de nado del nadador como respuesta en formato JSON
    return NextResponse.json(swim_times);
  } catch (error) {
    // Si hay algún error, devuelve una respuesta de error con el mensaje
    console.error("Error al obtener los tiempos de nado:", error);
    return NextResponse.json(
      { message: "Error al obtener los tiempos de nado", error },
      { status: 500 }
    );
  }
}
const timesSchema = yup.object({
  swimmer_id: yup.number().required(),
  competition_id: yup.number().required(),
  swim_category_id: yup.number().required(),
  time_in_seconds: yup.number().required(),
});

export async function POST(request) {
  try {
    const data = await request.formData();

    // Obtener y convertir swimmer_id, competition_id, swim_category_id y time_in_seconds a números
    const swimmer_id = parseInt(data.get("swimmer_id"), 10); // Convertir a número base 10
    const competition_id = parseInt(data.get("competition_id"), 10); // Convertir a número base 10
    const swim_category_id = parseInt(data.get("swim_category_id"), 10); // Convertir a número base 10
    const time_in_seconds = parseFloat(data.get("time_in_seconds")); // Convertir a número de punto flotante

    // Validar con Yup
    const validatedData = await timesSchema.validate({
      swimmer_id,
      competition_id,
      swim_category_id,
      time_in_seconds,
    });

    // Obtener el usuario logueado (esto depende de cómo manejes la autenticación)
    const session = await getSession({ req: request });
    if (!session) {
      return NextResponse.json(
        { message: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Verificar si el usuario es el dueño del swimmer_id
    const swimmer = await prisma.swimmers.findUnique({
      where: { id: validatedData.swimmer_id },
    });

    if (!swimmer || swimmer.userId !== userId) {
      return NextResponse.json(
        { message: "No autorizado para registrar tiempo para este nadador" },
        { status: 403 }
      );
    }

    // Crear el registro en Prisma
    const newTime = await prisma.swim_times.create({
      data: validatedData,
    });

    return NextResponse.json(newTime);
  } catch (error) {
    console.error("Error al crear el swim_times:", error);
    return NextResponse.json(
      { message: "Error al crear el swim_times", error },
      { status: 500 }
    );
  }
}
