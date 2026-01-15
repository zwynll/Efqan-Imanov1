import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:4000/api";

type UserRole = string; // Local API üçün sadə string saxlanır

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  canEdit: boolean;
  canViewAllCourses: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Token varsa, profili local backend-dən yüklə
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.id) {
            setUser({
              id: data.id.toString(),
              email: data.email,
              name: data.full_name,
              role: "MAIN_ADMIN_FULL", // müvəqqəti, backend-ə uyğun gələndə düzəldək
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const [profileResult, rolesResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.from('user_roles').select('*').eq('user_id', userId)
      ]);

      if (profileResult.error) throw profileResult.error;
      if (rolesResult.error) throw rolesResult.error;

      const roles = rolesResult.data || [];
      const primaryRole = roles[0]?.role as UserRole;
      const courseId = roles.find(r => r.course_id)?.course_id;

      setUser({
        id: userId,
        email: profileResult.data.user_id,
        name: profileResult.data.full_name,
        role: primaryRole,
        course: courseId,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Giriş zamanı xəta baş verdi");
      localStorage.setItem("token", data.token);
      setUser({
        id: data.user.id.toString(),
        email: data.user.email,
        name: data.user.fullName,
        role: "MAIN_ADMIN_FULL", // Müvəqqəti
      });
      toast({
        title: "Uğurlu giriş",
        description: "Xoş gəlmisiniz",
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Giriş zamanı xəta baş verdi",
      });
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Qeydiyyat zamanı xəta baş verdi");
      toast({
        title: "Uğurlu qeydiyyat",
        description: "Hesabınız yaradıldı",
      });
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Qeydiyyat zamanı xəta baş verdi",
      });
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    toast({
      title: "Çıxış edildi",
      description: "Sistemdən uğurla çıxdınız",
    });
  };

  const canEdit = user?.role !== "MAIN_ADMIN_READ";
  const canViewAllCourses = user?.role === "MAIN_ADMIN_READ" || user?.role === "MAIN_ADMIN_FULL";

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, canEdit, canViewAllCourses }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
