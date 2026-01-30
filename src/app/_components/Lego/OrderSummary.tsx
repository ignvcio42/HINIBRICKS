"use client";
import React from 'react';
import { Fondos } from '~/data/Lego/fondos';
import { pets } from '~/data/Lego/pets';
import { CUSTOM_BACKGROUND_ID } from '~/lib/cloudinary';
import { ChevronLeft, Check, User, ShoppingCart, Mail, Phone, MapPin, Mars, Venus, PawPrint } from 'lucide-react';
import Image from 'next/image';
import type { Plan } from './PlanSelector';
import type { CustomerInfo } from './CustomerInfoForm';
import { allLegoItems } from '~/data/Lego';

type FigureSexo = 'male' | 'female' | null;

interface FigureSelection {
    sexo: FigureSexo;
    hair: number | null;
    face: number | null;
    body: number | null;
    legs: number | null;
    accs: number[];
}

const PET_EXTRA_COST = 1000;

interface OrderSummaryProps {
    plan: Plan;
    selections: {
        fig1: FigureSelection;
        fig2: FigureSelection;
        fig3: FigureSelection;
        fig4: FigureSelection;
    };
    totalPrice: number;
    extraAccessoriesCount: number;
    petId: number | null;
    backgroundId: number;
    /** URL de imagen cuando backgroundId === CUSTOM_BACKGROUND_ID (fondo personalizado) */
    customBackgroundUrl?: string | null;
    customerInfo?: CustomerInfo;
    onBack: () => void;
    onConfirm: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    plan,
    selections,
    totalPrice,
    extraAccessoriesCount,
    petId,
    backgroundId,
    customBackgroundUrl = null,
    customerInfo,
    onBack,
    onConfirm,
}) => {
    // Helper para obtener datos del item por ID
    const getItemById = (id: number) => {
        return allLegoItems.find(item => item.id === id);
    };

    // Obtener figuras configuradas
    const configuredFigures = Object.entries(selections)
        .filter(([_, config]) => {
            // Una figura está configurada si tiene sexo, pelo, rostro, cuerpo, piernas y 1 accesorio
            return config.sexo && config.hair && config.face && config.body && config.legs && config.accs.length > 0;
        })
        .map(([key, config]) => {
            // Extraer el número de la figura del key (fig1 -> 1, fig2 -> 2, etc.)
            const figNumber = parseInt(key.replace('fig', ''));
            return {
                number: figNumber,
                key,
                config,
            };
        });

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors mb-4"
                >
                    <ChevronLeft size={20} />
                    Volver a editar
                </button>

                <div className="text-center">
                    <h2 className="text-4xl font-black text-gray-900 mb-2">
                        Revisa tu pedido
                    </h2>
                    <p className="text-lg text-gray-600">
                        Asegúrate de que todo esté perfecto antes de confirmar
                    </p>
                </div>
            </div>

            {/* Información del cliente */}
            {customerInfo && (
                <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg border-2 border-blue-100">
                    <h3 className="text-xl font-black text-gray-900 mb-4">Información de contacto</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <User size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Nombre</p>
                                <p className="text-sm font-bold text-gray-900">{customerInfo.name}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Email</p>
                                <p className="text-sm font-bold text-gray-900">{customerInfo.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Teléfono</p>
                                <p className="text-sm font-bold text-gray-900">{customerInfo.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <User size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">RUT</p>
                                <p className="text-sm font-bold text-gray-900">{customerInfo.rut}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Región</p>
                                <p className="text-sm font-bold text-gray-900">{customerInfo.region}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Comuna</p>
                                <p className="text-sm font-bold text-gray-900">{customerInfo.comuna}</p>
                            </div>
                        </div>
                        {customerInfo.address && (
                            <div className="flex items-start gap-3 md:col-span-2">
                                <MapPin size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">Dirección</p>
                                    <p className="text-sm font-bold text-gray-900">{customerInfo.address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Plan seleccionado */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 mb-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                        <p className="text-blue-100">{plan.dimensions}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-blue-100">Plan Base</p>
                        <p className="text-3xl font-black">${plan.price.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Fondo Seleccionado */}
            <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg border-2 border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-4">Fondo Seleccionado</h3>
                {backgroundId === CUSTOM_BACKGROUND_ID && customBackgroundUrl ? (
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-28 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                                src={customBackgroundUrl}
                                alt="Fondo personalizado"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">Fondo personalizado</h4>
                            <p className="text-gray-500">Imagen subida por el cliente (fondoPersonalizado)</p>
                        </div>
                    </div>
                ) : (() => {
                    const fondo = Fondos.find(f => f.id === backgroundId);
                    if (!fondo) return null;
                    return (
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-28 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                    src={fondo.image}
                                    alt={fondo.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{fondo.name}</h4>
                                <p className="text-gray-500">{fondo.description}</p>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Figuras configuradas */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {configuredFigures.map((figure) => {
                    const { config, number } = figure;
                    const hairItem = config.hair ? getItemById(config.hair) : null;
                    const faceItem = config.face ? getItemById(config.face) : null;
                    const bodyItem = config.body ? getItemById(config.body) : null;
                    const legsItem = config.legs ? getItemById(config.legs) : null;
                    const accsItems = config.accs.map(id => getItemById(id)).filter(Boolean);

                    // Color dinámico basado en el sexo
                    const bgColor = config.sexo === 'male' ? 'bg-blue-500' : 'bg-pink-500';
                    
                    return (
                        <div
                            key={figure.key}
                            className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100"
                        >
                            {/* Header de la figura */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`${bgColor} text-white p-2 rounded-xl`}>
                                    {config.sexo === 'male' ? <Mars size={24} /> : <Venus size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">
                                        Figura {number}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {config.sexo === 'male' ? 'Hombre' : 'Mujer'} • {accsItems.length} accesorio{accsItems.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Items seleccionados */}
                            <div className="space-y-3">
                                {/* Pelo */}
                                {hairItem && (
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image
                                                src={hairItem.image}
                                                alt={hairItem.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-semibold">Pelo</p>
                                            <p className="text-sm font-bold text-gray-900">{hairItem.name}</p>
                                        </div>
                                        <Check size={16} className="text-green-500" />
                                    </div>
                                )}

                                {/* Rostro */}
                                {faceItem && (
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image
                                                src={faceItem.image}
                                                alt={faceItem.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-semibold">Rostro</p>
                                            <p className="text-sm font-bold text-gray-900">{faceItem.name}</p>
                                        </div>
                                        <Check size={16} className="text-green-500" />
                                    </div>
                                )}

                                {/* Ropa */}
                                {bodyItem && (
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image
                                                src={bodyItem.image}
                                                alt={bodyItem.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-semibold">Ropa</p>
                                            <p className="text-sm font-bold text-gray-900">{bodyItem.name}</p>
                                        </div>
                                        <Check size={16} className="text-green-500" />
                                    </div>
                                )}

                                {/* Pantalón */}
                                {legsItem && (
                                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image
                                                src={legsItem.image}
                                                alt={legsItem.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-semibold">Pantalón</p>
                                            <p className="text-sm font-bold text-gray-900">{legsItem.name}</p>
                                        </div>
                                        <Check size={16} className="text-green-500" />
                                    </div>
                                )}

                                {/* Accesorios */}
                                {accsItems.map((accItem, idx) => (
                                    accItem && (
                                        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                                            <div className="relative w-12 h-12 flex-shrink-0">
                                                <Image
                                                    src={accItem.image}
                                                    alt={accItem.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 font-semibold">Accesorio</p>
                                                <p className="text-sm font-bold text-gray-900">{accItem.name}</p>
                                            </div>
                                            {idx >= plan.maxAccsPerFigure && (
                                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                    +${plan.accExtraCost.toLocaleString()}
                                                </span>
                                            )}
                                            <Check size={16} className="text-green-500" />
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mascota seleccionada (si aplica) */}
            {petId !== null && (() => {
                const pet = pets.find(p => p.id === petId);
                if (!pet) return null;
                return (
                    <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg border-2 border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-amber-500 text-white p-2 rounded-xl">
                                <PawPrint size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Mascota</h3>
                                <p className="text-sm text-gray-500">+${PET_EXTRA_COST.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                    src={pet.image}
                                    alt={pet.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Mascota seleccionada</p>
                                <p className="text-sm font-bold text-gray-900">{pet.name}</p>
                            </div>
                            <Check size={20} className="text-green-500 ml-auto" />
                        </div>
                    </div>
                );
            })()}

            {/* Resumen de precio */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-200 mb-8">
                <h3 className="text-xl font-black text-gray-900 mb-4">Resumen de tu pedido</h3>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Plan {plan.name}</span>
                        <span className="font-bold text-gray-900">${plan.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Figuras configuradas</span>
                        <span className="font-bold text-gray-900">{configuredFigures.length}</span>
                    </div>
                    
                    {plan.id === 'familiar' && configuredFigures.some(f => f.number === 4) && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Figura 4 adicional</span>
                            <span className="font-bold text-green-600">+$3.000</span>
                        </div>
                    )}
                    
                    {petId !== null && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mascota</span>
                            <span className="font-bold text-green-600">+${PET_EXTRA_COST.toLocaleString()}</span>
                        </div>
                    )}
                    
                    {extraAccessoriesCount > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                Accesorios extra ({extraAccessoriesCount})
                            </span>
                            <span className="font-bold text-green-600">
                                +${(extraAccessoriesCount * plan.accExtraCost).toLocaleString()}
                            </span>
                        </div>
                    )}
                    
                    <div className="border-t-2 border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-black text-gray-900">Total</span>
                            <span className="text-3xl font-black text-blue-600">
                                ${totalPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                        Volver a editar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold transition-colors shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                        Confirmar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};
