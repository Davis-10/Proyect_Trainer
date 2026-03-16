'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { User, Save, Loader2 } from 'lucide-react'

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  date_of_birth: string | null
  gender: string | null
  height_cm: number | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile(data || { id: user.id, email: user.email, full_name: null, phone: null, date_of_birth: null, gender: null, height_cm: null })
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        height_cm: profile.height_cm,
        updated_at: new Date().toISOString()
      })

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el perfil',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos se han guardado correctamente'
      })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle>{profile?.full_name || 'Usuario'}</CardTitle>
              <CardDescription>{profile?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                value={profile?.full_name || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={profile?.phone || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                placeholder="+54 11 1234-5678"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Fecha de nacimiento</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={profile?.date_of_birth || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, date_of_birth: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <select
                id="gender"
                value={profile?.gender || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, gender: e.target.value} : null)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Seleccionar</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height_cm">Altura (cm)</Label>
              <Input
                id="height_cm"
                type="number"
                value={profile?.height_cm || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, height_cm: parseFloat(e.target.value)} : null)}
                placeholder="175"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
