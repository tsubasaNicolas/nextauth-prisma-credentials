"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useUserStore from "@/userStore";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);
  const { setUser } = useUserStore();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res.error) {
        setError(res.error);
      } else {
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if (session) {
          const emailEncoded = encodeURIComponent(session.user.email);
          const userRes = await fetch(`/api/users/${emailEncoded}`);
          const userData = await userRes.json();

          if (userData && userData.id) {
            setUser({
              id: userData.id,
              name: session.user.name,
              email: session.user.email,
              isCompetitor: userData.isCompetitor || false,
              requestCompetitor: userData.requestCompetitor || false,
            });
            router.push("/dashboard");
          } else {
            setError("No se encontró el usuario en la base de datos");
          }
        } else {
          setError("No se pudo obtener la sesión del usuario");
        }
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      setError("Error durante el inicio de sesión");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">
            {error}
          </p>
        )}
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>

        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          Email:
        </label>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "El email es obligatorio",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="usuario@ejemplo.com"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Contraseña:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "La contraseña es obligatoria",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="******"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

/* "use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useUserStore from "@/userStore";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);
  const setUser = useUserStore((state) => state.setUser);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res.error) {
        setError(res.error);
      } else {
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if (session) {
          const emailEncoded = encodeURIComponent(session.user.email);
          const userRes = await fetch(`/api/users/${emailEncoded}`);
          const userData = await userRes.json();

          if (userData && userData.id) {
            setUser({ ...session.user, id: userData.id });
            router.push("/dashboard");
          } else {
            setError("No se encontró el usuario en la base de datos");
          }
        } else {
          setError("No se pudo obtener la sesión del usuario");
        }
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      setError("Error durante el inicio de sesión");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">
            {error}
          </p>
        )}
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>

        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          Email:
        </label>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "El email es obligatorio",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="usuario@ejemplo.com"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Contraseña:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "La contraseña es obligatoria",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="******"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
 */
