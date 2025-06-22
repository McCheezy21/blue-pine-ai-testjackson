export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      automation_logs: {
        Row: {
          automation_notes: string
          automation_type: string
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          facility_name: string
          id: string
          patient_id: string
          patient_name: string
          provider_name: string
          service_date: string
          status: string
          time_saved_minutes: number
          user_id: string | null
        }
        Insert: {
          automation_notes: string
          automation_type: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          facility_name: string
          id?: string
          patient_id: string
          patient_name: string
          provider_name: string
          service_date: string
          status?: string
          time_saved_minutes?: number
          user_id?: string | null
        }
        Update: {
          automation_notes?: string
          automation_type?: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          facility_name?: string
          id?: string
          patient_id?: string
          patient_name?: string
          provider_name?: string
          service_date?: string
          status?: string
          time_saved_minutes?: number
          user_id?: string | null
        }
        Relationships: []
      }
      Waitlist: {
        Row: {
          additional_info: string | null
          bed_count: number | null
          created_at: string
          email: string
          facility_name: string | null
          full_name: string | null
          id: number
        }
        Insert: {
          additional_info?: string | null
          bed_count?: number | null
          created_at?: string
          email: string
          facility_name?: string | null
          full_name?: string | null
          id?: number
        }
        Update: {
          additional_info?: string | null
          bed_count?: number | null
          created_at?: string
          email?: string
          facility_name?: string | null
          full_name?: string | null
          id?: number
        }
        Relationships: []
      }
      weekly_metrics: {
        Row: {
          automations_run: number | null
          cards_processed: number | null
          claims_processed: number | null
          created_at: string | null
          id: string
          time_saved_minutes: number | null
          updated_at: string | null
          user_id: string | null
          week_start: string
        }
        Insert: {
          automations_run?: number | null
          cards_processed?: number | null
          claims_processed?: number | null
          created_at?: string | null
          id?: string
          time_saved_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
          week_start: string
        }
        Update: {
          automations_run?: number | null
          cards_processed?: number | null
          claims_processed?: number | null
          created_at?: string | null
          id?: string
          time_saved_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_waitlist_status: {
        Args: { user_id: string }
        Returns: {
          profile_id: string
          email: string
          was_on_waitlist: boolean
          waitlist_joined_at: string
        }[]
      }
      get_week_start: {
        Args: { input_date?: string }
        Returns: string
      }
      has_role: {
        Args: { role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      update_system_setting: {
        Args: {
          setting_key: Database["public"]["Enums"]["system_setting_key"]
          new_value: boolean
        }
        Returns: boolean
      }
      update_weekly_metrics: {
        Args: {
          p_user_id: string
          p_automations_increment?: number
          p_cards_increment?: number
          p_claims_increment?: number
          p_time_saved_increment?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      system_setting_key: "require_referral_code"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      system_setting_key: ["require_referral_code"],
    },
  },
} as const
