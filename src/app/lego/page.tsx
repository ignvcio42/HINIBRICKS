'use client'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { LegoConfigurator } from '../_components/Lego/LegoConfigurator'
import { PlanSelector, type Plan } from '../_components/Lego/PlanSelector'
import { CustomerInfoForm, type CustomerInfo } from '../_components/Lego/CustomerInfoForm'
import { OrderSummary } from '../_components/Lego/OrderSummary'
import { SuccessModal } from '../_components/Lego/SuccessModal'
import { ChevronLeft } from 'lucide-react'

type FigureSexo = 'male' | 'female' | null;

interface FigureSelection {
  sexo: FigureSexo;
  hair: number | null;
  face: number | null;
  body: number | null;
  legs: number | null;
  accs: number[];
}

export default function LegoPage() {
  // tRPC mutation
  const createOrder = api.order.create.useMutation()

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmedOrderId, setConfirmedOrderId] = useState<number | null>(null)
  const [orderData, setOrderData] = useState<{
    selections: {
      fig1: FigureSelection;
      fig2: FigureSelection;
      fig3: FigureSelection;
      fig4: FigureSelection;
    };
    totalPrice: number;
    extraAccessoriesCount: number;
  } | null>(null)

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
  }

  const handleBackToPlanSelection = () => {
    setSelectedPlan(null)
    setShowCustomerForm(false)
    setShowSummary(false)
    setCustomerInfo(null)
    setOrderData(null)
  }

  const handleGoToCustomerForm = (data: {
    selections: {
      fig1: FigureSelection;
      fig2: FigureSelection;
      fig3: FigureSelection;
      fig4: FigureSelection;
    };
    totalPrice: number;
    extraAccessoriesCount: number;
  }) => {
    setOrderData(data)
    setShowCustomerForm(true)
  }

  const handleBackToConfigurator = () => {
    setShowCustomerForm(false)
    setShowSummary(false)
    // No limpiamos orderData para mantener la configuración
  }

  const handleCustomerInfoSubmit = (info: CustomerInfo) => {
    setCustomerInfo(info)
    setShowCustomerForm(false)
    setShowSummary(true)
  }

  const handleBackToCustomerForm = () => {
    setShowSummary(false)
    setShowCustomerForm(true)
    // No limpiamos customerInfo ni orderData para mantener todo guardado
  }

  const handleConfirmOrder = async () => {
    if (!selectedPlan || !orderData || !customerInfo) return

    // Toast optimista - mostramos inmediatamente con letras negras
    const loadingToast = toast.loading('Procesando tu pedido...', {
      description: 'Estamos guardando tu configuración',
      classNames: {
        toast: 'bg-white',
        title: '!text-gray-900 font-bold',
        description: '!text-gray-600',
      },
    })

    // Mutation optimista con tRPC
    createOrder.mutate(
      {
        plan: selectedPlan,
        selections: orderData.selections,
        totalPrice: orderData.totalPrice,
        extraAccessoriesCount: orderData.extraAccessoriesCount,
        customerInfo: customerInfo,
      },
      {
        onSuccess: (result) => {
          // Actualizar toast a éxito con letras negras
          toast.success('¡Pedido confirmado!', {
            id: loadingToast,
            description: `Tu pedido #${result.id} ha sido registrado exitosamente`,
            duration: 5000,
            classNames: {
              toast: 'bg-white',
              title: '!text-gray-900 font-bold',
              description: '!text-gray-600',
            },
          })

          // Mostrar modal de éxito
          setConfirmedOrderId(result.id)
          setShowSuccessModal(true)
        },
        onError: (error) => {
          // Toast de error con letras negras
          toast.error('Error al confirmar pedido', {
            id: loadingToast,
            description: error.message || 'No pudimos procesar tu pedido. Intenta nuevamente.',
            duration: 5000,
            classNames: {
              toast: 'bg-white',
              title: '!text-gray-900 font-bold',
              description: '!text-gray-600',
            },
          })
          console.error('Error al guardar el pedido:', error)
        },
      }
    )
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const handleBackToPlans = () => {
    setShowSuccessModal(false)
    handleBackToPlanSelection()
  }

  const handleGoHome = () => {
    setShowSuccessModal(false)
    handleBackToPlanSelection()
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-slate-50 py-4 sm:py-6 lg:py-10">
      <div className="container mx-auto px-2 sm:px-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-center text-blue-900 mb-4 sm:mb-6 lg:mb-8">
          PERSONALIZA TUS HINIBRICKS
        </h1>
        
        {!selectedPlan ? (
          /* Paso 1: Selección de plan */
          <PlanSelector onSelectPlan={handlePlanSelect} />
        ) : showCustomerForm ? (
          /* Paso 3: Formulario de información personal */
          <CustomerInfoForm
            initialData={customerInfo}
            onBack={handleBackToConfigurator}
            onSubmit={handleCustomerInfoSubmit}
          />
        ) : showSummary && orderData && customerInfo ? (
          /* Paso 4: Resumen del pedido */
          <OrderSummary
            plan={selectedPlan}
            selections={orderData.selections}
            totalPrice={orderData.totalPrice}
            extraAccessoriesCount={orderData.extraAccessoriesCount}
            customerInfo={customerInfo}
            onBack={handleBackToCustomerForm}
            onConfirm={handleConfirmOrder}
          />
        ) : (
          /* Paso 2: Configurador con el plan seleccionado */
          <div>
            {/* Botón para volver */}
            <button
              onClick={handleBackToPlanSelection}
              className="flex items-center gap-1.5 lg:gap-2 mb-4 lg:mb-6 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm lg:text-base"
            >
              <ChevronLeft size={18} className="lg:w-5 lg:h-5" />
              Cambiar Plan
            </button>

            {/* Info del plan seleccionado */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 mb-4 lg:mb-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm lg:text-base">
                    Plan: {selectedPlan.name}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {selectedPlan.maxFigures} figuras máximo · {selectedPlan.maxAccsPerFigure} accesorio por figura incluido
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl lg:text-2xl font-black text-blue-600">
                    ${selectedPlan.price.toLocaleString()}
                  </span>
                  <p className="text-[10px] lg:text-xs text-gray-500">
                    +${selectedPlan.accExtraCost.toLocaleString()} por accesorio extra
                  </p>
                </div>
              </div>
            </div>

            <LegoConfigurator 
              plan={selectedPlan}
              initialSelections={orderData?.selections}
              onShowSummary={handleGoToCustomerForm}
            />
          </div>
        )}

        {/* Modal de éxito */}
        {confirmedOrderId && (
          <SuccessModal
            isOpen={showSuccessModal}
            orderId={confirmedOrderId}
            onClose={handleCloseSuccessModal}
            onBackToPlans={handleBackToPlans}
            onGoHome={handleGoHome}
          />
        )}
      </div>
    </main>
  )
}
