"use client";
import { useEffect, useState } from "react";
import useUserStore from "@/userStore";
import { useRouter } from "next/navigation";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";
import { getSession } from "next-auth/react";

function ChartsPage() {
  const [userLoaded, setUserLoaded] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSwimmers, setLoadingSwimmers] = useState(false);
  const user = useUserStore((state) => state.user);
  const userId = useUserStore((state) => state.userId);
  const { setUser } = useUserStore();
  const router = useRouter();
  const [swimmerId, setSwimmerId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch(
          `/api/users/${encodeURIComponent(session.user.email)}`
        );
        const data = await response.json();
        console.log("API user data:", data);
        if (response.ok) {
          setUser(data);
        }
        setLoadingUser(false);
        setUserLoaded(true);
      } else {
        setLoadingUser(false);
        setUserLoaded(true);
      }
    };

    loadUser();
  }, [setUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      setLoadingSwimmers(true);

      try {
        const response = await fetch(`/api/swimmers?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del nadador");
        }
        const data = await response.json();

        if (data.length > 0) {
          const foundSwimmer = data.find(
            (swimmer) => swimmer.userId === userId
          );
          if (foundSwimmer) {
            setSwimmerId(foundSwimmer.id);
          } else {
            throw new Error(
              "No se encontró nadador para el userId proporcionado"
            );
          }
        } else {
          throw new Error(
            "No se encontró ningún nadador para el userId proporcionado"
          );
        }
      } catch (error) {
        console.error("Error al obtener el swimmerId:", error);
        // Manejo de errores, podrías mostrar un mensaje de error al usuario aquí
      } finally {
        setLoadingSwimmers(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!userLoaded) return;
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, userLoaded, router]);

  if (loadingUser) {
    return <p>Cargando usuario...</p>;
  }

  if (!userLoaded || loadingSwimmers) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <p>No hay usuario logueado</p>;
  }

  if (!swimmerId) {
    return <p>No se encontró nadador para el usuario actual</p>;
  }

  return (
    <section className="w-full">
      <LineChart swimmerId={swimmerId} />
      <AreaChart />
    </section>
  );
}

export default ChartsPage;
