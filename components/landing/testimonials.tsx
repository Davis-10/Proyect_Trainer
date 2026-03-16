import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'María García',
    role: 'Perdió 15kg en 4 meses',
    content: 'FitPro cambió mi vida. Los planes personalizados y el seguimiento constante me mantuvieron motivada. Nunca pensé que llegaría a mis metas.',
    rating: 5,
    avatar: 'MG',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Ganó 8kg de músculo',
    content: 'Como principiante, necesitaba guía experta. Los entrenadores de FitPro explicaron cada ejercicio y ajustaron mi plan según mi progreso.',
    rating: 5,
    avatar: 'CR',
  },
  {
    name: 'Ana Martínez',
    role: 'Completó su primer maratón',
    content: 'El plan de entrenamiento para running fue increíble. La periodización y los consejos de nutrición me llevaron a cruzar la meta.',
    rating: 5,
    avatar: 'AM',
  },
  {
    name: 'Diego López',
    role: 'Recuperación post-lesión',
    content: 'Después de mi lesión de rodilla, FitPro me ayudó a volver a entrenar de forma segura. Los ejercicios de rehabilitación fueron perfectos.',
    rating: 5,
    avatar: 'DL',
  },
  {
    name: 'Laura Sánchez',
    role: 'Mamá fitness',
    content: 'Con dos hijos, necesitaba rutinas cortas pero efectivas. FitPro me dio exactamente eso: entrenamientos de 30 minutos que funcionan.',
    rating: 5,
    avatar: 'LS',
  },
  {
    name: 'Roberto Fernández',
    role: 'Competidor amateur',
    content: 'Preparándome para mi primera competencia de fitness, FitPro fue clave. El seguimiento de macros y la planificación fueron impecables.',
    rating: 5,
    avatar: 'RF',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Testimonios</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 text-balance">
            Historias de transformación real
          </h2>
          <p className="text-muted-foreground text-lg">
            Miles de personas ya lograron sus objetivos con FitPro. Estas son algunas de sus historias.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
