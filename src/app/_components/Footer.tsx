'use client'
import React from 'react'
import { Instagram } from 'lucide-react';


export const Footer = () => {
    return (
        <footer className="text-gray-400 bg-gray-900 body-font">
            <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
                <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
                    <span className="ml-3 text-xl">HiniBricks</span>
                </a>
                <p className="text-sm text-gray-400 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-800 sm:py-2 sm:mt-0 mt-4">© 2026 HINIBRICKS — Todos los derechos reservados —
                    <a href="https://twitter.com/hini_bricks" className="text-gray-500 ml-1" target="_blank" rel="noopener noreferrer">@hini_bricks</a>
                </p>
                <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                    <a href="https://www.instagram.com/hinibricks/" className="ml-3 text-gray-400" target="_blank" rel="noopener noreferrer">
                        <Instagram />
                    </a>
                </span>
            </div>
        </footer>
    )
}
