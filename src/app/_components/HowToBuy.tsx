import React from "react";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Revisa el catálogo",
    content: (
      <>
        Antes de armar tu cuadro, revisa todas las piezas disponibles en
        nuestro catálogo.{" "}
        <Link
          href="/catalogo"
          className="font-semibold text-[#5B5BD6] underline underline-offset-2 hover:text-[#4a4ac0] transition-colors"
        >
          Ver catálogo
        </Link>
      </>
    ),
  },
  {
    number: 2,
    title: "Elige tu cuadro",
    content: (
      <>
        Presiona <span className="font-semibold">¡Arma tu cuadro!</span> y
        elige el tamaño que prefieras:
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <span className="font-semibold">Cuadro 15×20</span> → $19.990
            (hasta 2 figuras)
          </li>
          <li>
            <span className="font-semibold">Cuadro 20×25</span> → $24.990
            (hasta 4 figuras)
          </li>
        </ul>
        <div className="mt-2 text-xs text-gray-400">
          Los precios incluyen 2 figuras. Las figuras adicionales tienen un
          costo extra.
        </div>
      </>
    ),
  },
  {
    number: 3,
    title: "Completa el formulario",
    content: (
      <>
        Llena el formulario con tus datos con cuidado, ya que nos
        contactaremos contigo para coordinar el pago.
      </>
    ),
  },
  {
    number: 4,
    title: "Realiza el pago",
    content: (
      <>
        Tienes <span className="font-semibold">8 horas</span> desde que te
        contactemos para confirmar tu pago por transferencia. Si no confirmas
        en ese plazo, tu pedido quedará cancelado automáticamente.
      </>
    ),
  },
];

export const HowToBuy = () => {
  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* Título */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            ¿Cómo comprar en{" "}
            <span className="text-[#5B5BD6]">HiniBricks</span>?
          </h2>
          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            En 4 simples pasos tu cuadro personalizado estará listo.
          </p>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Número de paso */}
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#5B5BD6]/10 text-sm font-extrabold text-[#5B5BD6]">
                  {step.number}
                </span>
              </div>

              {/* Título del paso */}
              <h3 className="text-base font-bold text-gray-900">
                {step.title}
              </h3>

              {/* Descripción */}
              <div className="text-sm leading-relaxed text-gray-500">
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
