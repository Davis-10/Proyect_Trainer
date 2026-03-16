import Link from 'next/link'
import { Dumbbell, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center space-y-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">FitPro</span>
        </Link>

        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Algo salió mal</h1>
          <p className="text-muted-foreground">
            {params?.error 
              ? `Error: ${params.error}` 
              : 'Ocurrió un error durante la autenticación. Por favor intenta de nuevo.'}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/auth/login">Intentar de nuevo</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
