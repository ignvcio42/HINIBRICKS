"use client";
import React, { useState, useMemo } from 'react';
import { ChevronLeft, User, Mail, Phone, MapPin, ArrowRight, CreditCard, NotebookPen } from 'lucide-react';
import { comunasRegiones } from '~/data/comunasRegiones';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    rut: string;
    region: string;
    comuna: string;
    address?: string;
    note?: string;
}

interface CustomerInfoFormProps {
    initialData?: CustomerInfo | null;
    onBack: () => void;
    onSubmit: (customerInfo: CustomerInfo) => void;
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ initialData, onBack, onSubmit }) => {
    const [formData, setFormData] = useState<CustomerInfo>(initialData ?? {
        name: '',
        email: '',
        phone: '',
        rut: '',
        region: '',
        comuna: '',
        address: '',
        note: '',
    });

    const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

    // Filtrar comunas según la región seleccionada
    const availableComunas = useMemo(() => {
        if (!formData.region) return [];
        const regionData = comunasRegiones.find(r => r.region === formData.region);
        return regionData ? regionData.comunas : [];
    }, [formData.region]);

    // Validar RUT chileno
    const validateRut = (rut: string): boolean => {
        // Limpiar el RUT
        const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
        
        if (cleanRut.length < 2) return false;
        
        const body = cleanRut.slice(0, -1);
        const dv = cleanRut.slice(-1);
        
        // Calcular dígito verificador
        let sum = 0;
        let multiplier = 2;
        
        for (let i = body.length - 1; i >= 0; i--) {
            const digit = body[i];
            if (digit) {
                sum += parseInt(digit) * multiplier;
                multiplier = multiplier === 7 ? 2 : multiplier + 1;
            }
        }
        
        const expectedDv = 11 - (sum % 11);
        const expectedDvStr = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();
        
        return dv === expectedDvStr;
    };

    const validateForm = () => {
        const newErrors: Partial<CustomerInfo> = {};

        // Validar nombre
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        // Validar teléfono
        const phoneRegex = /^[0-9]{9,10}$/;
        const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (!phoneRegex.test(cleanPhone)) {
            newErrors.phone = 'El teléfono debe tener 9 o 10 dígitos';
        }

        // Validar RUT
        if (!formData.rut.trim()) {
            newErrors.rut = 'El RUT es requerido';
        } else if (!validateRut(formData.rut)) {
            newErrors.rut = 'El RUT no es válido';
        }

        // Validar región
        if (!formData.region) {
            newErrors.region = 'La región es requerida';
        }

        // Validar comuna
        if (!formData.comuna) {
            newErrors.comuna = 'La comuna es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (field: keyof CustomerInfo, value: string) => {
        setFormData(prev => {
            // Si se cambia la región, resetear la comuna
            if (field === 'region') {
                return { ...prev, [field]: value, comuna: '' };
            }
            return { ...prev, [field]: value };
        });
        // Limpiar error cuando el usuario empieza a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors mb-4"
                >
                    <ChevronLeft size={20} />
                    Volver al configurador
                </button>

                <div className="text-center">
                    <h2 className="text-4xl font-black text-gray-900 mb-2">
                        Tus datos de contacto
                    </h2>
                    <p className="text-lg text-gray-600">
                        Necesitamos tu información para procesar tu pedido
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
                {/* Nombre */}
                <div className="mb-6">
                    <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <User size={18} className="text-blue-500" />
                        Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                            errors.name 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                        } outline-none`}
                        placeholder="Ej: Juan Pérez"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-6">
                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <Mail size={18} className="text-blue-500" />
                        Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                            errors.email 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                        } outline-none`}
                        placeholder="ejemplo@correo.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Teléfono */}
                <div className="mb-6">
                    <label htmlFor="phone" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <Phone size={18} className="text-blue-500" />
                        Número de Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                            errors.phone 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                        } outline-none`}
                        placeholder="9 1234 5678"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                </div>

                {/* RUT */}
                <div className="mb-6">
                    <label htmlFor="rut" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <CreditCard size={18} className="text-blue-500" />
                        RUT <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="rut"
                        type="text"
                        value={formData.rut}
                        onChange={(e) => handleChange('rut', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                            errors.rut 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                        } outline-none`}
                        placeholder="12.345.678-9"
                    />
                    {errors.rut && (
                        <p className="text-red-500 text-sm mt-1">{errors.rut}</p>
                    )}
                </div>

                {/* Región */}
                <div className="mb-6">
                    <label htmlFor="region" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <MapPin size={18} className="text-blue-500" />
                        Región <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={formData.region}
                        onValueChange={(value) => handleChange('region', value)}
                    >
                        <SelectTrigger className={`h-12 rounded-xl border-2 bg-white shadow-sm ${
                            errors.region 
                                ? 'border-red-300' 
                                : 'border-gray-200'
                        }`}>
                            <SelectValue placeholder="Selecciona una región" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[280px] bg-white shadow-xl border-2 border-gray-200 overflow-y-auto">
                            {comunasRegiones.map((item) => (
                                <SelectItem 
                                    key={item.region} 
                                    value={item.region}
                                    className="cursor-pointer hover:bg-blue-50"
                                >
                                    {item.region}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.region && (
                        <p className="text-red-500 text-sm mt-1">{errors.region}</p>
                    )}
                </div>

                {/* Comuna */}
                <div className="mb-6">
                    <label htmlFor="comuna" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <MapPin size={18} className="text-blue-500" />
                        Comuna <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={formData.comuna}
                        onValueChange={(value) => handleChange('comuna', value)}
                        disabled={!formData.region}
                    >
                        <SelectTrigger className={`h-12 rounded-xl border-2 bg-white shadow-sm ${
                            errors.comuna 
                                ? 'border-red-300' 
                                : 'border-gray-200'
                        } ${!formData.region ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}>
                            <SelectValue placeholder={formData.region ? "Selecciona una comuna" : "Primero selecciona una región"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[280px] bg-white shadow-xl border-2 border-gray-200 overflow-y-auto">
                            {availableComunas.map((comuna) => (
                                <SelectItem 
                                    key={comuna} 
                                    value={comuna}
                                    className="cursor-pointer hover:bg-blue-50"
                                >
                                    {comuna}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.comuna && (
                        <p className="text-red-500 text-sm mt-1">{errors.comuna}</p>
                    )}
                    {!formData.region && (
                        <p className="text-xs text-gray-500 mt-1">
                            Selecciona primero una región para ver las comunas disponibles
                        </p>
                    )}
                </div>

                {/* Dirección (Opcional) */}
                <div className="mb-8">
                    <label htmlFor="address" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <MapPin size={18} className="text-blue-500" />
                        Dirección <span className="text-gray-400 text-xs">(Opcional)</span>
                    </label>
                    <textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors resize-none"
                        placeholder="Calle, número, comuna, ciudad"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Puedes agregar tu dirección para facilitar el envío
                    </p>
                </div>

                {/* Nota */}
                <div className="mb-6">
                    <label htmlFor="note" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <NotebookPen size={18} className="text-blue-500" />
                        Nota <span className="text-gray-400 text-xs">(Opcional)</span>
                    </label>
                    <textarea
                        id="note"
                        value={formData.note}
                        onChange={(e) => handleChange('note', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors resize-none"
                        placeholder="Ej: Necesito que el pedido sea entregado antes de las 10:00 AM"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Puedes agregar una nota para el pedido
                    </p>
                </div>
                {/* Nota sobre campos requeridos */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        <span className="text-red-500 font-bold">*</span> Campos obligatorios
                    </p>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                    >
                        Volver
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        Continuar al Resumen
                        <ArrowRight size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};
