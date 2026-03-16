'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Plus, TrendingUp, TrendingDown, Minus, Scale, Activity, Heart } from 'lucide-react'

interface PhysicalStats {
  id: string
  weight_kg: number | null
  body_fat_percentage: number | null
  muscle_mass_kg: number | null
  bmi: number | null
  waist_cm: number | null
  measured_at: string
}

export default function ProgressPage() {
  const [stats, setStats] = useState<PhysicalStats[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newStats, setNewStats] = useState({
    weight_kg: '',
    body_fat_percentage: '',
    muscle_mass_kg: '',
    waist_cm: '',
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('physical_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false })
        .limit(10)
      
      setStats(data || [])
    }
    setLoading(false)
  }

  const handleAddStats = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Get height from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('height_cm')
      .eq('id', user.id)
      .single()

    const weight = parseFloat(newStats.weight_kg)
    const height = profile?.height_cm
    const bmi = height && weight ? weight / Math.pow(height / 100, 2) : null

    const { error } = await supabase.from('physical_stats').insert({
      user_id: user.id,
      weight_kg: newStats.weight_kg ? parseFloat(newStats.weight_kg) : null,
      body_fat_percentage: newStats.body_fat_percentage ? parseFloat(newStats.body_fat_percentage) : null,
      muscle_mass_kg: newStats.muscle_mass_kg ? parseFloat(newStats.muscle_mass_kg) : null,
      waist_cm: newStats.waist_cm ? parseFloat(newStats.waist_cm) : null,
      bmi: bmi,
      measured_at: new Date().toISOString()
    })

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la medición',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Medición guardada',
        description: 'Tu progreso ha sido registrado'
      })
      setNewStats({ weight_kg: '', body_fat_percentage: '', muscle_mass_kg: '', waist_cm: '' })
      setShowForm(false)
      loadStats()
    }
  }

  const getTrend = (current: number | null, previous: number | null) => {
    if (!current || !previous) return null
    const diff = current - previous
    if (diff > 0) return { icon: TrendingUp, color: 'text-red-500', value: `+${diff.toFixed(1)}` }
    if (diff < 0) return { icon: TrendingDown, color: 'text-green-500', value: diff.toFixed(1) }
    return { icon: Minus, color: 'text-muted-foreground', value: '0' }
  }

  const latestStats = stats[0]
  const previousStats = stats[1]

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Progreso</h1>
          <p className="text-muted-foreground">Seguimiento de tu evolución física</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Medición
        </Button>
      </div>

      {/* Add Stats Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Medición</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newStats.weight_kg}
                  onChange={(e) => setNewStats({...newStats, weight_kg: e.target.value})}
                  placeholder="75.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyfat">% Grasa corporal</Label>
                <Input
                  id="bodyfat"
                  type="number"
                  step="0.1"
                  value={newStats.body_fat_percentage}
                  onChange={(e) => setNewStats({...newStats, body_fat_percentage: e.target.value})}
                  placeholder="18.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="muscle">Masa muscular (kg)</Label>
                <Input
                  id="muscle"
                  type="number"
                  step="0.1"
                  value={newStats.muscle_mass_kg}
                  onChange={(e) => setNewStats({...newStats, muscle_mass_kg: e.target.value})}
                  placeholder="35.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist">Cintura (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.1"
                  value={newStats.waist_cm}
                  onChange={(e) => setNewStats({...newStats, waist_cm: e.target.value})}
                  placeholder="85"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddStats}>Guardar Medición</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Scale className="w-5 h-5 text-primary" />
              {latestStats && previousStats && (
                (() => {
                  const trend = getTrend(latestStats.weight_kg, previousStats.weight_kg)
                  if (trend) {
                    const TrendIcon = trend.icon
                    return (
                      <span className={`text-xs flex items-center gap-1 ${trend.color}`}>
                        <TrendIcon className="w-3 h-3" />
                        {trend.value}
                      </span>
                    )
                  }
                  return null
                })()
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{latestStats?.weight_kg || '--'}</p>
            <p className="text-xs text-muted-foreground">Peso (kg)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{latestStats?.body_fat_percentage || '--'}%</p>
            <p className="text-xs text-muted-foreground">Grasa corporal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{latestStats?.muscle_mass_kg || '--'}</p>
            <p className="text-xs text-muted-foreground">Masa muscular (kg)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{latestStats?.bmi?.toFixed(1) || '--'}</p>
            <p className="text-xs text-muted-foreground">IMC</p>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Mediciones</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Fecha</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Peso</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">% Grasa</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Músculo</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">IMC</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat) => (
                    <tr key={stat.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2 text-sm text-foreground">
                        {new Date(stat.measured_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-2 text-sm text-foreground text-right">{stat.weight_kg || '--'} kg</td>
                      <td className="py-3 px-2 text-sm text-foreground text-right">{stat.body_fat_percentage || '--'}%</td>
                      <td className="py-3 px-2 text-sm text-foreground text-right">{stat.muscle_mass_kg || '--'} kg</td>
                      <td className="py-3 px-2 text-sm text-foreground text-right">{stat.bmi?.toFixed(1) || '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aún no hay mediciones registradas</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
                Agregar primera medición
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
