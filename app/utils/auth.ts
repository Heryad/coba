import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

export async function signInAdmin(email: string, password: string) {
  const supabase = createClientComponentClient<Database>()

  try {
    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return {
        success: false,
        error: authError instanceof Error ? authError.message : 'An unexpected error occurred'
      }
    }

    if (!authData.user) {
      throw new Error('No user data returned after login')
    }

    // 2. Check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (adminError) {
      // If there's an error checking admin status, sign out the user
      await supabase.auth.signOut()
      throw new Error('Error verifying admin status', adminError)
    }

    if (!adminData) {
      // If user is not an admin, sign them out
      await supabase.auth.signOut()
      throw new Error('User is not an admin')
    }

    return {
      success: true,
      session: authData.session,
      admin: adminData
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function signOutAdmin() {
  const supabase = createClientComponentClient<Database>()

  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error('Failed to sign out. Please try again.')
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function getSession() {
  const supabase = createClientComponentClient<Database>()

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      throw new Error('Failed to get session')
    }

    if (!session) {
      return null
    }

    // Check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (adminError || !adminData) {
      return null
    }

    return {
      session,
      admin: adminData
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function makeFirstAdmin(email: string, password: string, username: string) {
  const supabase = createClientComponentClient<Database>()

  try {
    // 1. Sign up the first admin
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user data returned after signup');
    }

    // 2. Make them admin using the function we created
    const { error: adminError } = await supabase.rpc('create_first_admin', {
      admin_id: authData.user.id
    });

    if (adminError) {
      throw adminError;
    }

    return {
      success: true,
      user: authData.user
    };

  } catch (error) {
    console.error('Error creating first admin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}