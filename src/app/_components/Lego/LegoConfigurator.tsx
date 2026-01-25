"use client";
import React, { useState, useMemo, useCallback } from 'react';
// NUEVO: Importamos 'Check' y 'Lock' para el feedback visual
import { Scissors, Smile, Shirt, ShoppingBag, Sparkles, User, Plus, Check, Lock, Mars, Venus } from 'lucide-react';
import Image from 'next/image';

import { LegoMannequin } from './LegoMannequin';
import { getFilteredItems, type LegoItem } from '~/data/Lego';
import type { Plan } from './PlanSelector';

const CATEGORIES = [
    { id: 'hair', label: 'Pelo', icon: Scissors },
    { id: 'face', label: 'Rostro', icon: Smile },
    { id: 'body', label: 'Ropa', icon: Shirt },
    { id: 'legs', label: 'Pantalón', icon: ShoppingBag },
    { id: 'accs', label: 'Accs.', icon: Sparkles },
];

type FigureNumber = 1 | 2 | 3 | 4;
type FigureSexo = 'male' | 'female' | null;

interface FigureSelection {
    sexo: FigureSexo;
    hair: number | null;
    face: number | null;
    body: number | null;
    legs: number | null;
    accs: number[];
}

interface LegoConfiguratorProps {
    plan: Plan;
    initialSelections?: {
        fig1: FigureSelection;
        fig2: FigureSelection;
        fig3: FigureSelection;
        fig4: FigureSelection;
    };
    onShowSummary: (data: {
        selections: {
            fig1: FigureSelection;
            fig2: FigureSelection;
            fig3: FigureSelection;
            fig4: FigureSelection;
        };
        totalPrice: number;
        extraAccessoriesCount: number;
    }) => void;
}

export const LegoConfigurator: React.FC<LegoConfiguratorProps> = ({ plan, initialSelections, onShowSummary }) => {
    const [activeFigure, setActiveFigure] = useState<FigureNumber>(1);
    const [activeCategory, setActiveCategory] = useState('hair');

    // Estado de selecciones (soporta hasta 4 figuras)
    // Si hay initialSelections, usarlas; sino, usar valores por defecto
    const [selections, setSelections] = useState<{
        fig1: FigureSelection;
        fig2: FigureSelection;
        fig3: FigureSelection;
        fig4: FigureSelection;
    }>(initialSelections ?? {
        fig1: { sexo: null, hair: null, face: null, body: null, legs: null, accs: [] },
        fig2: { sexo: null, hair: null, face: null, body: null, legs: null, accs: [] },
        fig3: { sexo: null, hair: null, face: null, body: null, legs: null, accs: [] },
        fig4: { sexo: null, hair: null, face: null, body: null, legs: null, accs: [] },
    });

    // Tipo para las claves de figuras
    type FigureKey = 'fig1' | 'fig2' | 'fig3' | 'fig4';
    
    // Helper para obtener la clave de figura
    const getFigureKey = useCallback((figNum: FigureNumber): FigureKey => {
        return `fig${figNum}` as FigureKey;
    }, []);

    // Helper para obtener el sexo de la figura activa
    const getCurrentFigureSexo = useCallback(() => {
        const figKey = getFigureKey(activeFigure);
        return selections[figKey].sexo;
    }, [activeFigure, selections, getFigureKey]);

    // Handler para cambiar el sexo de la figura activa
    const handleSexoChange = (sexo: 'male' | 'female') => {
        const figKey = getFigureKey(activeFigure);
        const currentSexo = selections[figKey].sexo;
        
        // Si cambia el sexo, resetear las selecciones de pelo y rostro (ya que son específicas por sexo)
        if (currentSexo !== sexo) {
            setSelections((prev) => ({
                ...prev,
                [figKey]: {
                    ...prev[figKey],
                    sexo,
                    hair: null, // Reset pelo al cambiar sexo
                    face: null, // Reset rostro al cambiar sexo
                }
            }));
        }
    };

    // Calcular accesorios extra que tienen costo adicional
    const calculateExtraAccessories = useCallback(() => {
        let extraCount = 0;
        const maxFigures = plan.maxFigures;
        
        for (let i = 1; i <= maxFigures; i++) {
            const figKey = getFigureKey(i as FigureNumber);
            const accsCount = selections[figKey].accs.length;
            // Si tiene más de los incluidos en el plan, contamos los extra
            if (accsCount > plan.maxAccsPerFigure) {
                extraCount += (accsCount - plan.maxAccsPerFigure);
            }
        }
        
        return extraCount;
    }, [plan.maxFigures, plan.maxAccsPerFigure, selections, getFigureKey]);

    // Calcular precio total
    const totalPrice = useMemo(() => {
        const extraAccs = calculateExtraAccessories();
        return plan.price + (extraAccs * plan.accExtraCost);
    }, [plan.price, plan.accExtraCost, calculateExtraAccessories]);

    // Helper para saber si una categoría específica ya tiene selección
    const isCategoryCompleted = (catId: string) => {
        const figKey = getFigureKey(activeFigure);
        const value = selections[figKey][catId as keyof FigureSelection];
        // Para accesorios, verificamos si el array tiene al menos un elemento
        if (catId === 'accs') {
            return Array.isArray(value) && value.length > 0;
        }
        // Para otras categorías, verificamos si no es null
        return value !== null;
    };

    // Helper para verificar si la figura COMPLETA está lista (por número de figura)
    const isFigureComplete = (figureNum?: FigureNumber) => {
        const figNum = figureNum ?? activeFigure;
        const figKey = getFigureKey(figNum);
        const currentSelections = selections[figKey];
        // Revisamos si TODAS las categorías tienen valor (incluyendo sexo)
        // Para accesorios, verificamos que el array tenga al menos un elemento
        return (
            currentSelections.sexo !== null && // Verificar que tenga sexo seleccionado
            currentSelections.hair !== null &&
            currentSelections.face !== null &&
            currentSelections.body !== null &&
            currentSelections.legs !== null &&
            currentSelections.accs.length > 0 // Al menos un accesorio
        );
    };

    // Helpers específicos para cada figura
    const isFig1Complete = () => isFigureComplete(1);
    const isFig2Complete = () => isFigureComplete(2);
    const isFig3Complete = () => isFigureComplete(3);
    const isFig4Complete = () => isFigureComplete(4);

    // Verificar si TODAS las figuras del plan están completas
    const areAllFiguresComplete = () => {
        for (let i = 1; i <= plan.maxFigures; i++) {
            if (!isFigureComplete(i as FigureNumber)) {
                return false;
            }
        }
        return true;
    };

    // Contar cuántas figuras están completas
    const getCompletedFiguresCount = () => {
        let count = 0;
        for (let i = 1; i <= plan.maxFigures; i++) {
            if (isFigureComplete(i as FigureNumber)) {
                count++;
            }
        }
        return count;
    };

    // Obtener opciones filtradas por categoría y sexo
    const currentOptions = useMemo(() => {
        const figureSexo = getCurrentFigureSexo();
        if (!figureSexo) return []; // Si no hay sexo seleccionado, no mostrar opciones
        return getFilteredItems(activeCategory, figureSexo);
    }, [activeCategory, getCurrentFigureSexo]);

    const handleSelect = (item: LegoItem) => {
        const figKey = getFigureKey(activeFigure);
        
        // Lógica especial para accesorios (múltiples selecciones)
        if (activeCategory === 'accs') {
            setSelections((prev) => {
                const currentAccs = prev[figKey].accs;
                const isAlreadySelected = currentAccs.includes(item.id);
                
                if (isAlreadySelected) {
                    // Si ya está seleccionado, lo removemos
                    return {
                        ...prev,
                        [figKey]: {
                            ...prev[figKey],
                            accs: currentAccs.filter(id => id !== item.id)
                        }
                    };
                } else {
                    // Permitir hasta 2 accesorios por figura
                    // (1 incluido + 1 extra con costo adicional)
                    if (currentAccs.length < 2) {
                        return {
                            ...prev,
                            [figKey]: {
                                ...prev[figKey],
                                accs: [...currentAccs, item.id]
                            }
                        };
                    }
                    // Si ya hay 2 seleccionados, no hacemos nada
                    return prev;
                }
            });
        } else {
            // Para otras categorías, lógica normal (una sola selección)
            const newValue = isSelected(item.id) ? null : item.id;
            setSelections((prev) => ({
                ...prev,
                [figKey]: {
                    ...prev[figKey],
                    [activeCategory]: newValue
                }
            }));
        }
    };

    const isSelected = (itemId: number) => {
        const figKey = getFigureKey(activeFigure);
        
        // Para accesorios, verificamos si está en el array
        if (activeCategory === 'accs') {
            return selections[figKey].accs.includes(itemId);
        }
        
        // Para otras categorías, comparación normal
        return selections[figKey][activeCategory as 'hair' | 'face' | 'body' | 'legs'] === itemId;
    };

    // Helper para verificar si se puede seleccionar más accesorios
    const canSelectMoreAccs = () => {
        if (activeCategory !== 'accs') return true;
        const figKey = getFigureKey(activeFigure);
        return selections[figKey].accs.length < 2;
    };

    // Handler para el botón "Revisar y Confirmar"
    const handleReviewAndConfirm = () => {
        // Solo permite continuar si TODAS las figuras están completas
        if (areAllFiguresComplete()) {
            onShowSummary({
                selections,
                totalPrice,
                extraAccessoriesCount: calculateExtraAccessories(),
            });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full max-w-340 mx-auto p-2 sm:p-4 lg:p-8 min-h-[600px]">

            {/* === COLUMNA IZQUIERDA: PREVIEW === */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 lg:gap-4">
                <div className="relative bg-white rounded-2xl lg:rounded-3xl shadow-xl p-3 sm:p-4 lg:p-6 border border-gray-100 aspect-square lg:aspect-square flex items-center justify-center overflow-visible">

                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-300 text-yellow-900 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm z-20">
                        Editando Figura {activeFigure}
                    </div>

                    <div className="relative w-full h-full border-[6px] lg:border-10 border-slate-800 rounded-lg lg:rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full p-1 lg:p-2">
                            <LegoMannequin activeCategory={activeCategory} />
                        </div>
                    </div>
                </div>

                {/* Botón Agregar Extra - solo visible en plan Familiar */}
                {plan.allowsExtra && (
                    <div className="grid grid-cols-1 gap-4">
                        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-blue-200 bg-white hover:bg-blue-50 transition-colors text-blue-500">
                            <Plus size={24} />
                            <span className="text-sm font-bold">Agregar Extra</span>
                        </button>
                    </div>
                )}

                {/* Resumen de costo */}
                <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-md border border-gray-200">
                    <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Precio Total</p>
                        <p className="text-2xl sm:text-3xl font-black text-blue-600">
                            ${totalPrice.toLocaleString()}
                        </p>
                        {calculateExtraAccessories() > 0 && (
                            <p className="text-xs text-gray-500 mt-2">
                                Incluye {calculateExtraAccessories()} accesorio(s) extra
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* === COLUMNA DERECHA: CONTROLES === */}
            <div className="w-full lg:w-2/3 flex flex-col gap-3 lg:gap-6">

                {/* Selector de Figuras (dinámico según el plan) */}
                <div className="flex gap-2 lg:gap-3 p-1 bg-gray-100/50 rounded-xl lg:rounded-2xl w-fit mx-auto lg:mx-0 flex-wrap">
                    {Array.from({ length: plan.maxFigures }, (_, i) => i + 1).map((figNum) => {
                        const isComplete = figNum === 1 ? isFig1Complete() : 
                                         figNum === 2 ? isFig2Complete() : 
                                         figNum === 3 ? isFig3Complete() : 
                                         isFig4Complete();
                        const figKey = getFigureKey(figNum as FigureNumber);
                        const figureSexo = selections[figKey].sexo;
                        
                        // Color dinámico basado en el sexo seleccionado
                        const getActiveColor = () => {
                            if (figureSexo === 'male') return 'bg-blue-500';
                            if (figureSexo === 'female') return 'bg-pink-500';
                            return 'bg-gray-400';
                        };
                        
                        return (
                            <button
                                key={figNum}
                                onClick={() => setActiveFigure(figNum as FigureNumber)}
                                className={`relative flex items-center gap-1.5 lg:gap-2 px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl transition-all font-bold text-xs sm:text-sm ${
                                    activeFigure === figNum
                                        ? `${getActiveColor()} text-white shadow-md`
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {/* Icono según el sexo */}
                                {figureSexo === 'male' ? (
                                    <span className="text-sm"><Mars size={18} className="lg:w-6 lg:h-6" /></span>
                                ) : figureSexo === 'female' ? (
                                    <span className="text-sm"><Venus size={18} className="lg:w-6 lg:h-6" /></span>
                                ) : (
                                    <User size={14} className="lg:w-4 lg:h-4" />
                                )}
                                Fig. {figNum}
                                {/* Check si la figura está completa */}
                                {isComplete && (
                                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm">
                                        <Check size={10} strokeWidth={4} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Selector de Sexo */}
                <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 lg:mb-3 text-center">
                        ¿Esta figura será Hombre o Mujer?
                    </p>
                    <div className="flex gap-2 lg:gap-3 justify-center">
                        <button
                            onClick={() => handleSexoChange('male')}
                            className={`flex items-center gap-1.5 lg:gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-bold text-xs sm:text-sm lg:text-base transition-all ${
                                getCurrentFigureSexo() === 'male'
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <span className="text-base lg:text-xl"><Mars size={20} className="lg:w-6 lg:h-6" /></span>
                            Hombre
                        </button>
                        <button
                            onClick={() => handleSexoChange('female')}
                            className={`flex items-center gap-1.5 lg:gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-bold text-xs sm:text-sm lg:text-base transition-all ${
                                getCurrentFigureSexo() === 'female'
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <span className="text-base lg:text-xl"><Venus size={20} className="lg:w-6 lg:h-6" /></span>
                            Mujer
                        </button>
                    </div>
                </div>

                {/* Selector de Categorías (Iconos con Check) - Solo visible si hay sexo seleccionado */}
                <div className={`bg-white rounded-2xl lg:rounded-3xl p-1.5 lg:p-2 shadow-sm border border-gray-100 transition-opacity ${
                    !getCurrentFigureSexo() ? 'opacity-50 pointer-events-none' : ''
                }`}>
                    <div className="flex justify-between items-center overflow-x-auto no-scrollbar gap-1.5 lg:gap-2 px-1 lg:px-2 py-1.5 lg:py-2">
                        {CATEGORIES.map((cat) => {
                            // Calculamos si esta categoría ya está lista
                            const isCompleted = isCategoryCompleted(cat.id);

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`relative flex flex-col items-center justify-center gap-0.5 lg:gap-1 min-w-[60px] sm:min-w-[70px] lg:min-w-[80px] p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all shrink-0 border-2 ${activeCategory === cat.id
                                            ? 'bg-yellow-100 border-yellow-400 text-yellow-900 shadow-sm'
                                            : isCompleted
                                                ? 'bg-green-50 border-green-200 text-green-700' // Estilo "Completado" (Verde suave)
                                                : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    {/* Icono de Check Flotante si está completado */}
                                    {isCompleted && (
                                        <div className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm animate-in zoom-in duration-200">
                                            <Check size={8} strokeWidth={4} className="lg:w-2.5 lg:h-2.5" />
                                        </div>
                                    )}

                                    <cat.icon size={18} strokeWidth={2} className="lg:w-6 lg:h-6" />
                                    <span className="text-[10px] sm:text-xs font-semibold">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* GRILLA DE OPCIONES */}
                <div className="bg-white rounded-2xl lg:rounded-[2rem] p-3 sm:p-4 lg:p-6 shadow-xl border border-gray-100 grow relative min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">

                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                        <h3 className="text-gray-800 font-bold flex items-center gap-2 text-sm lg:text-base">
                            Selecciona {CATEGORIES.find(c => c.id === activeCategory)?.label}
                        </h3>
                        {/* Contador de accesorios seleccionados */}
                        {activeCategory === 'accs' && (() => {
                            const figKey = getFigureKey(activeFigure);
                            const count = selections[figKey].accs.length;
                            const extraCount = Math.max(0, count - plan.maxAccsPerFigure);
                            return (
                                <div className="flex flex-col items-end">
                                    <span className="text-xs lg:text-sm text-gray-500 font-semibold">
                                        {count}/2 seleccionados
                                    </span>
                                    {extraCount > 0 && (
                                        <span className="text-[10px] lg:text-xs text-orange-600 font-semibold">
                                            +${(extraCount * plan.accExtraCost).toLocaleString()} extra
                                        </span>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    {!getCurrentFigureSexo() ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 min-h-[200px]">
                            <User size={40} className="mb-3 opacity-30 lg:w-12 lg:h-12" />
                            <p className="text-base lg:text-lg font-semibold">Selecciona el sexo primero</p>
                            <p className="text-xs lg:text-sm mt-1">Elige si la figura será Hombre o Mujer</p>
                        </div>
                    ) : currentOptions.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4 overflow-y-auto max-h-[250px] sm:max-h-[300px] lg:max-h-[400px] pr-1 lg:pr-2 custom-scrollbar pb-16 sm:pb-20">
                            {currentOptions.map((item) => {
                                const selected = isSelected(item.id);
                                const isDisabled = activeCategory === 'accs' && !selected && !canSelectMoreAccs();
                                
                                return (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    disabled={isDisabled}
                                    className={`group relative aspect-square rounded-xl lg:rounded-2xl bg-gray-50 border-2 transition-all overflow-hidden ${
                                        selected
                                            ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                                            : isDisabled
                                                ? 'border-transparent opacity-50 cursor-not-allowed'
                                                : 'border-transparent hover:border-blue-300'
                                        }`}
                                >
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[10px] lg:text-xs text-gray-400">Sin img</div>
                                    )}

                                    <span className="absolute bottom-0 left-0 w-full text-center text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-gray-500 bg-white/90 py-0.5 lg:py-1">
                                        {item.name}
                                    </span>
                                    {/* Indicador de límite alcanzado para accesorios */}
                                    {activeCategory === 'accs' && isDisabled && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl lg:rounded-2xl">
                                            <span className="text-[9px] lg:text-xs font-bold text-white bg-red-500 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded">
                                                Máximo alcanzado
                                            </span>
                                        </div>
                                    )}
                                </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 min-h-[200px]">
                            <Sparkles size={32} className="mb-2 opacity-20 lg:w-10 lg:h-10" />
                            <p className="text-sm lg:text-base">No hay opciones disponibles</p>
                        </div>
                    )}

                    {/* BOTÓN "REVISAR Y CONFIRMAR" (Lógica de Bloqueo) */}
                    <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 right-3 sm:right-4 lg:right-6 z-10">
                        <button
                            // Solo habilitamos si TODAS las figuras del plan están completas
                            disabled={!areAllFiguresComplete()}
                            onClick={handleReviewAndConfirm}
                            className={`flex items-center gap-1.5 lg:gap-2 font-bold py-2 sm:py-2.5 lg:py-3 px-4 sm:px-5 lg:px-6 rounded-xl lg:rounded-2xl shadow-lg transition-all transform text-xs sm:text-sm lg:text-base ${areAllFiguresComplete()
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-blue-500/30 cursor-pointer' // Estado HABILITADO
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' // Estado DESHABILITADO
                                }`}
                        >
                            {/* Cambiamos el icono y texto según el estado */}
                            {areAllFiguresComplete() ? (
                                <>
                                    Revisar y Confirmar
                                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </>
                            ) : (
                                <>
                                    <Lock size={14} className="lg:w-4 lg:h-4" /> {/* Icono de candado */}
                                    {getCompletedFiguresCount()}/{plan.maxFigures} figuras
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};