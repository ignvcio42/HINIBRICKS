import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const CtaButton = () => (
    <Link
        href="/lego"
        className="group inline-flex items-center gap-4 rounded-2xl bg-[#FFC107] px-14 py-6 text-2xl font-extrabold text-gray-900 shadow-[0_8px_32px_rgba(255,193,7,0.55)] transition-all duration-300 hover:scale-105 hover:bg-yellow-400 hover:shadow-[0_14px_44px_rgba(255,193,7,0.75)] active:scale-95"
    >
        ¡Arma tu cuadro!
        <svg
            className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
    </Link>
)

export const Hero = () => {
    return (
        <>
            {/* ── BLOQUE 1: Full-screen imagen + botón ── */}
            <section className="relative w-full h-screen overflow-hidden">

                {/* Imagen de fondo al 50% de opacidad */}
                <Image
                    src="/img/HERO_BANNER.png"
                    alt="HiniBricks"
                    fill
                    className="object-cover object-center opacity-50"
                    priority
                />

                {/* Botón centrado exacto: horizontal + vertical */}
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <CtaButton />
                </div>

            </section>

            {/* ── BLOQUE 2: Sección de bienvenida — dos columnas ── */}
            <section className="w-full bg-white py-16 md:py-24">
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 md:flex-row md:items-center md:justify-between">

                    {/* Columna izquierda: texto + CTA */}
                    <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">

                        {/* Badge */}
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#5B5BD6]/10 px-4 py-1.5 text-sm font-semibold text-[#5B5BD6] ring-1 ring-[#5B5BD6]/20">
                            Figuras de Lego personalizadas
                        </span>

                        {/* Título */}
                        <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                            Bienvenido a{' '}
                            <span className="text-[#5B5BD6]">HiniBricks</span>
                        </h1>

                        {/* Subtítulo */}
                        <p className="mb-10 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
                            Construye tu propio cuadro con nosotros. Elige el plan que más te guste y armá tu figura única.
                        </p>

                        <CtaButton />

                        {/* Micro-texto de confianza */}
                        <p className="mt-4 text-xs text-gray-400">
                            ✓ Sin complicaciones &nbsp;·&nbsp; ✓ 100% personalizado &nbsp;·&nbsp; ✓ Envíos a todo el país
                        </p>
                    </div>

                    {/* Columna derecha: logo mimetizado */}
                    <div className="flex-shrink-0">
                        <Image
                            src="/img/logo_hini.png"
                            alt="HiniBricks Logo"
                            width={420}
                            height={420}
                            className="w-[260px] sm:w-[320px] md:w-[360px] lg:w-[420px] mix-blend-multiply"
                        />
                    </div>

                </div>
            </section>
        </>
    )
}
