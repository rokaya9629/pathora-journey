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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          description: string
          icon: string
          id: string
          title: string
          xp_reward: number
        }
        Insert: {
          code: string
          description?: string
          icon?: string
          id?: string
          title: string
          xp_reward?: number
        }
        Update: {
          code?: string
          description?: string
          icon?: string
          id?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      career_skills: {
        Row: {
          career_id: string
          id: string
          importance: number
          skill: string
        }
        Insert: {
          career_id: string
          id?: string
          importance?: number
          skill: string
        }
        Update: {
          career_id?: string
          id?: string
          importance?: number
          skill?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_skills_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      careers: {
        Row: {
          avg_salary: string | null
          category: string
          created_at: string
          demand_score: number
          description: string
          id: string
          market_demand: string
          slug: string
          tags: string[]
          title: string
        }
        Insert: {
          avg_salary?: string | null
          category?: string
          created_at?: string
          demand_score?: number
          description?: string
          id?: string
          market_demand?: string
          slug: string
          tags?: string[]
          title: string
        }
        Update: {
          avg_salary?: string | null
          category?: string
          created_at?: string
          demand_score?: number
          description?: string
          id?: string
          market_demand?: string
          slug?: string
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          id: string
          issue_date: string | null
          issuer: string
          title: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_date?: string | null
          issuer?: string
          title: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_date?: string | null
          issuer?: string
          title?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          career_id: string | null
          compensation: string | null
          created_at: string
          deadline: string | null
          description: string
          difficulty: string
          id: string
          is_remote: boolean
          location: string
          organization: string | null
          required_skills: string[]
          tags: string[]
          title: string
          type: string
          url: string
        }
        Insert: {
          career_id?: string | null
          compensation?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          difficulty?: string
          id?: string
          is_remote?: boolean
          location?: string
          organization?: string | null
          required_skills?: string[]
          tags?: string[]
          title: string
          type?: string
          url: string
        }
        Update: {
          career_id?: string | null
          compensation?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          difficulty?: string
          id?: string
          is_remote?: boolean
          location?: string
          organization?: string | null
          required_skills?: string[]
          tags?: string[]
          title?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          career_goal_id: string | null
          created_at: string
          current_skills: string[]
          dream_career: string | null
          education_level: string | null
          full_name: string
          headline: string | null
          id: string
          interests: string[]
          major: string | null
          onboarding_complete: boolean
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          career_goal_id?: string | null
          created_at?: string
          current_skills?: string[]
          dream_career?: string | null
          education_level?: string | null
          full_name?: string
          headline?: string | null
          id: string
          interests?: string[]
          major?: string | null
          onboarding_complete?: boolean
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          career_goal_id?: string | null
          created_at?: string
          current_skills?: string[]
          dream_career?: string | null
          education_level?: string | null
          full_name?: string
          headline?: string | null
          id?: string
          interests?: string[]
          major?: string | null
          onboarding_complete?: boolean
          updated_at?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_career_goal_id_fkey"
            columns: ["career_goal_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string
          github_url: string | null
          id: string
          image_url: string | null
          name: string
          technologies: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          name: string
          technologies?: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          name?: string
          technologies?: string[]
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty: string
          id: string
          title: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          title: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      roadmap_steps: {
        Row: {
          description: string
          est_weeks: number
          id: string
          position: number
          roadmap_id: string
          title: string
        }
        Insert: {
          description?: string
          est_weeks?: number
          id?: string
          position?: number
          roadmap_id: string
          title: string
        }
        Update: {
          description?: string
          est_weeks?: number
          id?: string
          position?: number
          roadmap_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_steps_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          career_id: string
          created_at: string
          description: string
          id: string
          title: string
        }
        Insert: {
          career_id: string
          created_at?: string
          description?: string
          id?: string
          title: string
        }
        Update: {
          career_id?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_opportunities: {
        Row: {
          created_at: string
          id: string
          note: string | null
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roadmap_progress: {
        Row: {
          completed_at: string
          id: string
          step_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          step_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          step_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roadmap_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "roadmap_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
