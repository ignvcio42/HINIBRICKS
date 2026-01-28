import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export const Hero = () => {
    return (
        <section className="text-gray-600 body-font">
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐨 𝐚 𝐇𝐢𝐧𝐢𝐁𝐫𝐢𝐜𝐤𝐬!
                    </h1>
                    <p className="mb-8 leading-relaxed">Construye tu propio Lego con nosotros. Elige el plan que más te guste y armá tu propio Lego.</p>
                    <div className="flex justify-center">
                        {/* Botón CTA Principal (Hidden en móvil muy pequeño si quieres) */}
                        <Link
                            href="/lego"
                            className="sm:inline-flex items-center gap-x-2 rounded-full border border-transparent bg-yellow-400 px-4 py-2 text-sm font-bold text-blue-900 shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all transform hover:scale-105"
                        >
                            ¡Armar Lego!
                        </Link>
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    <Image className="object-cover object-center rounded-lg hover:scale-105 transition-all duration-300" alt="hero" src="/img/HERO_BANNER.png" width={1500} height={1500} />
                </div>
            </div>
        </section>
    )
}
