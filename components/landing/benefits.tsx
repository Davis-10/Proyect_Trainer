import { 
  Brain, 
  LineChart, 
  Dumbbell, 
  Utensils, 
  MessageCircle, 
  Smartphone,
  ArrowRight
} from 'lucide-react'

const benefits = [
  {
    icon: Brain,
    title: 'Basado en Ciencia',
    description: 'Programas diseñados con principios de fisiología del ejercicio, biomecánica y periodización del entrenamiento.',
    color: 'primary',
  },
  {
    icon: LineChart,
    title: 'Seguimiento Inteligente',
    description: 'Monitorea tu progreso con métricas detalladas: peso, composición corporal, fuerza y rendimiento.',
    color: 'secondary',
  },
  {
    icon: Dumbbell,
    title: 'Rutinas Personalizadas',
    description: 'Planes adaptados a tus objetivos, nivel de experiencia, equipamiento disponible y tiempo.',
    color: 'primary',
  },
  {
    icon: Utensils,
    title: 'Nutrición Integrada',
    description: 'Calcula tus macros, registra comidas y optimiza tu alimentación para maximizar resultados.',
    color: 'secondary',
  },
  {
    icon: MessageCircle,
    title: 'Asesoría de Expertos',
    description: 'Acceso a entrenadores certificados que resuelven tus dudas y ajustan tu programa.',
    color: 'primary',
  },
  {
    icon: Smartphone,
    title: 'Acceso Total',
    description: 'Entrena donde quieras. Plataforma web y móvil sincronizadas en tiempo real.',
    color: 'secondary',
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Beneficios</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 text-balance">
            Todo lo que necesitas para alcanzar tus metas
          </h2>
          <p className="text-muted-foreground text-lg">
            Una plataforma completa que combina tecnología avanzada con conocimiento experto en ciencias del deporte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                benefit.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
              }`}>
                <benefit.icon className={`w-7 h-7 ${
                  benefit.color === 'primary' ? 'text-primary' : 'text-secondary'
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Saber más</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
