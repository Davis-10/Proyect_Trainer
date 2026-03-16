'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Plus, Calendar, Dumbbell, Play, Trash2, Loader2 } from 'lucide-react'

interface WorkoutPlan {
  id: string
  name: string
  description: string | null
  duration_weeks: number
  difficulty: string
  plan_type: string
  days_per_week: number
  is_active: boolean
  created_at: string
}

const planTypes = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'hypertrophy', label: 'Hipertrofia' },
  { value: 'endurance', label: 'Resistencia' },
  { value: 'weight_loss', label: 'Pérdida de peso' },
  { value: 'functional', label: 'Funcional' },
  { value: 'hybrid', label: 'Híbrido' },
]

const difficulties = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
]

export default function PlanPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    duration_weeks: '4',
    difficulty: 'intermediate',
    plan_type: 'hypertrophy',
    days_per_week: '4',
  })
  const { toast } = useToast()

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setPlans(data || [])
    }
    setLoading(false)
  }

  const handleCreate = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !newPlan.name) return

    setCreating(true)

    const { error } = await supabase.from('workout_plans').insert({
      user_id: user.id,
      name: newPlan.name,
      description: newPlan.description || null,
      duration_weeks: parseInt(newPlan.duration_weeks),
      difficulty: newPlan.difficulty,
      plan_type: newPlan.plan_type,
      days_per_week: parseInt(newPlan.days_per_week),
      is_active: true
    })

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el plan',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Plan creado',
        description: '¡Tu nuevo plan de entrenamiento está listo!'
      })
      setNewPlan({
        name: '',
        description: '',
        duration_weeks: '4',
        difficulty: 'intermediate',
        plan_type: 'hypertrophy',
        days_per_week: '4',
      })
      setShowForm(false)
      loadPlans()
    }
    setCreating(false)
  }

  const handleSetActive = async (planId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Deactivate all plans
    await supabase
      .from('workout_plans')
      .update({ is_active: false })
      .eq('user_id', user.id)

    // Activate selected plan
    await supabase
      .from('workout_plans')
      .update({ is_active: true, started_at: new Date().toISOString() })
      .eq('id', planId)

    toast({ title: 'Plan activado', description: '¡A entrenar!' })
    loadPlans()
  }

  const handleDelete = async (planId: string) => {
    const supabase = createClient()
    await supabase.from('workout_plans').delete().eq('id', planId)
    toast({ title: 'Plan eliminado' })
    loadPlans()
  }

  const activePlan = plans.find(p => p.is_active)
  const inactivePlans = plans.filter(p => !p.is_active)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Planes</h1>
          <p className="text-muted-foreground">Gestiona tus planes de entrenamiento</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Plan
        </Button>
      </div>

      {/* Create Plan Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Plan de Entrenamiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del plan</Label>
                <Input
                  id="name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  placeholder="Mi plan de fuerza"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan_type">Tipo de entrenamiento</Label>
                <select
                  id="plan_type"
                  value={newPlan.plan_type}
                  onChange={(e) => setNewPlan({...newPlan, plan_type: e.target.value})}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {planTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                placeholder="Describe tu plan de entrenamiento"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (semanas)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="52"
                  value={newPlan.duration_weeks}
                  onChange={(e) => setNewPlan({...newPlan, duration_weeks: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="days">Días por semana</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="7"
                  value={newPlan.days_per_week}
                  onChange={(e) => setNewPlan({...newPlan, days_per_week: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <select
                  id="difficulty"
                  value={newPlan.difficulty}
                  onChange={(e) => setNewPlan({...newPlan, difficulty: e.target.value})}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {difficulties.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={creating || !newPlan.name}>
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Plan'
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Plan */}
      {activePlan && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Plan Activo</h2>
          <Card className="border-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                    <Dumbbell className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{activePlan.name}</h3>
                    <p className="text-muted-foreground">{activePlan.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {activePlan.duration_weeks} semanas
                      </span>
                      <span>{activePlan.days_per_week} días/semana</span>
                      <span className="capitalize">{activePlan.difficulty}</span>
                    </div>
                  </div>
                </div>
                <Button size="lg" className="gap-2">
                  <Play className="w-4 h-4" />
                  Entrenar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Other Plans */}
      {inactivePlans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Otros Planes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {inactivePlans.map(plan => (
              <Card key={plan.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plan.days_per_week} días • {plan.duration_weeks} semanas
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSetActive(plan.id)}>
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(plan.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {plans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Sin planes de entrenamiento</h3>
            <p className="text-muted-foreground mb-4">Crea tu primer plan personalizado</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear mi primer plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
