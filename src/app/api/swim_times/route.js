//import cloudinary from "@/lib/cloudinary";

import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";
import { unlink } from "fs/promises";
import prisma from "@/libs/db";

// Manejador para la petición GET
export async function GET(request) {
  try {
    // Consulta todas las categorías desde la base de datos
    const swim_times = await prisma.swim_times.findMany();

    // Devuelve las categorías como respuesta en formato JSON
    return NextResponse.json(swim_times);
  } catch (error) {
    // Si hay algún error, devuelve una respuesta de error con el mensaje
    console.log(error);
  }
}

const timesSchema = yup.object({
  swimmer_id: yup.number().required(),
  competition_id: yup.number().required(),
  swim_category_id: yup.number().required(), // Agrega la validación para swim_category_id
  time_in_seconds: yup.number().required(), // Agrega la validación para time_in_seconds
  date_of_register: yup.date().required(),
});

export async function POST(request) {
  try {
    const data = await request.formData();

    // Obtener y convertir swimmer_id, competition_id, swim_category_id y time_in_seconds a números
    const swimmer_id = parseInt(data.get("swimmer_id"), 10); // Convertir a número base 10
    const competition_id = parseInt(data.get("competition_id"), 10); // Convertir a número base 10
    const swim_category_id = parseInt(data.get("swim_category_id"), 10); // Convertir a número base 10
    const time_in_seconds = parseFloat(data.get("time_in_seconds")); // Convertir a número de punto flotante
    const date_of_register = new Date(data.get("date_of_register")); // Convertir la fecha de registro a objeto Date

    // Validar con Yup
    const {
      swimmer_id: validatedSwimmerId,
      competition_id: validatedCompetitionId,
      swim_category_id: validatedSwimCategoryId,
      time_in_seconds: validatedTimeInSeconds,
      date_of_register: validatedDateOfRegister,
    } = await timesSchema.validate({
      swimmer_id,
      competition_id,
      swim_category_id,
      time_in_seconds,
      date_of_register,
    });

    // Crear el registro en Prisma incluyendo la fecha y hora actual
    const newTime = await prisma.swim_times.create({
      data: {
        swimmer_id: validatedSwimmerId,
        competition_id: validatedCompetitionId,
        swim_category_id: validatedSwimCategoryId,
        time_in_seconds: validatedTimeInSeconds,
        date_of_register: validatedDateOfRegister, // Campo date_of_register en la tabla swim_times
      },
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
