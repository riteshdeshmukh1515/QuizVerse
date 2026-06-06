import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthChangeEvent, Session, User as SupabaseUser } from "@supabase/supabase-js";
import type { User, Role } from "../types";
import { supabase } from "../lib/supabase";
import { useStorage } from "../utils/storage";

interface AuthResult {
  success: boolean;
  error?: string;
  role?: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: Role
  ) => Promise<AuthResult>;
  logout: () => Promise<void> | void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean }>;
  updateProfile: (updates: Partial<User>) => Promise<void> | void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const avatarColors = [
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-orange-500 to-rose-600",
  "bg-gradient-to-br from-pink-500 to-violet-600",
];

function randomColor() {
  return avatarColors[Math.floor(Math.random() * avatarColors.length)];
}

function hashPassword(password: string): string {
  return btoa(password + "_quizverse_salt");
}

async function buildSupabaseUser(authUser: SupabaseUser | null): Promise<User | null> {
  if (!authUser || !supabase) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,name,email,role,avatar_color,created_at")
    .eq("id", authUser.id)
    .maybeSingle();

  if (profile) {
    return {
      id: profile.id,
      name: profile.name || authUser.user_metadata?.name || authUser.email || "Student",
      email: profile.email || authUser.email || "",
      role: profile.role as Role,
      avatarColor: profile.avatar_color || randomColor(),
      createdAt: profile.created_at || authUser.created_at || new Date().toISOString(),
    };
  }

  const fallbackProfile = {
    id: authUser.id,
    name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "Student",
    email: authUser.email || "",
    role: (authUser.user_metadata?.role as Role) || "student",
    avatar_color: authUser.user_metadata?.avatar_color || randomColor(),
  };

  await supabase.from("profiles").upsert(fallbackProfile, { onConflict: "id" });

  return {
    id: fallbackProfile.id,
    name: fallbackProfile.name,
    email: fallbackProfile.email,
    role: fallbackProfile.role,
    avatarColor: fallbackProfile.avatar_color,
    createdAt: authUser.created_at || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useStorage<User[]>("quizverse_users", []);
  const [currentUserId, setCurrentUserId] = useStorage<string | null>(
    "quizverse_current_user",
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (supabase) return;

    if (users.length === 0) {
      const admin: User = {
        id: "admin-default",
        name: "Admin User",
        email: "admin@quizverse.com",
        password: hashPassword("admin123"),
        role: "admin",
        avatarColor: avatarColors[0],
        createdAt: new Date().toISOString(),
      };
      const student: User = {
        id: "student-demo",
        name: "Demo Student",
        email: "student@quizverse.com",
        password: hashPassword("student123"),
        role: "student",
        avatarColor: avatarColors[1],
        createdAt: new Date().toISOString(),
      };
      setUsers([admin, student]);
    }
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let mounted = true;

    const loadSession = async () => {
      const { data } = await client.auth.getSession();
      const profile = await buildSupabaseUser(data.session?.user || null);
      if (mounted) {
        setUser(profile);
        setLoading(false);
      }
    };

    const { data: listener } = client.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        const profile = await buildSupabaseUser(session?.user || null);
        if (mounted) setUser(profile);
      }
    );

    loadSession();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (supabase) return;

    if (currentUserId) {
      const found = users.find((u) => u.id === currentUserId);
      setUser(found || null);
    } else {
      setUser(null);
    }
  }, [currentUserId, users]);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      const profile = await buildSupabaseUser(data.user);
      setUser(profile);
      return { success: true, role: profile?.role || "student" };
    }

    const hashed = hashPassword(password);
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: "User not found" };
    if (found.password !== hashed) return { success: false, error: "Invalid password" };
    setCurrentUserId(found.id);
    return { success: true, role: found.role };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: Role = "student"
  ): Promise<AuthResult> => {
    if (supabase) {
      const avatarColor = randomColor();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            avatar_color: avatarColor,
          },
        },
      });

      if (error) return { success: false, error: error.message };

      if (data.user) {
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            name,
            email,
            role,
            avatar_color: avatarColor,
          },
          { onConflict: "id" }
        );
        const profile = await buildSupabaseUser(data.user);
        setUser(profile);
      }

      return { success: true, role };
    }

    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { success: false, error: "Email already registered" };
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: hashPassword(password),
      role,
      avatarColor: randomColor(),
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    setCurrentUserId(newUser.id);
    return { success: true, role };
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      return;
    }
    setCurrentUserId(null);
  };

  const forgotPassword = async (email: string) => {
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return error ? { success: false, error: error.message } : { success: true };
    }

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: "Email not found" };
    return { success: true };
  };

  const resetPassword = async (email: string, newPassword: string) => {
    if (supabase) {
      await supabase.auth.updateUser({ password: newPassword });
      return { success: true };
    }

    const updated = users.map((u) =>
      u.email.toLowerCase() === email.toLowerCase()
        ? { ...u, password: hashPassword(newPassword) }
        : u
    );
    setUsers(updated);
    return { success: true };
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    if (supabase) {
      if (updates.email && updates.email !== user.email) {
        await supabase.auth.updateUser({ email: updates.email });
      }
      await supabase
        .from("profiles")
        .update({
          name: updates.name ?? user.name,
          email: updates.email ?? user.email,
          avatar_color: updates.avatarColor ?? user.avatarColor,
        })
        .eq("id", user.id);
      setUser({ ...user, ...updates });
      return;
    }

    const updated = users.map((u) => (u.id === user.id ? { ...u, ...updates } : u));
    setUsers(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}