'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

// export async function signup(formData: FormData) {
//     const supabase = await createClient()

//     // type-casting here for convenience
//     // in practice, you should validate your inputs
//     const data = {
//         email: formData.get('email') as string,
//         password: formData.get('password') as string,
//     }

//     const { error } = await supabase.auth.signUp(data)

//     if (error) {

//         redirect('/error')

//     }

//     revalidatePath('/', 'layout')
//     redirect('/')
// }


export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Basic validation before sending request
    if (!email || !password) {
        // Return an error page if email or password is missing
        return redirect('/error?message=Email and password are required')
    }

    // You can add further validation here (like email format check or password length)

    try {
        const { error } = await supabase.auth.signUp({ email, password })

        if (error) {
            // Return the error message as query parameter to show on the error page
            return redirect(`/error?message=${encodeURIComponent(error.message)}`)
        }

        // After successful signup, revalidate and redirect
        revalidatePath('/', 'layout')
        return redirect('/')
    } catch (err) {
        // Catch any unexpected errors and redirect with a generic error message
        console.error('Signup error:', err)
        return redirect('/error?message=An unexpected error occurred')
    }
}


export async function logout() {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const { error } = await supabase.auth.signOut()

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}