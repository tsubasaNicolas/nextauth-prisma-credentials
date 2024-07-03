import prisma from "@/libs/db";
import { swimmers } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";

interface Segments {
  params: {
    id: string;
  };
}

const getSwimmer = async (id: string): Promise<swimmers | null> => {
  const idNumber = parseInt(id, 10); // Convertir id a un número
  const swimmer = await prisma.swimmers.findFirst({ where: { id: idNumber } });

  return swimmer;
};

export async function GET(request: NextRequest, { params }: Segments) {
  const swimmer = await getSwimmer(params.id);

  if (!swimmer) {
    return NextResponse.json(
      { message: `Nadador con id ${params.id} no existe` },
      { status: 404 }
    );
  }
  return NextResponse.json(swimmer);
}

const putSwimmerSchema = yup.object({
  competitor: yup.boolean().optional(),
  name: yup.string().nullable(),
});

export async function PUT(request: NextRequest, { params }: Segments) {
  const idNumber = parseInt(params.id, 10); // Convertir id a un número

  const swimmer = await getSwimmer(params.id);

  if (!swimmer) {
    return NextResponse.json(
      { message: `Nadador con id ${params.id} no existe` },
      { status: 404 }
    );
  }

  try {
    const { competitor, name, ...rest } = await putSwimmerSchema.validate(
      await request.json()
    );

    const updatedSwimmer = await prisma.swimmers.update({
      where: { id: idNumber },
      data: { competitor, name },
    });

    // Update the corresponding user
    const updatedUser = await prisma.user.update({
      where: { id: updatedSwimmer.userId },
      data: { isCompetitor: competitor },
    });

    return NextResponse.json({ updatedSwimmer, updatedUser });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

/* export async function PUT(request: NextRequest, { params }: Segments) {
  const idNumber = parseInt(params.id, 10); // Convertir id a un número

  const swimmer = await getSwimmer(params.id);

  if (!swimmer) {
    return NextResponse.json(
      { message: `Nadador con id ${params.id} no existe` },
      { status: 404 }
    );
  }

  try {
    const { competitor, name, ...rest } = await putSwimmerSchema.validate(
      await request.json()
    );

    const updatedSwimmer = await prisma.swimmers.update({
      where: { id: idNumber },
      data: { competitor, name },
    });
    return NextResponse.json(updatedSwimmer);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
} */
