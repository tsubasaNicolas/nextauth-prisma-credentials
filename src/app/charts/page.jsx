"use client";
import { useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";
import useUserStore from "@/userStore";
import { getSession } from "next-auth/react";

const ChartsPage = () => {
  const userId = useUserStore((state) => state.userId);
  const [swimmerId, setSwimmerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (!session) {
          throw new Error("No hay sesión de usuario");
        }

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
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (!swimmerId) return;

    const chartOptions = {
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
    };

    const chart = createChart(
      document.getElementById("histogramContainer"),
      chartOptions
    );

    const histogramSeries = chart.addHistogramSeries({ color: "#26a69a" });

    // Datos de ejemplo para el histograma
    const data = [
      { value: 1, time: 1642425322000 },
      { value: 8, time: 1642511722000 },
      { value: 10, time: 1642598122000 },
      { value: 20, time: 1642684522000 },
      { value: 3, time: 1642770922000, color: "red" },
      { value: 43, time: 1642857322000 },
      { value: 41, time: 1642943722000, color: "red" },
      { value: 43, time: 1643030122000 },
      { value: 56, time: 1643116522000 },
      { value: 46, time: 1643202922000, color: "red" },
    ];

    histogramSeries.setData(data);

    chart.timeScale().fitContent();
  }, [swimmerId]);

  // Mostrar mensaje de carga mientras se obtiene el swimmerId
  if (loading) {
    return <p>Cargando...</p>;
  }

  // Mostrar mensaje si no se encontró swimmerId para el userId actual
  if (!swimmerId) {
    return <p>No se encontró nadador para el usuario actual</p>;
  }

  return (
    <div>
      <h1>Charts</h1>
      <div
        id="histogramContainer"
        className="container"
        style={{ height: "400px" }}
      ></div>
      <LineChart swimmerId={swimmerId} />
      <AreaChart />
    </div>
  );
};

export default ChartsPage;
