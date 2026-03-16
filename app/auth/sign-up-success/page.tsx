import Link from 'next/link'
import { Dumbbell, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center space-y-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">FitPro</span>
        </Link>

        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">¡Revisa tu correo!</h1>
          <p className="text-muted-foreground">
            Te hemos enviado un enlace de confirmación. Por favor verifica tu email para activar tu cuenta y comenzar tu transformación.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            ¿No recibiste el correo? Revisa tu carpeta de spam o{' '}
            <button className="text-primary hover:underline">reenviar email</button>
          </p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login" className="inline-flex items-center gap-2">
            Ir a iniciar sesión
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
