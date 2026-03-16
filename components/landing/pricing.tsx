import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: 29.99,
    description: 'Ideal para comenzar tu transformación',
    features: [
      'Acceso a rutinas básicas',
      'Seguimiento de progreso',
      'Calculadora de IMC y calorías',
      '1 plan de entrenamiento',
      'Soporte por email',
    ],
    popular: false,
    cta: 'Comenzar',
  },
  {
    name: 'GoUp',
    price: 49.99,
    description: 'Para quienes buscan resultados serios',
    features: [
      'Todo lo de Basic',
      'Planes personalizados ilimitados',
      'Seguimiento nutricional completo',
      'Chat con entrenador',
      'Análisis de progreso avanzado',
      'Comunidad exclusiva',
    ],
    popular: true,
    cta: 'Más Popular',
  },
  {
    name: 'Expert',
    price: 79.99,
    description: 'Experiencia premium personalizada',
    features: [
      'Todo lo de GoUp',
      'Videollamadas con entrenador',
      'Plan nutricional personalizado',
      'Soporte prioritario 24/7',
      'Contenido exclusivo',
      'Sesiones 1-a-1 mensuales',
    ],
    popular: false,
    cta: 'Ir Premium',
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Planes</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 text-balance">
            Invierte en tu salud
          </h2>
          <p className="text-muted-foreground text-lg">
            Elige el plan que mejor se adapte a tus objetivos. Todos incluyen 7 días de prueba gratis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border ${
                plan.popular 
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xl scale-105' 
                  : 'bg-card border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                  Más Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold ${plan.popular ? '' : 'text-foreground'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mt-2 ${plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? '' : 'text-foreground'}`}>
                  ${plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  /mes
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.popular ? 'bg-primary-foreground/20' : 'bg-primary/10'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>
                    <span className={`text-sm ${plan.popular ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild 
                className={`w-full ${plan.popular ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' : ''}`}
                variant={plan.popular ? 'secondary' : 'default'}
              >
                <Link href="/auth/sign-up">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Todos los planes incluyen 7 días de prueba gratis. Cancela cuando quieras.
        </p>
      </div>
    </section>
  )
}
