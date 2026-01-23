"use client";
import React from 'react';
import { DollarSign, Package, TrendingUp, Users, Star, ShoppingBag, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { allLegoItems } from '~/data/Lego';

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  customerName: string;
  planName: string;
  figures: {
    id: number;
    hairId: number | null;
    faceId: number | null;
    bodyId: number | null;
    legsId: number | null;
    accessories: string;
  }[];
}

interface AdminStatsProps {
  orders: Order[] | undefined;
  isLoading: boolean;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ orders, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
        <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="font-medium">No hay datos para mostrar aún.</p>
      </div>
    );
  }

  // Calcular estadísticas
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  // Ingresos del mes actual
  const now = new Date();
  const currentMonthRevenue = orders
    .filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === now.getMonth() && 
             orderDate.getFullYear() === now.getFullYear() &&
             o.status !== 'cancelled';
    })
    .reduce((acc, order) => acc + order.totalPrice, 0);

  // Ingresos del mes anterior
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthRevenue = orders
    .filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === lastMonth.getMonth() && 
             orderDate.getFullYear() === lastMonth.getFullYear() &&
             o.status !== 'cancelled';
    })
    .reduce((acc, order) => acc + order.totalPrice, 0);

  // Calcular porcentaje de cambio
  const revenueChange = lastMonthRevenue > 0 
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : currentMonthRevenue > 0 ? 100 : 0;

  // Plan más popular
  const planCounts: Record<string, number> = {};
  orders.forEach(order => {
    planCounts[order.planName] = (planCounts[order.planName] ?? 0) + 1;
  });
  const popularPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0];

  // Contar items más seleccionados
  const itemCounts: Record<number, number> = {};
  orders.forEach(order => {
    order.figures.forEach(fig => {
      if (fig.hairId) itemCounts[fig.hairId] = (itemCounts[fig.hairId] ?? 0) + 1;
      if (fig.faceId) itemCounts[fig.faceId] = (itemCounts[fig.faceId] ?? 0) + 1;
      if (fig.bodyId) itemCounts[fig.bodyId] = (itemCounts[fig.bodyId] ?? 0) + 1;
      if (fig.legsId) itemCounts[fig.legsId] = (itemCounts[fig.legsId] ?? 0) + 1;
      try {
        const parsed = JSON.parse(fig.accessories) as unknown;
        const accs = Array.isArray(parsed) ? (parsed as number[]) : [];
        accs.forEach(accId => {
          itemCounts[accId] = (itemCounts[accId] ?? 0) + 1;
        });
      } catch (_e) {}
    });
  });

  // Top 5 items más populares
  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const item = allLegoItems.find(i => i.id === parseInt(id));
      return { item, count };
    })
    .filter(i => i.item);

  // Pedidos recientes (últimos 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Total de figuras configuradas
  const totalFigures = orders.reduce((acc, order) => acc + order.figures.length, 0);

  return (
    <div className="space-y-6">
      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ingresos totales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className={`flex items-center text-sm font-semibold ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(revenueChange).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Ingresos Totales</p>
          <p className="text-3xl font-black text-gray-900">${totalRevenue.toLocaleString('es-CL')}</p>
          <p className="text-xs text-gray-400 mt-2">Este mes: ${currentMonthRevenue.toLocaleString('es-CL')}</p>
        </div>

        {/* Total pedidos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Pedidos</p>
          <p className="text-3xl font-black text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-400 mt-2">{totalFigures} figuras configuradas</p>
        </div>

        {/* Tasa de conversión */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Tasa de Éxito</p>
          <p className="text-3xl font-black text-gray-900">
            {orders.length > 0 ? ((completedOrders / orders.length) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-gray-400 mt-2">{completedOrders} completados de {orders.length}</p>
        </div>

        {/* Plan más popular */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Plan Más Popular</p>
          <p className="text-2xl font-black text-gray-900">{popularPlan ? popularPlan[0] : 'N/A'}</p>
          <p className="text-xs text-gray-400 mt-2">{popularPlan ? `${popularPlan[1]} pedidos` : ''}</p>
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado de pedidos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} />
            Estado de Pedidos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-sm text-gray-600">Pendientes</span>
              </div>
              <span className="font-bold text-gray-900">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm text-gray-600">Procesando</span>
              </div>
              <span className="font-bold text-gray-900">{processingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm text-gray-600">Completados</span>
              </div>
              <span className="font-bold text-gray-900">{completedOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-sm text-gray-600">Cancelados</span>
              </div>
              <span className="font-bold text-gray-900">{cancelledOrders}</span>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="mt-6 h-3 bg-gray-100 rounded-full overflow-hidden flex">
            {orders.length > 0 && (
              <>
                <div 
                  className="bg-yellow-400 h-full" 
                  style={{ width: `${(pendingOrders / orders.length) * 100}%` }}
                ></div>
                <div 
                  className="bg-blue-400 h-full" 
                  style={{ width: `${(processingOrders / orders.length) * 100}%` }}
                ></div>
                <div 
                  className="bg-green-400 h-full" 
                  style={{ width: `${(completedOrders / orders.length) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-400 h-full" 
                  style={{ width: `${(cancelledOrders / orders.length) * 100}%` }}
                ></div>
              </>
            )}
          </div>
        </div>

        {/* Items más populares */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            Items Más Elegidos
          </h3>
          <div className="space-y-3">
            {topItems.map((entry, idx) => (
              <div key={entry.item?.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  idx === 0 ? 'bg-yellow-500' : 
                  idx === 1 ? 'bg-gray-400' : 
                  idx === 2 ? 'bg-amber-600' : 'bg-gray-300'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{entry.item?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{entry.item?.category}</p>
                </div>
                <span className="text-sm font-bold text-blue-600">{entry.count}x</span>
              </div>
            ))}
            {topItems.length === 0 && (
              <p className="text-sm text-gray-400 italic">Sin datos suficientes</p>
            )}
          </div>
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={18} />
            Pedidos Recientes
          </h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-800">#{order.id} - {order.customerName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('es-CL', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${order.totalPrice.toLocaleString('es-CL')}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'completed' ? 'Completado' :
                     order.status === 'processing' ? 'Procesando' :
                     order.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
