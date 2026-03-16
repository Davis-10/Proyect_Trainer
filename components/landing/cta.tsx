import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl bg-primary overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">7 días de prueba gratis</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 max-w-3xl mx-auto text-balance">
              Comienza tu transformación hoy mismo
            </h2>

            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Únete a más de 10,000 personas que ya están logrando sus objetivos fitness con entrenamiento basado en ciencia.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8"
              >
                <Link href="/auth/sign-up" className="inline-flex items-center gap-2">
                  Comenzar Gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8"
              >
                <Link href="#pricing">Ver Planes</Link>
              </Button>
            </div>

            <p className="text-sm text-primary-foreground/60 mt-6">
              Sin tarjeta de crédito requerida. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
