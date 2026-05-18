"use client";
import { useState, useEffect } from "react";
import { Hero } from "./_components/Hero";
import { HowToBuy } from "./_components/HowToBuy";
import { ContactSection } from "./_components/ContactSection";
import { Qa } from "./_components/Qa";
import { ComingSoon } from "./_components/ComingSoon";
import { HomeConfetti } from "./_components/HomeConfetti";

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState<boolean>(false);
  const [launchDate, setLaunchDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si ComingSoon está activado mediante variable de entorno
    const showComingSoonEnv = process.env.NEXT_PUBLIC_SHOW_COMING_SOON === "true";
    const launchDateStr = process.env.NEXT_PUBLIC_LAUNCH_DATE;
    
    console.log("ComingSoon Env Check:", {
      showComingSoonEnv,
      launchDateStr,
      NEXT_PUBLIC_SHOW_COMING_SOON: process.env.NEXT_PUBLIC_SHOW_COMING_SOON
    });
    
    if (!showComingSoonEnv || !launchDateStr) {
      // Si no está configurado, no mostrar ComingSoon
      console.log("ComingSoon desactivado: variables no configuradas");
      setShowComingSoon(false);
      setIsLoading(false);
      return;
    }

    // Parsear la fecha de lanzamiento
    const parsedLaunchDate = new Date(launchDateStr);
    
    // Validar que la fecha sea válida
    if (isNaN(parsedLaunchDate.getTime())) {
      console.warn("NEXT_PUBLIC_LAUNCH_DATE no es una fecha válida:", launchDateStr);
      setShowComingSoon(false);
      setIsLoading(false);
      return;
    }

    setLaunchDate(parsedLaunchDate);
    const now = new Date();

    // Si la fecha ya pasó, no mostrar ComingSoon
    if (now >= parsedLaunchDate) {
      console.log("Fecha de lanzamiento ya pasó");
      setShowComingSoon(false);
      setIsLoading(false);
      return;
    }

    // Inicialmente mostrar ComingSoon
    console.log("Mostrando ComingSoon hasta:", parsedLaunchDate);
    setShowComingSoon(true);
    setIsLoading(false);

    // Verificar periódicamente si la fecha ya pasó
    const checkInterval = setInterval(() => {
      const currentTime = new Date();
      if (currentTime >= parsedLaunchDate) {
        console.log("¡Tiempo agotado! Mostrando contenido normal");
        setShowComingSoon(false);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  // Si debe mostrar ComingSoon, renderizarlo
  if (showComingSoon && launchDate) {
    return (
      <ComingSoon 
        launchDate={launchDate} 
        onUnlock={() => {
          console.log("Unlock llamado");
          setShowComingSoon(false);
        }}
        hideNavbarFooter={true}
      />
    );
  }

  // Contenido normal
  return (
    <main className="flex min-h-screen flex-col">

      <HomeConfetti />

      {/* Hero — Full Width */}
      <div className="w-full">
        <Hero />
      </div>

      {/* Cómo comprar */}
      <div className="w-full">
        <HowToBuy />
      </div>

      {/* Contacto */}
      <div className="w-full">
        <ContactSection />
      </div>

      {/* FAQ — Full Width */}
      <div className="w-full">
        <Qa />
      </div>

    </main>
  );
}