export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      course_leadership: {
        Row: {
          bio: string | null
          course_id: number
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          photo_url: string | null
          position: string | null
          rank: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          course_id: number
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          rank?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          course_id?: number
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          rank?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_leadership_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_leadership_staff: {
        Row: {
          course_id: number
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          photo_url: string | null
          position: string | null
          rank: string | null
          updated_at: string | null
        }
        Insert: {
          course_id: number
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          rank?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: number
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          rank?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_leadership_staff_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          archived: boolean | null
          created_at: string | null
          end_year: number | null
          id: number
          is_active: boolean | null
          level: number | null
          name: string
          start_year: number | null
          team_count: number
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          end_year?: number | null
          id: number
          is_active?: boolean | null
          level?: number | null
          name: string
          start_year?: number | null
          team_count?: number
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          end_year?: number | null
          id?: number
          is_active?: boolean | null
          level?: number | null
          name?: string
          start_year?: number | null
          team_count?: number
        }
        Relationships: []
      }
      discipline_records: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          event: string
          id: string
          note: string | null
          score_change: number
          student_id: string
          year: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          event: string
          id?: string
          note?: string | null
          score_change?: number
          student_id: string
          year?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          event?: string
          id?: string
          note?: string | null
          score_change?: number
          student_id?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discipline_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          address: string | null
          birth_date: string | null
          birth_place: string | null
          created_at: string | null
          full_name: string
          id: string
          job: string | null
          phone_home: string | null
          phone_mobile: string | null
          relation: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          job?: string | null
          phone_home?: string | null
          phone_mobile?: string | null
          relation: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          job?: string | null
          phone_home?: string | null
          phone_mobile?: string | null
          relation?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          address: string | null
          awards: string | null
          birth_date: string
          birth_place: string | null
          course_id: number
          created_at: string | null
          current_address: string | null
          current_score: number | null
          email: string
          emergency_contact: string | null
          father_name: string
          first_name: string
          foreign_languages: string | null
          height: number | null
          id: string
          id_card_number: string | null
          last_name: string
          military_service: boolean | null
          origin_location: string | null
          phone: string
          phone_home: string | null
          photo_url: string | null
          position: string | null
          rank: string | null
          registered_address: string | null
          service_card_number: string | null
          service_start_year: number | null
          sports_achievements: string | null
          team_id: string
          updated_at: string | null
          weight: number | null
          work_number: string | null
        }
        Insert: {
          address?: string | null
          awards?: string | null
          birth_date: string
          birth_place?: string | null
          course_id: number
          created_at?: string | null
          current_address?: string | null
          current_score?: number | null
          email: string
          emergency_contact?: string | null
          father_name: string
          first_name: string
          foreign_languages?: string | null
          height?: number | null
          id?: string
          id_card_number?: string | null
          last_name: string
          military_service?: boolean | null
          origin_location?: string | null
          phone: string
          phone_home?: string | null
          photo_url?: string | null
          position?: string | null
          rank?: string | null
          registered_address?: string | null
          service_card_number?: string | null
          service_start_year?: number | null
          sports_achievements?: string | null
          team_id: string
          updated_at?: string | null
          weight?: number | null
          work_number?: string | null
        }
        Update: {
          address?: string | null
          awards?: string | null
          birth_date?: string
          birth_place?: string | null
          course_id?: number
          created_at?: string | null
          current_address?: string | null
          current_score?: number | null
          email?: string
          emergency_contact?: string | null
          father_name?: string
          first_name?: string
          foreign_languages?: string | null
          height?: number | null
          id?: string
          id_card_number?: string | null
          last_name?: string
          military_service?: boolean | null
          origin_location?: string | null
          phone?: string
          phone_home?: string | null
          photo_url?: string | null
          position?: string | null
          rank?: string | null
          registered_address?: string | null
          service_card_number?: string | null
          service_start_year?: number | null
          sports_achievements?: string | null
          team_id?: string
          updated_at?: string | null
          weight?: number | null
          work_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          commander: string
          commander_contact: string
          commander_rank: string | null
          course_id: number
          created_at: string | null
          id: string
          name: string
          sub_commander_1: string | null
          sub_commander_1_contact: string | null
          sub_commander_1_rank: string | null
          sub_commander_2: string | null
          sub_commander_2_contact: string | null
          sub_commander_2_rank: string | null
          sub_commander_3: string | null
          sub_commander_3_contact: string | null
          sub_commander_3_rank: string | null
          updated_at: string | null
        }
        Insert: {
          commander: string
          commander_contact: string
          commander_rank?: string | null
          course_id: number
          created_at?: string | null
          id: string
          name: string
          sub_commander_1?: string | null
          sub_commander_1_contact?: string | null
          sub_commander_1_rank?: string | null
          sub_commander_2?: string | null
          sub_commander_2_contact?: string | null
          sub_commander_2_rank?: string | null
          sub_commander_3?: string | null
          sub_commander_3_contact?: string | null
          sub_commander_3_rank?: string | null
          updated_at?: string | null
        }
        Update: {
          commander?: string
          commander_contact?: string
          commander_rank?: string | null
          course_id?: number
          created_at?: string | null
          id?: string
          name?: string
          sub_commander_1?: string | null
          sub_commander_1_contact?: string | null
          sub_commander_1_rank?: string | null
          sub_commander_2?: string | null
          sub_commander_2_contact?: string | null
          sub_commander_2_rank?: string | null
          sub_commander_3?: string | null
          sub_commander_3_contact?: string | null
          sub_commander_3_rank?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          course_id: number | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_edit: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_course_admin_for: {
        Args: { _course_id: number; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "COURSE_1_ADMIN"
        | "COURSE_2_ADMIN"
        | "COURSE_3_ADMIN"
        | "COURSE_4_ADMIN"
        | "MAIN_ADMIN_READ"
        | "MAIN_ADMIN_FULL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "COURSE_1_ADMIN",
        "COURSE_2_ADMIN",
        "COURSE_3_ADMIN",
        "COURSE_4_ADMIN",
        "MAIN_ADMIN_READ",
        "MAIN_ADMIN_FULL",
      ],
    },
  },
} as const
