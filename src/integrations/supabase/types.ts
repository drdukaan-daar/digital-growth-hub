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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor: string | null
          created_at: string
          details: Json
          entity: string | null
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor?: string | null
          created_at?: string
          details?: Json
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor?: string | null
          created_at?: string
          details?: Json
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          challenge: string | null
          created_at: string
          id: string
          image_url: string | null
          industry: string | null
          is_demo_project: boolean
          is_published: boolean
          marketing: string | null
          results: string[]
          seo_description: string | null
          seo_title: string | null
          slug: string
          solution: string | null
          sort_order: number
          strategy: string | null
          title: string
          tracking: string | null
          updated_at: string
        }
        Insert: {
          challenge?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          industry?: string | null
          is_demo_project?: boolean
          is_published?: boolean
          marketing?: string | null
          results?: string[]
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          strategy?: string | null
          title: string
          tracking?: string | null
          updated_at?: string
        }
        Update: {
          challenge?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          industry?: string | null
          is_demo_project?: boolean
          is_published?: boolean
          marketing?: string | null
          results?: string[]
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          strategy?: string | null
          title?: string
          tracking?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          business_name: string
          business_type: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          renewal_date: string | null
          services: string[]
          start_date: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          business_name: string
          business_type?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          renewal_date?: string | null
          services?: string[]
          start_date?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          business_name?: string
          business_type?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          renewal_date?: string | null
          services?: string[]
          start_date?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          benefits: string[]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          name: string
          problems: string[]
          recommended_services: string[]
          seo_description: string | null
          seo_title: string | null
          slug: string
          solutions: string[]
          sort_order: number
          updated_at: string
        }
        Insert: {
          benefits?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          name: string
          problems?: string[]
          recommended_services?: string[]
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          solutions?: string[]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          benefits?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          name?: string
          problems?: string[]
          recommended_services?: string[]
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          solutions?: string[]
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          lead_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind?: string
          lead_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget: string | null
          business_name: string | null
          business_type: string | null
          created_at: string
          current_website: string | null
          email: string | null
          id: string
          message: string | null
          name: string
          phone: string
          services: string[]
          source: string
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          budget?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          current_website?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name: string
          phone: string
          services?: string[]
          source?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          budget?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          current_website?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          services?: string[]
          source?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          badge: string | null
          billing_type: string | null
          created_at: string
          cta_label: string
          description: string | null
          features: string[]
          id: string
          is_published: boolean
          name: string
          price_label: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          badge?: string | null
          billing_type?: string | null
          created_at?: string
          cta_label?: string
          description?: string | null
          features?: string[]
          id?: string
          is_published?: boolean
          name: string
          price_label?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          badge?: string | null
          billing_type?: string | null
          created_at?: string
          cta_label?: string
          description?: string | null
          features?: string[]
          id?: string
          is_published?: boolean
          name?: string
          price_label?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          benefits: string[]
          created_at: string
          cta_label: string | null
          featured: boolean
          headline: string | null
          icon: string | null
          id: string
          is_published: boolean
          long_description: string | null
          name: string
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          benefits?: string[]
          created_at?: string
          cta_label?: string | null
          featured?: boolean
          headline?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          long_description?: string | null
          name: string
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          benefits?: string[]
          created_at?: string
          cta_label?: string | null
          featured?: boolean
          headline?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          long_description?: string | null
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          business: string | null
          created_at: string
          id: string
          is_demo: boolean
          is_published: boolean
          name: string
          photo_url: string | null
          quote: string
          rating: number
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          business?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          is_published?: boolean
          name: string
          photo_url?: string | null
          quote: string
          rating?: number
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          business?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          is_published?: boolean
          name?: string
          photo_url?: string | null
          quote?: string
          rating?: number
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["super_admin"],
    },
  },
} as const
