import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Target, TrendingUp, Users } from 'lucide-react'

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Plataforma #1 en fitness personalizado</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Transforma tu cuerpo con{' '}
              <span className="text-primary">ciencia</span> y{' '}
              <span className="text-secondary">dedicación</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Planes de entrenamiento personalizados basados en fisiología del ejercicio, 
              seguimiento inteligente de progreso y asesoría de expertos certificados. 
              Tu transformación comienza hoy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="h-12 px-8 text-base">
                <Link href="/auth/sign-up" className="inline-flex items-center gap-2">
                  Comenzar Gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base inline-flex items-center gap-2">
                <Play className="w-4 h-4" />
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">10K+</div>
                  <div className="text-xs text-muted-foreground">Usuarios</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">95%</div>
                  <div className="text-xs text-muted-foreground">Logran metas</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">4.9</div>
                  <div className="text-xs text-muted-foreground">Calificación</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content - Bento Grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Progreso Semanal</span>
                <span className="text-xs text-primary font-medium">+12%</span>
              </div>
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t-md relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Objetivos</h3>
              <p className="text-sm text-muted-foreground">3 de 5 completados</p>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-primary rounded-full" />
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Calorías</h3>
              <p className="text-sm text-muted-foreground">1,850 / 2,200</p>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-secondary rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
