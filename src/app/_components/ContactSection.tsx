"use client";

import React, { useState } from "react";

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  mensaje: string;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-[#5B5BD6] focus:outline-none focus:ring-2 focus:ring-[#5B5BD6]/20";

export const ContactSection = () => {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrar Resend para envío a hinibricks@gmail.com
    console.log("Formulario enviado:", form);
  };

  return (
    <section id="contacto" className="w-full bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* Título */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            ¿Tienes alguna{" "}
            <span className="text-[#5B5BD6]">consulta?</span>
          </h2>
          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            Completa el formulario y te respondemos a la brevedad.
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-[600px] flex flex-col gap-4"
        >
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="text-sm font-semibold text-gray-700">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="apellido" className="text-sm font-semibold text-gray-700">
                Apellido
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Tu apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="telefono" className="text-sm font-semibold text-gray-700">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="+56 9 1234 5678"
              required
              value={form.telefono}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Mensaje */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mensaje" className="text-sm font-semibold text-gray-700">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              placeholder="¿En qué podemos ayudarte?"
              required
              value={form.mensaje}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-[#5B5BD6] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#4a4ac0] hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5B5BD6]/40"
          >
            Enviar mensaje
          </button>
        </form>

      </div>
    </section>
  );
};
