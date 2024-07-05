"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { getSession } from "next-auth/react";
import DatePicker from "react-datepicker"; // Importamos react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Estilos de react-datepicker
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { fetcher } from "@/libs/fetcher";
import useUserStore from "@/userStore";

export default function SwimTimesPage() {
  const [userLoaded, setUserLoaded] = useState(false);
  const [defaultSwimmer, setDefaultSwimmer] = useState(null);
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const { data: swimmersData } = useSWR("/api/swimmers", fetcher);
  const { data: competitionsData } = useSWR("/api/competitions", fetcher);
  const { data: categoriesData } = useSWR("/api/categories", fetcher);
  const { data: swimTimesData, mutate: mutateSwimTimes } = useSWR(
    "/api/swim_times",
    fetcher
  );

  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadUser = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch(
          `/api/users/${encodeURIComponent(session.user.email)}`
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        }
        setUserLoaded(true);
      } else {
        setUserLoaded(true);
      }
    };

    loadUser();
  }, [setUser]);

  useEffect(() => {
    if (swimmersData && user) {
      const swimmer = swimmersData.find(
        (swimmer) => swimmer.userId === user.id
      );
      if (swimmer) {
        setDefaultSwimmer(swimmer);
        setValue("swimmer_id", swimmer.id);
      }
    }
    if (competitionsData && competitionsData.length > 0) {
      setValue("competition_id", competitionsData[0].id);
    }
    if (categoriesData && categoriesData.length > 0) {
      setValue("swim_category_id", categoriesData[0].id);
    }
  }, [swimmersData, competitionsData, categoriesData, setValue, user]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("time_in_seconds", data.time_in_seconds);
    formData.append("swimmer_id", data.swimmer_id);
    formData.append("competition_id", data.competition_id);
    formData.append("swim_category_id", data.swim_category_id);
    // formData.append("date_of_register", selectedDate); // Agregar la fecha seleccionada
    formData.append("date_of_register", selectedDate.toISOString()); // Enviar la fecha como cadena ISO

    try {
      const res = await fetch("/api/swim_times", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Tiempos guardados exitosamente");
        mutateSwimTimes();
        reset();
        setValue("swimmer_id", defaultSwimmer.id);
      } else {
        alert("Error al crear el tiempo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Filtrar los tiempos de natación del usuario logueado
  const userSwimTimes = swimTimesData?.filter(
    (swimTime) => swimTime.swimmer_id === defaultSwimmer?.id
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Swim Times</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userSwimTimes?.map((swimTime) => (
          <Card key={swimTime.id}>
            <CardHeader>
              <CardTitle>
                {
                  swimmersData?.find(
                    (swimmer) => swimmer.id === swimTime.swimmer_id
                  )?.user.username
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Competición:{" "}
                {
                  competitionsData?.find(
                    (comp) => comp.id === swimTime.competition_id
                  )?.name
                }
              </CardDescription>
              <CardDescription>
                Categoría de Natación:{" "}
                {
                  categoriesData?.find(
                    (cat) => cat.id === swimTime.swim_category_id
                  )?.name
                }
              </CardDescription>
              <CardDescription>
                Tiempo: {swimTime.time_in_seconds} segundos
              </CardDescription>
            </CardContent>
            <CardFooter>
              <button className="bg-blue-500 text-white p-2 rounded-lg">
                Editar Tiempo
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <form onSubmit={onSubmit} className="w-full md:w-1/2 mt-10">
        <h1 className="text-3xl font-semibold mb-8">Tiempos</h1>

        <label htmlFor="swimmer_id" className="text-sm block mb-2">
          Nadador:
        </label>
        <input
          type="text"
          id="swimmer_id"
          value={defaultSwimmer?.user.username || ""}
          readOnly
          className="p-3 rounded block mb-2 bg-gray-200 w-full"
        />
        {errors.swimmer_id && (
          <span className="text-red-500 text-xs">
            El nombre del nadador es requerido
          </span>
        )}

        <input
          type="hidden"
          id="swimmer_id_hidden"
          {...register("swimmer_id", { required: true })}
        />

        <label htmlFor="competition_id" className="text-sm block mb-2">
          Competición:
        </label>
        <select
          {...register("competition_id", { required: true })}
          className="p-3 rounded block mb-2 bg-gray-200 w-full"
        >
          {competitionsData?.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.name}
            </option>
          ))}
        </select>
        {errors.competition_id && (
          <span className="text-red-500 text-xs">
            La competición es requerida
          </span>
        )}

        <label htmlFor="swim_category_id" className="text-sm block mb-2">
          Categoría de Natación:
        </label>
        <select
          {...register("swim_category_id", { required: true })}
          className="p-3 rounded block mb-4 bg-gray-200 w-full"
        >
          {categoriesData?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.swim_category_id && (
          <span className="text-red-500 text-xs">
            La categoría de natación es requerida
          </span>
        )}

        <label htmlFor="time_in_seconds" className="text-sm block mb-2">
          Tiempo en segundos:
        </label>
        <input
          {...register("time_in_seconds", { required: true })}
          type="number"
          className="p-3 rounded block mb-2 bg-gray-200 w-full"
          step="0.01"
        />
        {errors.time_in_seconds && (
          <span className="text-red-500 text-xs">El tiempo es requerido</span>
        )}

        <label htmlFor="date_of_register" className="text-sm block mb-2">
          Fecha de Registro:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="p-3 rounded block mb-4 bg-gray-200 w-full"
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="dd/MM/yyyy HH:mm"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg mt-4"
        >
          Crear Tiempo
        </button>
      </form>
    </div>
  );
}

/* "use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { getSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { fetcher } from "@/libs/fetcher";
import useUserStore from "@/userStore";

export default function SwimTimesPage() {
  const [userLoaded, setUserLoaded] = useState(false);
  const [defaultSwimmer, setDefaultSwimmer] = useState(null);
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const { data: swimmersData } = useSWR("/api/swimmers", fetcher);
  const { data: competitionsData } = useSWR("/api/competitions", fetcher);
  const { data: categoriesData } = useSWR("/api/categories", fetcher);
  const { data: swimTimesData, mutate: mutateSwimTimes } = useSWR(
    "/api/swim_times",
    fetcher
  );

  useEffect(() => {
    const loadUser = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch(
          `/api/users/${encodeURIComponent(session.user.email)}`
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        }
        setUserLoaded(true);
      } else {
        setUserLoaded(true);
      }
    };

    loadUser();
  }, [setUser]);

  useEffect(() => {
    if (swimmersData && user) {
      const swimmer = swimmersData.find(
        (swimmer) => swimmer.userId === user.id
      );
      if (swimmer) {
        setDefaultSwimmer(swimmer);
        setValue("swimmer_id", swimmer.id);
      }
    }
    if (competitionsData && competitionsData.length > 0) {
      setValue("competition_id", competitionsData[0].id);
    }
    if (categoriesData && categoriesData.length > 0) {
      setValue("swim_category_id", categoriesData[0].id);
    }
  }, [swimmersData, competitionsData, categoriesData, setValue, user]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("time_in_seconds", data.time_in_seconds);
    formData.append("swimmer_id", data.swimmer_id);
    formData.append("competition_id", data.competition_id);
    formData.append("swim_category_id", data.swim_category_id);

    try {
      const res = await fetch("/api/swim_times", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Tiempos guardados exitosamente");
        mutateSwimTimes();
        reset();
        setValue("swimmer_id", defaultSwimmer.id);
      } else {
        alert("Error al crear el tiempo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Filtrar los tiempos de natación del usuario logueado
  const userSwimTimes = swimTimesData?.filter(
    (swimTime) => swimTime.swimmer_id === defaultSwimmer?.id
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Swim Times</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userSwimTimes?.map((swimTime) => (
          <Card key={swimTime.id}>
            <CardHeader>
              <CardTitle>
                {
                  swimmersData?.find(
                    (swimmer) => swimmer.id === swimTime.swimmer_id
                  )?.user.username
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Competición:{" "}
                {
                  competitionsData?.find(
                    (comp) => comp.id === swimTime.competition_id
                  )?.name
                }
              </CardDescription>
              <CardDescription>
                Categoría de Natación:{" "}
                {
                  categoriesData?.find(
                    (cat) => cat.id === swimTime.swim_category_id
                  )?.name
                }
              </CardDescription>
              <CardDescription>
                Tiempo: {swimTime.time_in_seconds} segundos
              </CardDescription>
            </CardContent>
            <CardFooter>
              <button className="bg-blue-500 text-white p-2 rounded-lg">
                Editar Tiempo
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <form onSubmit={onSubmit} className="w-full md:w-1/2 mt-10">
        <h1 className="text-3xl font-semibold mb-8">Tiempos</h1>

        <label htmlFor="swimmer_id" className="text-sm block mb-2">
          Nadador:
        </label>
        <input
          type="text"
          id="swimmer_id"
          value={defaultSwimmer?.user.username || ""}
          readOnly
          className="p-3 rounded block mb-2 bg-gray-200 w-full"
        />
        {errors.swimmer_id && (
          <span className="text-red-500 text-xs">
            El nombre del nadador es requerido
          </span>
        )}

        <input
          type="hidden"
          id="swimmer_id_hidden"
          {...register("swimmer_id", { required: true })}
        />

        <label htmlFor="competition_id" className="text-sm block mb-2">
          Competición:
        </label>
        <select
          {...register("competition_id", { required: true })}
          className="p-3 rounded block mb-2 bg-gray-200 w-full"
        >
          {competitionsData?.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.name}
            </option>
          ))}
        </select>
        {errors.competition_id && (
          <span className="text-red-500 text-xs">
            La competición es requerida
          </span>
        )}

        <label htmlFor="swim_category_id" className="text-sm block mb-2">
          Categoría de Natación:
        </label>
        <select
          {...register("swim_category_id", { required: true })}
          className="p-3 rounded block mb-4 bg-gray-200 w-full"
        >
          {categoriesData?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.swim_category_id && (
          <span className="text-red-500 text-xs">
            La categoría de natación es requerida
          </span>
        )}

        <label htmlFor="time_in_seconds" className="text-sm block mb-2">
          Tiempo en segundos:
        </label>
        <input
          {...register("time_in_seconds", { required: true })}
          type="number"
          className="p-3 rounded block mb-2 bg-gray-200 w-full"
          step="0.01"
        />
        {errors.time_in_seconds && (
          <span className="text-red-500 text-xs">El tiempo es requerido</span>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg mt-4"
        >
          Crear Tiempo
        </button>
      </form>
    </div>
  );
}
 */
