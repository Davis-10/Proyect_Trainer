'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Check, Crown, Zap, Star, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Plan {
  id: string
  name: string
  slug: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  max_workout_plans: number
  has_nutrition_tracking: boolean
  has_trainer_chat: boolean
  has_video_calls: boolean
}

interface Subscription {
  id: string
  plan_id: string
  status: string
  billing_cycle: string
  current_period_end: string
  plans: Plan
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Load plans
    const { data: plansData } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true })

    setPlans(plansData || [])

    // Load current subscription
    if (user) {
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      setSubscription(subData)
    }

    setLoading(false)
  }

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Calculate period end
    const periodEnd = new Date()
    if (billingCycle === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    }

    // Cancel existing subscription if any
    if (subscription) {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', subscription.id)
    }

    // Create new subscription
    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_id: planId,
      status: 'active',
      billing_cycle: billingCycle,
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString()
    })

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo procesar la suscripción',
        variant: 'destructive'
      })
    } else {
      toast({
        title: '¡Suscripción exitosa!',
        description: 'Bienvenido a tu nuevo plan'
      })
      loadData()
    }

    setSubscribing(null)
  }

  const handleCancel = async () => {
    if (!subscription) return

    const supabase = createClient()
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', subscription.id)

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cancelar la suscripción',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Suscripción cancelada',
        description: 'Tu suscripción ha sido cancelada'
      })
      setSubscription(null)
    }
  }

  const getPlanIcon = (slug: string) => {
    switch (slug) {
      case 'basic': return Zap
      case 'goup': return Star
      case 'expert': return Crown
      default: return Zap
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Suscripción</h1>
        <p className="text-muted-foreground">Gestiona tu plan y facturación</p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  {(() => {
                    const Icon = getPlanIcon(subscription.plans.slug)
                    return <Icon className="w-6 h-6 text-primary-foreground" />
                  })()}
                </div>
                <div>
                  <CardTitle>Plan {subscription.plans.name}</CardTitle>
                  <CardDescription>Activo hasta {new Date(subscription.current_period_end).toLocaleDateString('es-ES')}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  ${subscription.billing_cycle === 'monthly' 
                    ? subscription.plans.price_monthly 
                    : subscription.plans.price_yearly}
                </p>
                <p className="text-sm text-muted-foreground">
                  /{subscription.billing_cycle === 'monthly' ? 'mes' : 'año'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar Suscripción
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            billingCycle === 'monthly' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Mensual
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            billingCycle === 'yearly' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Anual
          <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
            -17%
          </span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = getPlanIcon(plan.slug)
          const isCurrentPlan = subscription?.plan_id === plan.id
          const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
          const isPopular = plan.slug === 'goup'

          return (
            <Card 
              key={plan.id} 
              className={`relative ${isPopular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'bg-primary/5' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Más Popular
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isPopular ? 'bg-primary' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${isPopular ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-foreground">${price}</span>
                  <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'mes' : 'año'}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={isCurrentPlan ? 'outline' : isPopular ? 'default' : 'outline'}
                  disabled={isCurrentPlan || subscribing === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {subscribing === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : isCurrentPlan ? (
                    'Plan Actual'
                  ) : (
                    'Elegir Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Todos los planes incluyen 7 días de prueba gratis. Cancela cuando quieras sin compromiso.
      </p>
    </div>
  )
}
