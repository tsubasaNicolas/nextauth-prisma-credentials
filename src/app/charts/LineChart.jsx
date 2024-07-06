"use client";
import { useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import dayjs from "dayjs";

const LineChart = ({ swimmerId }) => {
  const [swimTimes, setSwimTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSwimTimes = async () => {
      try {
        const response = await fetch(`/api/swim_times/${swimmerId}`);
        if (!response.ok) {
          throw new Error("No se pudo obtener los tiempos de natación");
        }
        const data = await response.json();

        // Verificar que los datos recibidos son válidos
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Datos de tiempo inválidos");
        }

        // Ordenar los datos por tiempo ascendente
        data.sort((a, b) => a.time - b.time);

        const formattedTimes = data.map((time) => ({
          value: time.value, // Asegúrate de que value esté definido y sea válido
          time: time.time * 1000, // Convertir segundos a milisegundos
        }));

        setSwimTimes(formattedTimes);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los tiempos de natación:", error);
        setLoading(false); // Asegúrate de cambiar el estado de carga en caso de error
      }
    };

    if (swimmerId) {
      fetchSwimTimes();
    } else {
      setLoading(false); // Asegúrate de cambiar el estado de carga si no hay swimmerId
    }
  }, [swimmerId]);

  useEffect(() => {
    if (swimTimes.length === 0) return;

    // Verificar antes de establecer los datos
    if (swimTimes.some((data) => isNaN(data.time) || isNaN(data.value))) {
      console.error("Datos de tiempo inválidos:", swimTimes);
      return;
    }

    const chartOptions = {
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
    };

    const chart = createChart(
      document.getElementById(`lineChartContainer_${swimmerId}`),
      chartOptions
    );

    const lineSeries = chart.addLineSeries({ color: "#2962FF" });
    lineSeries.setData(swimTimes);

    // Configurar el eje de tiempo
    const timeScale = chart.timeScale();
    timeScale.fitContent();

    // Opcional: configurar el formato de fecha en el eje X
    timeScale.applyOptions({
      timeVisible: true,
      secondsVisible: false,
      tickMarkFormatter: (time) => {
        // Usar day.js para formatear las fechas si es necesario
        return dayjs(time).format("DD/MM/YYYY");
      },
    });
  }, [swimTimes, swimmerId]);

  if (loading) {
    return <p>Cargando tiempos de natación...</p>;
  }

  if (!swimmerId) {
    return <p>No se encontró nadador para el usuario actual</p>;
  }
  return (
    <div
      id={`lineChartContainer_${swimmerId}`}
      style={{ height: "400px" }}
    ></div>
  );
};

export default LineChart;
