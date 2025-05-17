'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastContext';

type User = {
    id: string;
    email_address: string;
    username?: string;
    phone_number?: string;
    photo_url?: string;
    total_orders?: number;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, username: string) => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { addToast } = useToast();

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserData(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                await fetchUserData(session.user.id);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchUserData = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users_table')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            setUser(data);
            console.log(data)
        } catch (error) {
            console.error('Error fetching user data:', error);
            addToast('Error fetching user data', 'error');
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            addToast('Signed in successfully!', 'success');
            router.push('/');
        } catch (error) {
            console.error('Error signing in:', error);
            addToast(error instanceof Error ? error.message : 'Error signing in', 'error');
        }
    };

    const signUp = async (email: string, password: string, username: string) => {
        try {
            // First, create the auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // Then, create the user profile in users_table
                const { error: profileError } = await supabase
                    .from('users_table')
                    .insert([
                        {
                            id: authData.user.id,
                            email_address: email,
                            username: username,
                        },
                    ]);

                if (profileError) throw profileError;

                addToast('Account created successfully!', 'success');
                router.push('/auth/email-verify');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            addToast(error instanceof Error ? error.message : 'Error signing up', 'error');
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            addToast('Signed out successfully!', 'success');
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
            addToast(error instanceof Error ? error.message : 'Error signing out', 'error');
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            addToast(error instanceof Error ? error.message : 'Error signing in with Google', 'error');
        }
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 