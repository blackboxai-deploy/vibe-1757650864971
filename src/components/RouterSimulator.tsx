'use client'

import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

type SimulationStep = {
  id: string
  title: string
  description: string
  duration: number
  status: 'pending' | 'running' | 'completed' | 'error'
}

interface RouterSimulatorProps {
  onComplete: () => void
}

export function RouterSimulator({ onComplete }: RouterSimulatorProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const steps: SimulationStep[] = [
    {
      id: 'connect',
      title: 'Conectando al router',
      description: 'Accediendo a 192.168.192.1...',
      duration: 2000,
      status: 'pending'
    },
    {
      id: 'login',
      title: 'Iniciando sesión',
      description: 'Autenticando con credenciales (user / LTE@Endusr)...',
      duration: 1500,
      status: 'pending'
    },
    {
      id: 'skip',
      title: 'Omitiendo ventana',
      description: 'Saltando ventana emergente...',
      duration: 800,
      status: 'pending'
    },
    {
      id: 'navigate',
      title: 'Navegando a configuración',
      description: 'Accediendo a Ajustes > Sistema > Reiniciar...',
      duration: 1200,
      status: 'pending'
    },
    {
      id: 'restart',
      title: 'Reiniciando router',
      description: 'Confirmando reinicio del dispositivo...',
      duration: 3000,
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Proceso completado',
      description: 'Router reiniciado exitosamente',
      duration: 1000,
      status: 'pending'
    }
  ]

  const [simulationSteps, setSimulationSteps] = useState(steps)

  useEffect(() => {
    if (currentStepIndex < simulationSteps.length && !isComplete) {
      // Mark current step as running
      setSimulationSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === currentStepIndex ? 'running' : 
                index < currentStepIndex ? 'completed' : 'pending'
      })))

      const currentStep = simulationSteps[currentStepIndex]
      const stepDuration = currentStep.duration

      // Animate progress for current step
      let startTime = Date.now()
      const baseProgress = (currentStepIndex / simulationSteps.length) * 100
      const stepProgress = (1 / simulationSteps.length) * 100

      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const stepCompletion = Math.min(elapsed / stepDuration, 1)
        const currentProgress = baseProgress + (stepProgress * stepCompletion)
        
        setProgress(currentProgress)

        if (stepCompletion < 1) {
          requestAnimationFrame(updateProgress)
        } else {
          // Mark step as completed and move to next
          setSimulationSteps(prev => prev.map((step, index) => ({
            ...step,
            status: index <= currentStepIndex ? 'completed' : 'pending'
          })))
          
          if (currentStepIndex === simulationSteps.length - 1) {
            setIsComplete(true)
            setProgress(100)
          } else {
            setTimeout(() => {
              setCurrentStepIndex(prev => prev + 1)
            }, 500)
          }
        }
      }

      updateProgress()
    }
  }, [currentStepIndex, simulationSteps, isComplete])

  const getStepIcon = (step: SimulationStep) => {
    switch (step.status) {
      case 'completed':
        return (
          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )
      case 'running':
        return (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        )
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progreso</span>
          <span className="text-gray-900 font-semibold">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {simulationSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
              step.status === 'running' 
                ? 'bg-blue-50 border border-blue-200' 
                : step.status === 'completed'
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0">
              {getStepIcon(step)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                step.status === 'running' ? 'text-blue-900' :
                step.status === 'completed' ? 'text-green-900' :
                'text-gray-700'
              }`}>
                {step.title}
              </p>
              <p className={`text-sm ${
                step.status === 'running' ? 'text-blue-600' :
                step.status === 'completed' ? 'text-green-600' :
                'text-gray-500'
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Actions */}
      {isComplete && (
        <div className="text-center pt-4 space-y-4">
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              ¡Router reiniciado exitosamente!
            </h3>
            <p className="text-green-700">
              El proceso de reinicio se ha completado. El router debería estar funcionando normalmente en unos momentos.
            </p>
          </div>
          
          <Button 
            onClick={onComplete}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Finalizar
          </Button>
        </div>
      )}
    </div>
  )
}