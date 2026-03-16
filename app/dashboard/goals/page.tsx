'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Plus, Target, Check, Trash2, Edit2 } from 'lucide-react'

interface FitnessGoal {
  id: string
  goal_type: string
  title: string
  description: string | null
  target_value: number | null
  current_value: number | null
  unit: string | null
  target_date: string | null
  status: string
  created_at: string
}

const goalTypes = [
  { value: 'weight_loss', label: 'Pérdida de peso' },
  { value: 'muscle_gain', label: 'Ganancia muscular' },
  { value: 'endurance', label: 'Resistencia' },
  { value: 'strength', label: 'Fuerza' },
  { value: 'flexibility', label: 'Flexibilidad' },
  { value: 'general_fitness', label: 'Fitness general' },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<FitnessGoal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    goal_type: 'weight_loss',
    title: '',
    description: '',
    target_value: '',
    current_value: '',
    unit: 'kg',
    target_date: '',
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadGoals()
  }, [])

  async function loadGoals() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('fitness_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      setGoals(data || [])
    }
    setLoading(false)
  }

  const handleAddGoal = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !newGoal.title) return

    const { error } = await supabase.from('fitness_goals').insert({
      user_id: user.id,
      goal_type: newGoal.goal_type,
      title: newGoal.title,
      description: newGoal.description || null,
      target_value: newGoal.target_value ? parseFloat(newGoal.target_value) : null,
      current_value: newGoal.current_value ? parseFloat(newGoal.current_value) : null,
      unit: newGoal.unit || null,
      target_date: newGoal.target_date || null,
      status: 'active'
    })

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el objetivo',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Objetivo creado',
        description: '¡Tu nuevo objetivo está listo!'
      })
      setNewGoal({
        goal_type: 'weight_loss',
        title: '',
        description: '',
        target_value: '',
        current_value: '',
        unit: 'kg',
        target_date: '',
      })
      setShowForm(false)
      loadGoals()
    }
  }

  const handleComplete = async (goalId: string) => {
    const supabase = createClient()
    await supabase
      .from('fitness_goals')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', goalId)
    
    toast({ title: '¡Felicitaciones!', description: 'Has completado tu objetivo' })
    loadGoals()
  }

  const handleDelete = async (goalId: string) => {
    const supabase = createClient()
    await supabase.from('fitness_goals').delete().eq('id', goalId)
    toast({ title: 'Objetivo eliminado' })
    loadGoals()
  }

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Objetivos</h1>
          <p className="text-muted-foreground">Define y alcanza tus metas fitness</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Objetivo
        </Button>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Objetivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal_type">Tipo de objetivo</Label>
                <select
                  id="goal_type"
                  value={newGoal.goal_type}
                  onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value})}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {goalTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="Ej: Bajar a 75kg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Detalles adicionales sobre tu objetivo"
              />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_value">Valor actual</Label>
                <Input
                  id="current_value"
                  type="number"
                  step="0.1"
                  value={newGoal.current_value}
                  onChange={(e) => setNewGoal({...newGoal, current_value: e.target.value})}
                  placeholder="80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_value">Valor objetivo</Label>
                <Input
                  id="target_value"
                  type="number"
                  step="0.1"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal({...newGoal, target_value: e.target.value})}
                  placeholder="75"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unidad</Label>
                <Input
                  id="unit"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  placeholder="kg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_date">Fecha límite</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddGoal}>Crear Objetivo</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Objetivos Activos ({activeGoals.length})</h2>
        {activeGoals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {activeGoals.map(goal => {
              const progress = goal.target_value && goal.current_value
                ? Math.min(100, Math.abs((goal.current_value / goal.target_value) * 100))
                : 0
              
              return (
                <Card key={goal.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{goal.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {goalTypes.find(t => t.value === goal.goal_type)?.label}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleComplete(goal.id)}>
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(goal.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {goal.description && (
                      <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                    )}

                    {goal.target_value && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {goal.current_value || 0} / {goal.target_value} {goal.unit}
                          </span>
                          <span className="font-medium text-primary">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {goal.target_date && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Fecha límite: {new Date(goal.target_date).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No tienes objetivos activos</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
                Crear primer objetivo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Objetivos Completados ({completedGoals.length})</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {completedGoals.map(goal => (
              <Card key={goal.id} className="bg-green-500/5 border-green-500/20">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{goal.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Completado el {new Date(goal.completed_at || goal.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
