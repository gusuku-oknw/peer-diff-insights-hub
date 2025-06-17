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
      ai_reports: {
        Row: {
          branch_id: string | null
          generated_at: string
          id: string
          keywords: string[]
          project_id: string | null
          sentiment: Json | null
          summary_text: string
        }
        Insert: {
          branch_id?: string | null
          generated_at?: string
          id?: string
          keywords: string[]
          project_id?: string | null
          sentiment?: Json | null
          summary_text: string
        }
        Update: {
          branch_id?: string | null
          generated_at?: string
          id?: string
          keywords?: string[]
          project_id?: string | null
          sentiment?: Json | null
          summary_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_reports_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          parent_id: string | null
          project_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          parent_id?: string | null
          project_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branches_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branches_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          diff_id: string | null
          id: string
          position: Json | null
          slide_index: number
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          diff_id?: string | null
          id?: string
          position?: Json | null
          slide_index: number
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          diff_id?: string | null
          id?: string
          position?: Json | null
          slide_index?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_diff_id_fkey"
            columns: ["diff_id"]
            isOneToOne: false
            referencedRelation: "diffs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diffs: {
        Row: {
          base_branch_id: string | null
          branch_id: string | null
          diff_json: Json
          generated_at: string
          id: string
        }
        Insert: {
          base_branch_id?: string | null
          branch_id?: string | null
          diff_json: Json
          generated_at?: string
          id?: string
        }
        Update: {
          base_branch_id?: string | null
          branch_id?: string | null
          diff_json?: Json
          generated_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diffs_base_branch_id_fkey"
            columns: ["base_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diffs_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      html_versions: {
        Row: {
          author_id: string | null
          branch_name: string
          commit_message: string | null
          created_at: string | null
          html_content: string
          id: string
          is_merge: boolean | null
          parent_version_id: string | null
          resource_key: string
          version_number: number
          xml_version_id: string | null
        }
        Insert: {
          author_id?: string | null
          branch_name: string
          commit_message?: string | null
          created_at?: string | null
          html_content: string
          id: string
          is_merge?: boolean | null
          parent_version_id?: string | null
          resource_key: string
          version_number: number
          xml_version_id?: string | null
        }
        Update: {
          author_id?: string | null
          branch_name?: string
          commit_message?: string | null
          created_at?: string | null
          html_content?: string
          id?: string
          is_merge?: boolean | null
          parent_version_id?: string | null
          resource_key?: string
          version_number?: number
          xml_version_id?: string | null
        }
        Relationships: []
      }
      incentives: {
        Row: {
          approved_count: number
          comments_count: number
          id: string
          project_id: string | null
          reward_points: number
          student_id: string | null
        }
        Insert: {
          approved_count?: number
          comments_count?: number
          id?: string
          project_id?: string | null
          reward_points?: number
          student_id?: string | null
        }
        Update: {
          approved_count?: number
          comments_count?: number
          id?: string
          project_id?: string | null
          reward_points?: number
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incentives_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incentives_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          owner_id: string
          pptx_path: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          pptx_path?: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          pptx_path?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          enterprise_id: string | null
          expires_at: string
          id: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          quota_total: number
          quota_used: number
          started_at: string
        }
        Insert: {
          enterprise_id?: string | null
          expires_at: string
          id?: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          quota_total: number
          quota_used?: number
          started_at: string
        }
        Update: {
          enterprise_id?: string | null
          expires_at?: string
          id?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          quota_total?: number
          quota_used?: number
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      plan_type: "basic" | "standard" | "custom"
      project_status: "draft" | "reviewing" | "closed"
      user_role: "student" | "business" | "debugger"
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
      plan_type: ["basic", "standard", "custom"],
      project_status: ["draft", "reviewing", "closed"],
      user_role: ["student", "business", "debugger"],
    },
  },
} as const
