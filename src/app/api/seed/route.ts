import prisma from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Eliminar todos los datos existentes para evitar conflictos
    await prisma.swim_times.deleteMany();
    await prisma.competitions.deleteMany();
    await prisma.participant_competition.deleteMany();
    await prisma.swimmers.deleteMany();
    await prisma.swimming_events.deleteMany();
    await prisma.distances.deleteMany();
    await prisma.swim_categories.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuarios
    const user1 = await prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
        isAdmin: true,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: "user2@example.com",
        username: "user2",
        password: "password2",
      },
    });

    // Crear nadadores
    const swimmer1 = await prisma.swimmers.create({
      data: {
        userId: user1.id,
        name: "Nadador 1",
        date_of_birth: new Date(1990, 0, 1),
        gender: "Masculino",
        image_url:
          "https://res.cloudinary.com/cursos-udemy-nico/image/upload/v1716008979/i36w8sknudh8fuuiwa30.jpg",
      },
    });

    const swimmer2 = await prisma.swimmers.create({
      data: {
        userId: user2.id,
        name: "Nadador 2",
        date_of_birth: new Date(1995, 5, 15),
        gender: "Femenino",
        image_url:
          "https://res.cloudinary.com/cursos-udemy-nico/image/upload/v1711136151/oqulfyhlguxszbhxdnok.png",
      },
    });

    // Crear eventos de natación
    const event1 = await prisma.swimming_events.create({
      data: {
        name: "Swimming Event 1",
        location: "Location 1",
        start_date: new Date(),
        end_date: new Date(),
        image_url:
          "https://res.cloudinary.com/cursos-udemy-nico/image/upload/v1717626446/tah0iblavbjuraokxrdt.png",
      },
    });

    const event2 = await prisma.swimming_events.create({
      data: {
        name: "Swimming Event 2",
        location: "Location 2",
        start_date: new Date(),
        end_date: new Date(),
        image_url:
          "https://res.cloudinary.com/cursos-udemy-nico/image/upload/v1717626557/ab7tjswigkku8en9qpmx.png",
      },
    });

    // Crear distancias
    const distance1 = await prisma.distances.create({
      data: {
        distance_meters: 100,
        name: "100 meters",
        description: "Description of 100 meters distance",
        image_url:
          "https://res.cloudinary.com/cursos-udemy-nico/image/upload/v1673875528/e0gpbzkvxgix5trleibf.jpg",
      },
    });

    const distance2 = await prisma.distances.create({
      data: {
        distance_meters: 200,
        name: "200 meters",
        description: "Description of 200 meters distance",
        image_url:
          "https://res.cloudinary.com/cursos-udemy-nico/image/upload/v1673834530/cld-sample.jpg",
      },
    });

    // Crear categorías de natación
    const category1 = await prisma.swim_categories.create({
      data: {
        name: "Principiante",
        description: "Categoría para nadadores principiantes",
        image_url:
          "https://res.cloudinary.com/cursos-udemy-nico/image/upload/v1673834532/cld-sample-5.jpg",
      },
    });

    const category2 = await prisma.swim_categories.create({
      data: {
        name: "Avanzado",
        description: "Categoría para nadadores avanzados",
        image_url:
          "https://res.cloudinary.com/cursos-udemy-nico/image/upload/v1673834532/cld-sample-4.jpg",
      },
    });

    // Crear competiciones
    const competition1 = await prisma.competitions.create({
      data: {
        event_id: event1.id,
        name: "Mariposa",
        distance_id: distance1.id,
        category_id: category1.id,
        start_time: new Date(),
        end_time: new Date(),
      },
    });

    const competition2 = await prisma.competitions.create({
      data: {
        event_id: event2.id,
        name: "Libre",
        distance_id: distance2.id,
        category_id: category2.id,
        start_time: new Date(),
        end_time: new Date(),
      },
    });

    // Crear tiempos de natación
    /*     await prisma.swim_times.createMany({
      data: [
        {
          swimmer_id: swimmer1.id,
          competition_id: competition1.id,
          swim_category_id: category1.id,
          time_in_seconds: 65.25,
        },
        {
          swimmer_id: swimmer2.id,
          competition_id: competition2.id,
          swim_category_id: category2.id,
          time_in_seconds: 120.5,
        },
      ],
    }); */

    return NextResponse.json({ message: "Seed Executed !!" });
  } catch (error) {
    console.error("Error during seed execution:", error);
    return NextResponse.json(
      { message: "Error during seed execution", error },
      { status: 500 }
    );
  }
}
