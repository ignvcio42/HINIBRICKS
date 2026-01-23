"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Package, Calendar, Phone, MapPin, ChevronDown, ChevronUp, CheckCircle, Clock, XCircle, User, ChevronLeft, ChevronRight, Filter, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { allLegoItems, type LegoItem } from '~/data/Lego';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type OrderStatusFilter = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

const ITEMS_PER_PAGE = 10;

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerRut: string;
  customerRegion: string;
  customerComuna: string;
  customerAddress: string | null;
  customerNote: string | null;
  planName: string;
  figures: {
    id: number;
    figureNumber: number;
    hairId: number | null;
    faceId: number | null;
    bodyId: number | null;
    legsId: number | null;
    accessories: string;
  }[];
}

interface OrdersListProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  onUpdateStatus: (id: number, status: OrderStatus) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({ orders, isLoading, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ item: LegoItem; label: string } | null>(null);

  // Filtrado y paginación
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  // Reset a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Helper para buscar item completo por ID
  const getItemById = (id: number | null): LegoItem | null => {
    if (!id) return null;
    return allLegoItems.find(p => p.id === id) ?? null;
  };

  // Helper para parsear accesorios
  const getAccessoriesItems = (accsString: string): LegoItem[] => {
    try {
      const parsed = JSON.parse(accsString) as unknown;
      const ids = Array.isArray(parsed) ? (parsed as number[]) : [];
      return ids.map(id => getItemById(id)).filter((item): item is LegoItem => item !== null);
    } catch (_e) {
      return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, ID o email..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro de Estado */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatusFilter)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Badge con contador */}
          <Badge variant="outline" className="text-sm px-4 py-2 self-center">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
          </Badge>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {paginatedOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            
            {/* Cabecera del Pedido */}
            <div 
              className="p-6 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <Package className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Pedido #{order.id}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <User size={14}/> {order.customerName} | {order.planName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar size={14}/>
                  {new Date(order.createdAt).toLocaleString('es-CL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                
                <div className="font-bold text-lg text-gray-800">
                  ${order.totalPrice.toLocaleString('es-CL')}
                </div>

                <Badge className={`${getStatusColor(order.status)}`}>
                  {order.status === 'pending' ? 'Pendiente' : 
                   order.status === 'processing' ? 'Procesando' : 
                   order.status === 'completed' ? 'Completado' : 'Cancelado'}
                </Badge>

                {expandedOrderId === order.id ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
              </div>
            </div>

            {/* Detalle Expandible */}
            {expandedOrderId === order.id && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-6 md:p-8">
                
                {/* Info Cliente y Acciones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <User size={18} /> Datos del Cliente
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-semibold">Email:</span> {order.customerEmail}</p>
                      <p className="flex items-center gap-2"><Phone size={14}/> {order.customerPhone}</p>
                      <p><span className="font-semibold">RUT:</span> {order.customerRut}</p>
                      <p className="flex items-center gap-2"><MapPin size={14}/> {order.customerRegion}</p>
                      <p className="flex items-center gap-2"><MapPin size={14}/> {order.customerComuna}</p>
                      {order.customerAddress && <p><span className="font-semibold">Dir:</span> {order.customerAddress}</p>}
                      {order.customerNote && <p><span className="font-semibold">Nota:</span> {order.customerNote}</p>}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-700 mb-4">Gestión de Estado</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => onUpdateStatus(order.id, 'processing')}
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Clock size={16} className="mr-2" /> Procesar
                      </Button>
                      <Button 
                        onClick={() => onUpdateStatus(order.id, 'completed')}
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <CheckCircle size={16} className="mr-2" /> Completar
                      </Button>
                      <Button 
                        onClick={() => onUpdateStatus(order.id, 'cancelled')}
                        variant="outline"
                        size="sm"
                        className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                      >
                        <XCircle size={16} className="mr-2" /> Cancelar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Figuras */}
                <h4 className="font-bold text-gray-800 mb-4 text-lg">Figuras Configuradas ({order.figures.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {order.figures.map((fig) => (
                    <div key={fig.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
                      <div className="bg-blue-600 px-4 py-2 text-white font-bold text-sm flex justify-between">
                        <span>Figura #{fig.figureNumber}</span>
                      </div>
                      
                      <div className="p-4 grid grid-cols-2 gap-4 overflow-visible">
                        <div className="space-y-2">
                          <PartPreview label="Pelo" item={getItemById(fig.hairId)} onImageClick={setSelectedImage} />
                          <PartPreview label="Rostro" item={getItemById(fig.faceId)} onImageClick={setSelectedImage} />
                        </div>
                        <div className="space-y-2">
                          <PartPreview label="Cuerpo" item={getItemById(fig.bodyId)} onImageClick={setSelectedImage} />
                          <PartPreview label="Piernas" item={getItemById(fig.legsId)} onImageClick={setSelectedImage} />
                        </div>
                      </div>

                      {/* Accesorios */}
                      <div className="bg-gray-50 p-3 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Accesorios</p>
                        <div className="flex flex-wrap gap-2">
                          {getAccessoriesItems(fig.accessories).map((accItem, i) => (
                            <div 
                              key={i} 
                              className="w-10 h-10 rounded-lg bg-white border border-gray-200 p-1 relative cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
                              onClick={() => setSelectedImage({ item: accItem, label: 'Accesorio' })}
                              title={accItem.name}
                            >
                              <Image src={accItem.image} alt={accItem.name} fill className="object-contain group-hover:scale-110 transition-transform" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                                <ZoomIn size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                          {getAccessoriesItems(fig.accessories).length === 0 && (
                              <span className="text-xs text-gray-400 italic">Sin accesorios</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No se encontraron pedidos con ese criterio.</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} className="mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 text-gray-400">...</span>;
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      )}

      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">{selectedImage.label}</p>
                <h3 className="text-lg font-bold text-gray-900">{selectedImage.item.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="relative aspect-square bg-gray-50">
              <Image 
                src={selectedImage.item.image} 
                alt={selectedImage.item.name} 
                fill 
                className="object-contain p-8" 
              />
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Categoría</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedImage.item.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Género</p>
                  <p className="font-semibold text-gray-800">
                    {selectedImage.item.sexo === 'male' ? 'Hombre' : 
                     selectedImage.item.sexo === 'female' ? 'Mujer' : 'Neutro'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">ID</p>
                  <p className="font-semibold text-gray-800">#{selectedImage.item.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para preview de partes
const PartPreview = ({ 
  label, 
  item, 
  onImageClick 
}: { 
  label: string; 
  item: LegoItem | null; 
  onImageClick: (data: { item: LegoItem; label: string }) => void;
}) => (
  <div className="flex items-center gap-3 group relative">
    <div 
      className={`w-12 h-12 relative bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0 transition-all ${
        item ? 'cursor-pointer hover:border-blue-400 hover:shadow-md' : ''
      }`}
      onClick={() => item && onImageClick({ item, label })}
    >
      {item ? (
        <>
          <Image src={item.image} alt={label} fill className="object-contain group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
            <ZoomIn size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">N/A</div>
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      {item && (
        <span className="text-[10px] text-gray-400 truncate max-w-[80px]" title={item.name}>
          {item.name}
        </span>
      )}
    </div>

    {/* Tooltip */}
    {item && (
      <div className="absolute bottom-full left-0 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-lg pointer-events-none">
        <p className="font-bold">{item.name}</p>
        <p className="text-gray-300">ID: #{item.id}</p>
        <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900"></div>
      </div>
    )}
  </div>
);
