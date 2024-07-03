import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const take = Number(searchParams.get("take") ?? "10");
  const skip = Number(searchParams.get("skip") ?? "0");

  if (isNaN(take) || isNaN(skip)) {
    return NextResponse.json(
      { message: "Take y Skip tienen que ser números" },
      { status: 400 }
    );
  }

  const competitions = await prisma.competitions.findMany({
    take,
    skip,
    include: {
      swimming_events: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(competitions);
}
