"use client";
import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

interface Props {
  launchDate: Date; // Fecha de lanzamiento
  onUnlock: () => void; // Función que se ejecuta cuando el tiempo llega a 0
  hideNavbarFooter?: boolean; // Si debe ocultar navbar y footer
}

export const ComingSoon = ({ launchDate, onUnlock, hideNavbarFooter = false }: Props) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Estado del contador
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Ocultar Navbar y Footer cuando ComingSoon está activo
  useEffect(() => {
    if (hideNavbarFooter) {
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
      
      // Usar un pequeño delay para asegurar que los elementos estén en el DOM
      const hideElements = () => {
        // Buscar header (que contiene el nav) y footer
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        if (header) {
          header.style.display = 'none';
        }
        if (footer) {
          footer.style.display = 'none';
        }
      };

      // Ejecutar inmediatamente y también después de un pequeño delay
      hideElements();
      const timeout = setTimeout(hideElements, 100);
      const interval = setInterval(hideElements, 500); // Verificar cada 500ms

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
        // Restaurar cuando el componente se desmonte
        document.body.style.overflow = '';
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        if (header) header.style.display = '';
        if (footer) footer.style.display = '';
      };
    }
  }, [hideNavbarFooter]);

  // Lógica de la Cuenta Regresiva
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        onUnlock(); // ¡SE ACABÓ EL TIEMPO! DESBLOQUEAR SITIO
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate, onUnlock]);

  // Manejo del formulario de email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // AQUÍ CONECTARÍAS CON TU TRPC (api.newsletter.subscribe.mutate)
    // Simulamos una espera de red:
    setTimeout(() => {
      console.log("Email guardado:", email);
      setIsRegistered(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] min-h-screen bg-[#4a5ae4] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Decoración de fondo (Círculos difuminados) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        
        {/* Logo / Marca */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg">
            HINI<span className="text-yellow-400">BRICKS</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mt-4 font-medium">
            Construye tu propia historia. Muy pronto.
          </p>
        </div>

        {/* El Contador */}
        <div className="grid grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
          <TimeBox value={timeLeft.days} label="Días" />
          <TimeBox value={timeLeft.hours} label="Horas" />
          <TimeBox value={timeLeft.minutes} label="Minutos" />
          <TimeBox value={timeLeft.seconds} label="Segundos" />
        </div>

        {/* Captura de Email */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
          {!isRegistered ? (
            <>
              <h3 className="text-2xl font-bold text-white mb-2">¡Sé el primero en saberlo!</h3>
              <p className="text-blue-100 mb-6 text-sm">
                Déjanos tu correo y te avisaremos en el instante exacto en que abramos las puertas.
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="email" 
                        required
                        placeholder="tu@correo.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-yellow-400/50 outline-none font-medium"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
                >
                    {isSubmitting ? 'Guardando...' : 'Avisadme del Lanzamiento'}
                    {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8 animate-in zoom-in">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Estás en la lista!</h3>
                <p className="text-blue-100">
                    Te enviaremos un correo secreto en cuanto el contador llegue a cero.
                </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Componente pequeño para las cajas del tiempo
const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="bg-blue-900/40 backdrop-blur-sm rounded-2xl p-3 md:p-6 border border-white/10 shadow-lg">
        <div className="text-3xl md:text-5xl font-black text-white font-mono">
            {value.toString().padStart(2, '0')}
        </div>
        <div className="text-[10px] md:text-xs font-bold text-yellow-400 uppercase tracking-widest mt-1">
            {label}
        </div>
    </div>
);