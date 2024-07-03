"use client";
import { useEffect, useState } from "react";
import useUserStore from "@/userStore";
import { useRouter } from "next/navigation";
import { signOut, getSession } from "next-auth/react";

function DashboardPage() {
  const [userLoaded, setUserLoaded] = useState(false);
  const user = useUserStore((state) => state.user);
  const userId = useUserStore((state) => state.userId);
  const { setUser, logout } = useUserStore();
  const router = useRouter();
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch(
          `/api/users/${encodeURIComponent(session.user.email)}`
        );
        const data = await response.json();
        console.log("API user data:", data); // Log para verificar la respuesta de la API
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
    if (!userLoaded) return;
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, userLoaded, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user || !user.email || !userId) {
        throw new Error("Usuario no autenticado correctamente");
      }

      const res = await fetch("/api/swimmers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          gender: e.target.gender.value,
          date_of_birth: e.target.date_of_birth.value,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setRequestSuccess(true);
        setRequestError(null);
        useUserStore.setState({ requestCompetitor: true });
      } else {
        setRequestError(
          result.message || "Error al solicitar convertirse en nadador"
        );
      }
    } catch (error) {
      console.error("Error durante la solicitud:", error);
      setRequestError("Error durante la solicitud");
    }
  };

  const handleLogout = async () => {
    await logout();
    await signOut();
    router.push("/auth/login");
  };

  if (!userLoaded) {
    return <p>Cargando...</p>;
  }

  return (
    <section className="h-[calc(100vh-7rem)] flex flex-col justify-center items-center bg-neutral-950">
      <div>
        <h1 className="text-white text-5xl">Dashboard</h1>
        {user ? (
          <>
            <h2 className="text-white text-2xl">Bienvenido, {user.username}</h2>
            <button
              className="bg-white text-red px-4 py-2 rounded-md mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
            {user.requestCompetitor ? (
              <p className="text-white text-xl">
                Ya has solicitado ser nadador
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-6">
                <h3 className="text-white text-2xl mb-4">
                  Solicitar ser nadador
                </h3>
                {requestSuccess && (
                  <p className="bg-green-500 text-white p-3 rounded mb-2">
                    Solicitud enviada con éxito.
                  </p>
                )}
                {requestError && (
                  <p className="bg-red-500 text-white p-3 rounded mb-2">
                    {requestError}
                  </p>
                )}
                <label htmlFor="gender" className="text-white mb-2 block">
                  Género:
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="p-3 rounded block mb-2 bg-gray-800 text-white"
                >
                  <option value="">Selecciona tu género</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
                <label
                  htmlFor="date_of_birth"
                  className="text-white mb-2 block"
                >
                  Fecha de nacimiento:
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  className="p-3 rounded block mb-2 bg-gray-800 text-white"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 rounded mt-4"
                >
                  Enviar solicitud
                </button>
              </form>
            )}
            {user.isCompetitor && (
              <p className="text-white text-xl">Eres un nadador</p>
            )}
          </>
        ) : (
          <p className="text-white text-xl">No hay usuario logueado</p>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;

/* "use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useUserStore from "@/userStore";
import { useRouter } from "next/navigation";
import { signOut, getSession } from "next-auth/react";

function DashboardPage() {
  const [userLoaded, setUserLoaded] = useState(false);
  const user = useUserStore((state) => state.user);
  const userId = useUserStore((state) => state.userId);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const session = await getSession();
      if (session) {
        useUserStore.setState({ user: session.user }); // Actualizar el estado global del usuario
        setUserLoaded(true);
      } else {
        setUserLoaded(true);
      }
    };

    loadUser();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user || !user.email || !userId) {
        throw new Error("Usuario no autenticado correctamente");
      }

      console.log("Datos enviados:", {
        userId,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
      });

      const resSwimmer = await fetch("/api/swimmers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          gender: data.gender,
          date_of_birth: data.date_of_birth,
        }),
      });

      const result = await resSwimmer.json();

      if (resSwimmer.ok) {
        setRequestSuccess(true);
        setRequestError(null);
      } else {
        setRequestError(
          result.message || "Error al solicitar convertirse en nadador"
        );
      }
    } catch (error) {
      console.error("Error durante la solicitud:", error);
      setRequestError("Error durante la solicitud");
    }
  });

  if (!userLoaded) {
    return <p>Cargando...</p>;
  }

  return (
    <section className="h-[calc(100vh-7rem)] flex flex-col justify-center items-center">
      <div>
        <h1 className="text-white text-5xl">Dashboard</h1>
        {user ? (
          <>
            <h2 className="text-white text-2xl">Bienvenido, {user.name}</h2>
            <button
              className="bg-white text-red px-4 py-2 rounded-md mt-4"
              onClick={() => {
                logout();
                signOut();
              }}
            >
              Logout
            </button>

            {!user.requestCompetitor ? (
              <form onSubmit={onSubmit} className="mt-6">
                <h3 className="text-white text-2xl mb-4">
                  Solicitar ser nadador
                </h3>

                {requestSuccess && (
                  <p className="bg-green-500 text-white p-3 rounded mb-2">
                    Solicitud enviada con éxito.
                  </p>
                )}
                {requestError && (
                  <p className="bg-red-500 text-white p-3 rounded mb-2">
                    {requestError}
                  </p>
                )}

                <label htmlFor="gender" className="text-white mb-2 block">
                  Género:
                </label>
                <select
                  id="gender"
                  {...register("gender", {
                    required: "El género es obligatorio",
                  })}
                  className="p-3 rounded block mb-2 bg-gray-800 text-white"
                >
                  <option value="">Selecciona tu género</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
                {errors.gender && (
                  <span className="text-red-500">{errors.gender.message}</span>
                )}

                <label
                  htmlFor="date_of_birth"
                  className="text-white mb-2 block"
                >
                  Fecha de nacimiento:
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  {...register("date_of_birth", {
                    required: "La fecha de nacimiento es obligatoria",
                  })}
                  className="p-3 rounded block mb-2 bg-gray-800 text-white"
                />
                {errors.date_of_birth && (
                  <span className="text-red-500">
                    {errors.date_of_birth.message}
                  </span>
                )}

                <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 rounded mt-4"
                >
                  Enviar solicitud
                </button>
              </form>
            ) : (
              <p className="text-white text-xl">
                Ya has solicitado ser nadador
              </p>
            )}
          </>
        ) : (
          <p className="text-white text-xl">No hay usuario logueado</p>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
 */
