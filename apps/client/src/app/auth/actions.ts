'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

type LoginState = { success: boolean; message: string } | null

export async function login(prevState: LoginState, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `http://localhost:3000/auth/callback`, // Hardcoded for dev, should be env var
    },
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: 'Check your email for the login link!' }
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}
