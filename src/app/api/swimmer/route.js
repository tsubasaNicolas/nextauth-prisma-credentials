import prisma from "@/libs/db";
import { NextResponse } from "next/server";
import * as yup from "yup";

const swimmerSchema = yup.object({
  userId: yup.number().required(),
  date_of_birth: yup.date().required(),
  gender: yup.string().required(),
});

export async function POST(request) {
  try {
    const { userId, date_of_birth, gender } = await swimmerSchema.validate(
      await request.json()
    );

    const existingSwimmer = await prisma.swimmers.findUnique({
      where: { userId },
    });

    if (existingSwimmer) {
      return NextResponse.json(
        { message: "Ya existe un nadador con este userId" },
        { status: 400 }
      );
    }

    const swimmer = await prisma.swimmers.create({
      data: { userId, date_of_birth: new Date(date_of_birth), gender },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { requestCompetitor: true },
    });

    console.log("Swimmer created:", swimmer); // Log para verificar la creación del nadador

    return NextResponse.json({ swimmer, user });
  } catch (error) {
    console.error("Error al manejar la solicitud POST:", error);
    return NextResponse.json(
      { message: "Error al crear el nadador", error: error.message },
      { status: 400 }
    );
  }
}

/* import prisma from "@/libs/db";
import { NextResponse } from "next/server";
import * as yup from "yup";

const swimmerSchema = yup.object({
  userId: yup.number().required(),
  date_of_birth: yup.date().required(),
  gender: yup.string().required(),
});

export async function POST(request) {
  try {
    // Validar los datos de entrada con yup
    const { userId, date_of_birth, gender } = await swimmerSchema.validate(
      await request.json()
    );

    // Crear el nadador usando Prisma
    const swimmer = await prisma.swimmers.create({
      data: {
        userId,
        date_of_birth: new Date(date_of_birth),
        gender,
      },
    });

    // Actualizar el campo requestCompetitor en el modelo User
    const user = await prisma.user.update({
      where: { id: userId },
      data: { requestCompetitor: true },
    });

    return NextResponse.json({ swimmer, user });
  } catch (error) {
    console.error("Error al manejar la solicitud POST:", error);
    return NextResponse.json(
      { message: "Error al crear el nadador", error: error.message },
      { status: 400 }
    );
  }
}
 */
