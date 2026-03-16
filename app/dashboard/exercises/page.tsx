'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Dumbbell } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  description: string | null
  muscle_group: string
  equipment: string | null
  difficulty: string
  exercise_type: string
  is_compound: boolean
}

const muscleGroups = [
  { value: 'all', label: 'Todos' },
  { value: 'chest', label: 'Pecho' },
  { value: 'back', label: 'Espalda' },
  { value: 'shoulders', label: 'Hombros' },
  { value: 'biceps', label: 'Bíceps' },
  { value: 'triceps', label: 'Tríceps' },
  { value: 'core', label: 'Core' },
  { value: 'quadriceps', label: 'Cuádriceps' },
  { value: 'hamstrings', label: 'Isquiotibiales' },
  { value: 'glutes', label: 'Glúteos' },
  { value: 'calves', label: 'Pantorrillas' },
]

const difficultyLabels: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
}

const equipmentLabels: Record<string, string> = {
  none: 'Sin equipo',
  dumbbells: 'Mancuernas',
  barbell: 'Barra',
  cables: 'Poleas',
  machines: 'Máquinas',
  kettlebell: 'Kettlebell',
  resistance_bands: 'Bandas',
  bodyweight: 'Peso corporal',
  cardio_machine: 'Cardio',
  other: 'Otro'
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExercises()
  }, [selectedMuscle])

  async function loadExercises() {
    const supabase = createClient()
    
    let query = supabase
      .from('exercises')
      .select('*')
      .eq('is_public', true)
      .order('name')

    if (selectedMuscle !== 'all') {
      query = query.eq('muscle_group', selectedMuscle)
    }

    const { data } = await query
    setExercises(data || [])
    setLoading(false)
  }

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-600'
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-600'
      case 'advanced': return 'bg-red-500/10 text-red-600'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Biblioteca de Ejercicios</h1>
        <p className="text-muted-foreground">Explora nuestra colección de ejercicios</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ejercicios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {muscleGroups.map(group => (
            <Button
              key={group.value}
              variant={selectedMuscle === group.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMuscle(group.value)}
              className="whitespace-nowrap"
            >
              {group.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(exercise => (
          <Card key={exercise.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {exercise.description || 'Sin descripción'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {difficultyLabels[exercise.difficulty]}
                    </span>
                    {exercise.equipment && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                        {equipmentLabels[exercise.equipment] || exercise.equipment}
                      </span>
                    )}
                    {exercise.is_compound && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        Compuesto
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && !loading && (
        <div className="text-center py-12">
          <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No se encontraron ejercicios</p>
        </div>
      )}
    </div>
  )
}
