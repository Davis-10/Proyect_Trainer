import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Dumbbell, 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Play
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user data
  const [
    { data: profile },
    { data: stats },
    { data: goals },
    { data: workoutPlan },
    { data: recentSessions }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('physical_stats').select('*').eq('user_id', user!.id).order('measured_at', { ascending: false }).limit(1).single(),
    supabase.from('fitness_goals').select('*').eq('user_id', user!.id).eq('status', 'active'),
    supabase.from('workout_plans').select('*').eq('user_id', user!.id).eq('is_active', true).single(),
    supabase.from('workout_sessions').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5)
  ])

  const activeGoals = goals?.length || 0
  const completedSessions = recentSessions?.length || 0

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedSessions}</p>
                <p className="text-xs text-muted-foreground">Entrenamientos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeGoals}</p>
                <p className="text-xs text-muted-foreground">Objetivos activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.weight_kg || '--'}</p>
                <p className="text-xs text-muted-foreground">Peso (kg)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.bmi?.toFixed(1) || '--'}</p>
                <p className="text-xs text-muted-foreground">IMC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Workout */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Entrenamiento de Hoy</CardTitle>
            <Link href="/dashboard/plan" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver plan completo <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {workoutPlan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{workoutPlan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {workoutPlan.days_per_week} días/semana • {workoutPlan.difficulty}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Play className="w-4 h-4" />
                    Iniciar
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{workoutPlan.description}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Sin plan activo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crea tu primer plan de entrenamiento personalizado
                </p>
                <Button asChild>
                  <Link href="/dashboard/plan/new">Crear Plan</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Mis Objetivos</CardTitle>
            <Link href="/dashboard/goals" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {goals && goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => {
                  const progress = goal.target_value 
                    ? Math.min(100, (goal.current_value / goal.target_value) * 100)
                    : 0
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{goal.title}</span>
                        <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  Define tus objetivos de fitness
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/goals/new">Agregar Objetivo</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions && recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{session.name || 'Entrenamiento'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{session.duration_minutes || '--'} min</p>
                    <p className="text-xs text-muted-foreground">{session.calories_burned || '--'} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Aún no has registrado ningún entrenamiento
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
