"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const linkClass =
    "font-extrabold tracking-tight text-gray-800 hover:text-[#5B5BD6] focus:text-[#5B5BD6] transition-colors focus:outline-none";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">

            {/* ── Desktop nav ── */}
            <nav className="relative mx-auto hidden w-full max-w-[85rem] items-center px-8 py-5 sm:flex">

                {/* Izquierda: Catálogo + Preguntas Frecuentes */}
                <div className="flex flex-1 items-center justify-end gap-8 pr-16">
                    <Link href="/catalogo" className={linkClass}>
                        Catálogo
                    </Link>
                    <Link href="/#preguntas-frecuentes" className={linkClass}>
                        Preguntas
                    </Link>
                </div>

                {/* Centro: Logo absoluto */}
                <Link
                    href="/"
                    className="absolute left-1/2 -translate-x-1/2 focus:opacity-80"
                >
                    <Image
                        src="/img/logo_hini.png"
                        alt="HiniBricks Logo"
                        width={72}
                        height={72}
                        className="h-[72px] w-[72px] object-contain"
                        priority
                    />
                </Link>

                {/* Derecha: Contacto */}
                <div className="flex flex-1 items-center pl-16">
                    <Link href="/#contacto" className={linkClass}>
                        Contacto
                    </Link>
                </div>

            </nav>

            {/* ── Mobile nav ── */}
            <nav className="flex w-full items-center justify-between px-4 py-4 sm:hidden">
                <Link href="/" className="focus:opacity-80">
                    <Image
                        src="/img/logo_hini.png"
                        alt="HiniBricks Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                        priority
                    />
                </Link>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 focus:outline-none"
                >
                    {isOpen ? (
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    ) : (
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                    )}
                </button>
            </nav>

            {/* Mobile dropdown */}
            {isOpen && (
                <div className="border-t border-gray-100 px-4 pb-4 sm:hidden">
                    <div className="flex flex-col gap-4 pt-4">
                        <Link
                            href="/catalogo"
                            className={`${linkClass} text-base`}
                            onClick={() => setIsOpen(false)}
                        >
                            Catálogo
                        </Link>
                        <Link
                            href="/#preguntas-frecuentes"
                            className={`${linkClass} text-base`}
                            onClick={() => setIsOpen(false)}
                        >
                            Preguntas Frecuentes
                        </Link>
                        <Link
                            href="/#contacto"
                            className={`${linkClass} text-base`}
                            onClick={() => setIsOpen(false)}
                        >
                            Contacto
                        </Link>
                    </div>
                </div>
            )}

        </header>
    );
};
