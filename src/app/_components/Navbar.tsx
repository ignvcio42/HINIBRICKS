"use client"

import React, { useState } from 'react';
import Link from 'next/link';


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex w-full flex-wrap bg-[#4a5ae4] py-3 text-sm shadow-lg sm:flex-nowrap sm:justify-start">
      <nav className="mx-auto flex w-full max-w-[85rem] basis-full flex-wrap items-center justify-between px-4">
        
        {/* --- 1. LOGO --- */}
        <Link href="/" className="flex items-center gap-x-2 text-xl font-bold text-white focus:opacity-80">
            {/* Reemplaza '/logo.png' con la ruta real de tu logo subido */}
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-white p-1">
               {/* <Image 
                 src="/assets/logo-hini.png" // Asegúrate de poner tu imagen aquí
                 alt="HiniBricks Logo" 
                 width={40} 
                 height={40} 
                 className="object-contain"
               /> */}
            </div>
            <span className="tracking-wide">HiniBricks</span>
        </Link>

        {/* --- 2. BOTONES DERECHA (Móvil y Desktop) --- */}
        <div className="flex items-center gap-x-2 sm:order-3">

            {/* Botón Menú Hamburguesa (Móvil) */}
            <button 
                type="button" 
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden relative flex h-9 w-9 items-center justify-center gap-x-2 rounded-lg border border-blue-400 bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus:outline-none"
            >
                {isOpen ? (
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                ) : (
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                )}
            </button>
        </div>

        {/* --- 3. LINKS DE NAVEGACIÓN (Centro) --- */}
        <div className={`${isOpen ? 'block' : 'hidden'} basis-full grow sm:block sm:w-auto sm:basis-auto sm:order-2`}>
            <div className="mt-5 flex flex-col gap-5 sm:mt-0 sm:flex-row sm:items-center sm:justify-center sm:pl-5">
                {['Inicio', 'Preguntas Frecuentes', 'Contacto'].map((item) => (
                    <Link 
                        key={item} 
                        href={item === 'Inicio' ? '/' : item === 'Preguntas Frecuentes' ? '/#preguntas-frecuentes' : '/contacto'} 
                        className="font-medium text-white/90 hover:text-yellow-300 focus:outline-none focus:text-yellow-300 transition-colors"
                    >
                        {item}
                    </Link>
                ))}
            </div>
        </div>

      </nav>
    </header>
  );
};