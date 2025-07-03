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
      activity_logs: {
        Row: {
          action: string
          action_type: string
          client_id: string
          details: string | null
          id: string
          ip_address: string
          module: string
          timestamp: string
          user_role: string
          username: string
        }
        Insert: {
          action: string
          action_type: string
          client_id: string
          details?: string | null
          id?: string
          ip_address: string
          module: string
          timestamp: string
          user_role: string
          username: string
        }
        Update: {
          action?: string
          action_type?: string
          client_id?: string
          details?: string | null
          id?: string
          ip_address?: string
          module?: string
          timestamp?: string
          user_role?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          age: number | null
          booked_at: string | null
          client_id: string
          date: string
          doctor_id: number
          doctor_name: string
          id: string
          notes: string | null
          patient_id: string | null
          patient_name: string
          patient_phone: string
          phone: string | null
          status: string
          time: string
          type: string
        }
        Insert: {
          age?: number | null
          booked_at?: string | null
          client_id: string
          date: string
          doctor_id: number
          doctor_name: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          patient_name: string
          patient_phone: string
          phone?: string | null
          status: string
          time: string
          type: string
        }
        Update: {
          age?: number | null
          booked_at?: string | null
          client_id?: string
          date?: string
          doctor_id?: number
          doctor_name?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          patient_name?: string
          patient_phone?: string
          phone?: string | null
          status?: string
          time?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          approved_by: string | null
          check_in: string | null
          check_out: string | null
          client_id: string
          date: string
          id: string
          leave_type: string | null
          notes: string | null
          staff_id: string
          status: string
        }
        Insert: {
          approved_by?: string | null
          check_in?: string | null
          check_out?: string | null
          client_id: string
          date: string
          id?: string
          leave_type?: string | null
          notes?: string | null
          staff_id: string
          status: string
        }
        Update: {
          approved_by?: string | null
          check_in?: string | null
          check_out?: string | null
          client_id?: string
          date?: string
          id?: string
          leave_type?: string | null
          notes?: string | null
          staff_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_branches: {
        Row: {
          address: string | null
          client_id: string
          created_at: string
          id: string
          is_main: boolean | null
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          client_id: string
          created_at?: string
          id?: string
          is_main?: boolean | null
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          client_id?: string
          created_at?: string
          id?: string
          is_main?: boolean | null
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_branches_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active_users: number | null
          api_usage: number | null
          billing_cycle: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          expires_at: string
          id: string
          last_login: string | null
          logo: string | null
          max_storage_mb: number | null
          max_users: number | null
          modules: Json
          modules_enabled: string[] | null
          name: string
          plan: string
          plan_end: string | null
          plan_start: string | null
          role_permissions: Json | null
          status: string
          subdomain: string
        }
        Insert: {
          active_users?: number | null
          api_usage?: number | null
          billing_cycle?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          expires_at: string
          id?: string
          last_login?: string | null
          logo?: string | null
          max_storage_mb?: number | null
          max_users?: number | null
          modules?: Json
          modules_enabled?: string[] | null
          name: string
          plan: string
          plan_end?: string | null
          plan_start?: string | null
          role_permissions?: Json | null
          status: string
          subdomain: string
        }
        Update: {
          active_users?: number | null
          api_usage?: number | null
          billing_cycle?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          last_login?: string | null
          logo?: string | null
          max_storage_mb?: number | null
          max_users?: number | null
          modules?: Json
          modules_enabled?: string[] | null
          name?: string
          plan?: string
          plan_end?: string | null
          plan_start?: string | null
          role_permissions?: Json | null
          status?: string
          subdomain?: string
        }
        Relationships: []
      }
      consent_forms: {
        Row: {
          client_id: string
          file_name: string
          file_type: string
          id: string
          patient_id: string
          patient_name: string
          signature: string | null
          uploaded_at: string
        }
        Insert: {
          client_id: string
          file_name: string
          file_type: string
          id?: string
          patient_id: string
          patient_name: string
          signature?: string | null
          uploaded_at: string
        }
        Update: {
          client_id?: string
          file_name?: string
          file_type?: string
          id?: string
          patient_id?: string
          patient_name?: string
          signature?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_forms_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      converted_leads: {
        Row: {
          assigned_doctor: string | null
          billing_value: number | null
          client_id: string
          converted_at: string
          converted_by: string
          email: string | null
          full_name: string
          id: string
          lead_id: string
          mobile: string
          patient_id: string
          source: string
        }
        Insert: {
          assigned_doctor?: string | null
          billing_value?: number | null
          client_id: string
          converted_at: string
          converted_by: string
          email?: string | null
          full_name: string
          id?: string
          lead_id: string
          mobile: string
          patient_id: string
          source: string
        }
        Update: {
          assigned_doctor?: string | null
          billing_value?: number | null
          client_id?: string
          converted_at?: string
          converted_by?: string
          email?: string | null
          full_name?: string
          id?: string
          lead_id?: string
          mobile?: string
          patient_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "converted_leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_logs: {
        Row: {
          client_id: string
          created_at: string
          id: string
          new_stock: number
          notes: string | null
          patient_name: string | null
          performed_by: string
          previous_stock: number
          product_id: string
          product_name: string
          quantity: number
          reason: string
          treatment_id: string | null
          type: string
        }
        Insert: {
          client_id: string
          created_at: string
          id?: string
          new_stock: number
          notes?: string | null
          patient_name?: string | null
          performed_by: string
          previous_stock: number
          product_id: string
          product_name: string
          quantity: number
          reason: string
          treatment_id?: string | null
          type: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          new_stock?: number
          notes?: string | null
          patient_name?: string | null
          performed_by?: string
          previous_stock?: number
          product_id?: string
          product_name?: string
          quantity?: number
          reason?: string
          treatment_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance_amount: number
          client_id: string
          created_at: string
          discount_amount: number
          discount_rate: number
          doctor_id: string
          doctor_name: string
          due_date: string
          id: string
          invoice_number: string
          notes: string | null
          paid_amount: number
          paid_at: string | null
          patient_id: string
          patient_name: string
          patient_phone: string
          payment_mode: string
          procedures: Json
          refund_amount: number | null
          refund_reason: string | null
          refunded_at: string | null
          session_id: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          balance_amount: number
          client_id: string
          created_at: string
          discount_amount: number
          discount_rate: number
          doctor_id: string
          doctor_name: string
          due_date: string
          id: string
          invoice_number: string
          notes?: string | null
          paid_amount: number
          paid_at?: string | null
          patient_id: string
          patient_name: string
          patient_phone: string
          payment_mode: string
          procedures: Json
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          session_id?: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total_amount: number
          updated_at: string
        }
        Update: {
          balance_amount?: number
          client_id?: string
          created_at?: string
          discount_amount?: number
          discount_rate?: number
          doctor_id?: string
          doctor_name?: string
          due_date?: string
          id?: string
          invoice_number?: string
          notes?: string | null
          paid_amount?: number
          paid_at?: string | null
          patient_id?: string
          patient_name?: string
          patient_phone?: string
          payment_mode?: string
          procedures?: Json
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          session_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string
          assigned_to_id: number
          client_id: string
          converted_at: string | null
          created_at: string
          drop_reason: string | null
          email: string | null
          full_name: string
          id: string
          mobile: string
          notes: string | null
          notes_history: Json
          source: string
          status: string
          status_history: Json
          updated_at: string
        }
        Insert: {
          assigned_to: string
          assigned_to_id: number
          client_id: string
          converted_at?: string | null
          created_at: string
          drop_reason?: string | null
          email?: string | null
          full_name: string
          id: string
          mobile: string
          notes?: string | null
          notes_history: Json
          source: string
          status: string
          status_history: Json
          updated_at: string
        }
        Update: {
          assigned_to?: string
          assigned_to_id?: number
          client_id?: string
          converted_at?: string | null
          created_at?: string
          drop_reason?: string | null
          email?: string | null
          full_name?: string
          id?: string
          mobile?: string
          notes?: string | null
          notes_history?: Json
          source?: string
          status?: string
          status_history?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          annual: number
          casual: number
          client_id: string
          compensatory: number
          id: string
          sick: number
          staff_id: string
          unpaid: number
        }
        Insert: {
          annual: number
          casual: number
          client_id: string
          compensatory: number
          id?: string
          sick: number
          staff_id: string
          unpaid: number
        }
        Update: {
          annual?: number
          casual?: number
          client_id?: string
          compensatory?: number
          id?: string
          sick?: number
          staff_id?: string
          unpaid?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      login_audit: {
        Row: {
          auth_user_id: string | null
          email: string | null
          id: string
          ip_address: string | null
          login_time: string | null
          user_agent: string | null
        }
        Insert: {
          auth_user_id?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          login_time?: string | null
          user_agent?: string | null
        }
        Update: {
          auth_user_id?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          login_time?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          client_id: string | null
          created_at: string | null
          for_roles: string[] | null
          id: string
          message: string | null
          read_by: string[] | null
          title: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          for_roles?: string[] | null
          id?: string
          message?: string | null
          read_by?: string[] | null
          title?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          for_roles?: string[] | null
          id?: string
          message?: string | null
          read_by?: string[] | null
          title?: string | null
        }
        Relationships: []
      }
      patient_photos: {
        Row: {
          client_id: string
          doctor_id: string
          doctor_name: string
          id: string
          image_url: string
          notes: string | null
          patient_id: string
          patient_name: string
          session_date: string
          session_id: string
          thumbnail_url: string
          type: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          client_id: string
          doctor_id: string
          doctor_name: string
          id?: string
          image_url: string
          notes?: string | null
          patient_id: string
          patient_name: string
          session_date: string
          session_id: string
          thumbnail_url: string
          type: string
          uploaded_at: string
          uploaded_by: string
        }
        Update: {
          client_id?: string
          doctor_id?: string
          doctor_name?: string
          id?: string
          image_url?: string
          notes?: string | null
          patient_id?: string
          patient_name?: string
          session_date?: string
          session_id?: string
          thumbnail_url?: string
          type?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_photos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          appointment_type: string
          client_id: string
          clinic_branch: string | null
          date_of_birth: string
          email: string | null
          full_name: string
          gender: string
          id: string
          mobile: string
          referred_by: string
          registered_at: string
        }
        Insert: {
          appointment_type: string
          client_id: string
          clinic_branch?: string | null
          date_of_birth: string
          email?: string | null
          full_name: string
          gender: string
          id: string
          mobile: string
          referred_by: string
          registered_at?: string
        }
        Update: {
          appointment_type?: string
          client_id?: string
          clinic_branch?: string | null
          date_of_birth?: string
          email?: string | null
          full_name?: string
          gender?: string
          id?: string
          mobile?: string
          referred_by?: string
          registered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          id: string
          invoice_id: string
          notes: string | null
          paid_at: string
          payment_mode: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          client_id: string
          id?: string
          invoice_id: string
          notes?: string | null
          paid_at: string
          payment_mode: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          paid_at?: string
          payment_mode?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          bank_account: string | null
          basic: number
          bonus: number | null
          client_id: string
          conveyance: number
          days_worked: number
          employee_id: string
          gross_salary: number
          hra: number
          id: string
          leaves_taken: number
          medical: number
          month: number
          net_salary: number
          notes: string | null
          other_deductions: number | null
          pan_number: string | null
          payment_date: string
          payment_mode: string
          payment_status: string
          pf: number
          pf_number: string | null
          special: number
          staff_id: string
          staff_name: string
          tax: number
          total_deductions: number
          uan: string | null
          year: number
        }
        Insert: {
          bank_account?: string | null
          basic: number
          bonus?: number | null
          client_id: string
          conveyance: number
          days_worked: number
          employee_id: string
          gross_salary: number
          hra: number
          id?: string
          leaves_taken: number
          medical: number
          month: number
          net_salary: number
          notes?: string | null
          other_deductions?: number | null
          pan_number?: string | null
          payment_date: string
          payment_mode: string
          payment_status: string
          pf: number
          pf_number?: string | null
          special: number
          staff_id: string
          staff_name: string
          tax: number
          total_deductions: number
          uan?: string | null
          year: number
        }
        Update: {
          bank_account?: string | null
          basic?: number
          bonus?: number | null
          client_id?: string
          conveyance?: number
          days_worked?: number
          employee_id?: string
          gross_salary?: number
          hra?: number
          id?: string
          leaves_taken?: number
          medical?: number
          month?: number
          net_salary?: number
          notes?: string | null
          other_deductions?: number | null
          pan_number?: string | null
          payment_date?: string
          payment_mode?: string
          payment_status?: string
          pf?: number
          pf_number?: string | null
          special?: number
          staff_id?: string
          staff_name?: string
          tax?: number
          total_deductions?: number
          uan?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payslips_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_notes: {
        Row: {
          added_by: string
          client_id: string
          date: string
          description: string
          id: string
          rating: number | null
          staff_id: string
          title: string
          type: string
        }
        Insert: {
          added_by: string
          client_id: string
          date: string
          description: string
          id?: string
          rating?: number | null
          staff_id: string
          title: string
          type: string
        }
        Update: {
          added_by?: string
          client_id?: string
          date?: string
          description?: string
          id?: string
          rating?: number | null
          staff_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_sessions: {
        Row: {
          after_count: number
          before_count: number
          client_id: string
          date: string
          doctor_id: string
          doctor_name: string
          id: string
          in_progress_count: number
          patient_id: string
          patient_name: string
          procedure: string
        }
        Insert: {
          after_count?: number
          before_count?: number
          client_id: string
          date: string
          doctor_id: string
          doctor_name: string
          id: string
          in_progress_count?: number
          patient_id: string
          patient_name: string
          procedure: string
        }
        Update: {
          after_count?: number
          before_count?: number
          client_id?: string
          date?: string
          doctor_id?: string
          doctor_name?: string
          id?: string
          in_progress_count?: number
          patient_id?: string
          patient_name?: string
          procedure?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures: {
        Row: {
          actual_duration: number | null
          assigned_at: string
          assigned_by: string
          assigned_by_id: number
          client_id: string
          completion_notes: string | null
          date: string
          duration: number
          end_time: string | null
          id: string
          notes: string | null
          patient_age: number
          patient_id: string
          patient_name: string
          patient_phone: string
          procedure: string
          scheduled_time: string
          start_time: string | null
          status: string
        }
        Insert: {
          actual_duration?: number | null
          assigned_at: string
          assigned_by: string
          assigned_by_id: number
          client_id: string
          completion_notes?: string | null
          date: string
          duration: number
          end_time?: string | null
          id?: string
          notes?: string | null
          patient_age: number
          patient_id: string
          patient_name: string
          patient_phone: string
          procedure: string
          scheduled_time: string
          start_time?: string | null
          status: string
        }
        Update: {
          actual_duration?: number | null
          assigned_at?: string
          assigned_by?: string
          assigned_by_id?: number
          client_id?: string
          completion_notes?: string | null
          date?: string
          duration?: number
          end_time?: string | null
          id?: string
          notes?: string | null
          patient_age?: number
          patient_id?: string
          patient_name?: string
          patient_phone?: string
          procedure?: string
          scheduled_time?: string
          start_time?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          auto_deduct_enabled: boolean
          batch_number: string
          category: string
          client_id: string
          cost_price: number
          created_at: string
          current_stock: number
          description: string | null
          expiry_date: string | null
          id: string
          is_active: boolean
          last_used: string | null
          location: string
          manufacturing_date: string | null
          max_stock_level: number
          min_stock_level: number
          name: string
          selling_price: number | null
          treatment_types: string[]
          unit: string
          updated_at: string
          vendor: string
        }
        Insert: {
          auto_deduct_enabled?: boolean
          batch_number: string
          category: string
          client_id: string
          cost_price: number
          created_at: string
          current_stock: number
          description?: string | null
          expiry_date?: string | null
          id: string
          is_active?: boolean
          last_used?: string | null
          location: string
          manufacturing_date?: string | null
          max_stock_level: number
          min_stock_level: number
          name: string
          selling_price?: number | null
          treatment_types: string[]
          unit: string
          updated_at: string
          vendor: string
        }
        Update: {
          auto_deduct_enabled?: boolean
          batch_number?: string
          category?: string
          client_id?: string
          cost_price?: number
          created_at?: string
          current_stock?: number
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          last_used?: string | null
          location?: string
          manufacturing_date?: string | null
          max_stock_level?: number
          min_stock_level?: number
          name?: string
          selling_price?: number | null
          treatment_types?: string[]
          unit?: string
          updated_at?: string
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      queue: {
        Row: {
          appointment_time: string | null
          checked_in_at: string
          client_id: string
          doctor_name: string | null
          id: string
          patient_name: string
          patient_phone: string
          queue_number: number
          status: string
        }
        Insert: {
          appointment_time?: string | null
          checked_in_at: string
          client_id: string
          doctor_name?: string | null
          id?: string
          patient_name: string
          patient_phone: string
          queue_number: number
          status: string
        }
        Update: {
          appointment_time?: string | null
          checked_in_at?: string
          client_id?: string
          doctor_name?: string | null
          id?: string
          patient_name?: string
          patient_phone?: string
          queue_number?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_structures: {
        Row: {
          bank_account: string | null
          basic: number
          bonus: number | null
          client_id: string
          conveyance: number
          currency: string
          effective_from: string
          hra: number
          id: string
          medical: number
          other_deductions: number | null
          pan_number: string | null
          payment_frequency: string
          pf: number
          pf_number: string | null
          special: number
          staff_id: string
          tax: number
          uan: string | null
        }
        Insert: {
          bank_account?: string | null
          basic: number
          bonus?: number | null
          client_id: string
          conveyance: number
          currency: string
          effective_from: string
          hra: number
          id?: string
          medical: number
          other_deductions?: number | null
          pan_number?: string | null
          payment_frequency: string
          pf: number
          pf_number?: string | null
          special: number
          staff_id: string
          tax: number
          uan?: string | null
        }
        Update: {
          bank_account?: string | null
          basic?: number
          bonus?: number | null
          client_id?: string
          conveyance?: number
          currency?: string
          effective_from?: string
          hra?: number
          id?: string
          medical?: number
          other_deductions?: number | null
          pan_number?: string | null
          payment_frequency?: string
          pf?: number
          pf_number?: string | null
          special?: number
          staff_id?: string
          tax?: number
          uan?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_structures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      session_history: {
        Row: {
          assigned_by: string
          client_id: string
          date: string
          duration: number
          end_time: string
          id: string
          notes: string
          patient_id: string
          patient_name: string
          procedure: string
          start_time: string
          status: string
        }
        Insert: {
          assigned_by: string
          client_id: string
          date: string
          duration: number
          end_time: string
          id?: string
          notes: string
          patient_id: string
          patient_name: string
          procedure: string
          start_time: string
          status: string
        }
        Update: {
          assigned_by?: string
          client_id?: string
          date?: string
          duration?: number
          end_time?: string
          id?: string
          notes?: string
          patient_id?: string
          patient_name?: string
          procedure?: string
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          client_id: string
          date: string
          end_time: string
          id: string
          notes: string | null
          shift_code: string
          staff_id: string
          start_time: string
          status: string
        }
        Insert: {
          client_id: string
          date: string
          end_time: string
          id?: string
          notes?: string | null
          shift_code: string
          staff_id: string
          start_time: string
          status: string
        }
        Update: {
          client_id?: string
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          shift_code?: string
          staff_id?: string
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      soap_notes: {
        Row: {
          assessment: string
          client_id: string
          created_at: string
          doctor_id: string
          doctor_name: string
          id: string
          objective: string
          patient_id: string
          patient_name: string
          plan: string
          status: string
          subjective: string
          vitals: Json | null
        }
        Insert: {
          assessment: string
          client_id: string
          created_at: string
          doctor_id: string
          doctor_name: string
          id?: string
          objective: string
          patient_id: string
          patient_name: string
          plan: string
          status: string
          subjective: string
          vitals?: Json | null
        }
        Update: {
          assessment?: string
          client_id?: string
          created_at?: string
          doctor_id?: string
          doctor_name?: string
          id?: string
          objective?: string
          patient_id?: string
          patient_name?: string
          plan?: string
          status?: string
          subjective?: string
          vitals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "soap_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          avatar: string | null
          branch: string
          client_id: string
          department: string
          email: string
          employment_details: Json | null
          id: string
          join_date: string
          name: string
          personal_details: Json | null
          phone: string
          role: string
          status: string
        }
        Insert: {
          avatar?: string | null
          branch: string
          client_id: string
          department: string
          email: string
          employment_details?: Json | null
          id: string
          join_date: string
          name: string
          personal_details?: Json | null
          phone: string
          role: string
          status: string
        }
        Update: {
          avatar?: string | null
          branch?: string
          client_id?: string
          department?: string
          email?: string
          employment_details?: Json | null
          id?: string
          join_date?: string
          name?: string
          personal_details?: Json | null
          phone?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_documents: {
        Row: {
          client_id: string
          expiry_date: string | null
          file_name: string
          file_type: string
          id: string
          name: string
          notes: string | null
          staff_id: string
          type: string
          uploaded_at: string
        }
        Insert: {
          client_id: string
          expiry_date?: string | null
          file_name: string
          file_type: string
          id?: string
          name: string
          notes?: string | null
          staff_id: string
          type: string
          uploaded_at: string
        }
        Update: {
          client_id?: string
          expiry_date?: string | null
          file_name?: string
          file_type?: string
          id?: string
          name?: string
          notes?: string | null
          staff_id?: string
          type?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_files: {
        Row: {
          bucket: string | null
          client_id: string | null
          file_name: string | null
          id: string
          module: string | null
          path: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          bucket?: string | null
          client_id?: string | null
          file_name?: string | null
          id?: string
          module?: string | null
          path?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          bucket?: string | null
          client_id?: string | null
          file_name?: string | null
          id?: string
          module?: string | null
          path?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          client_id: string
          client_name: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          client_name: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          client_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          action: string
          client_id: string | null
          client_name: string | null
          details: string
          id: string
          ip_address: string
          timestamp: string
          type: string
        }
        Insert: {
          action: string
          client_id?: string | null
          client_name?: string | null
          details: string
          id: string
          ip_address: string
          timestamp: string
          type: string
        }
        Update: {
          action?: string
          client_id?: string | null
          client_name?: string | null
          details?: string
          id?: string
          ip_address?: string
          timestamp?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_assignments: {
        Row: {
          assigned_at: string
          client_id: string
          id: string
          notes: string | null
          patient_id: string
          procedure: string
          status: string
          technician_id: string
        }
        Insert: {
          assigned_at: string
          client_id: string
          id?: string
          notes?: string | null
          patient_id: string
          procedure: string
          status: string
          technician_id: string
        }
        Update: {
          assigned_at?: string
          client_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          procedure?: string
          status?: string
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          id: string
          message: string
          sender: string
          sender_name: string
          ticket_id: string
          timestamp: string
        }
        Insert: {
          id?: string
          message: string
          sender: string
          sender_name: string
          ticket_id: string
          timestamp: string
        }
        Update: {
          id?: string
          message?: string
          sender?: string
          sender_name?: string
          ticket_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      treatment_records: {
        Row: {
          client_id: string
          date: string
          id: string
          notes: string
          patient_id: string
          patient_name: string
          performed_by: string
          performed_by_id: string | null
          procedure: string
          status: string
        }
        Insert: {
          client_id: string
          date: string
          id?: string
          notes: string
          patient_id: string
          patient_name: string
          performed_by: string
          performed_by_id?: string | null
          procedure: string
          status: string
        }
        Update: {
          client_id?: string
          date?: string
          id?: string
          notes?: string
          patient_id?: string
          patient_name?: string
          performed_by?: string
          performed_by_id?: string | null
          procedure?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          client_id: string
          client_name: string
          endpoint: string
          id: string
          ip_address: string
          method: string
          response_time: number
          status_code: number
          timestamp: string
          user_agent: string
        }
        Insert: {
          client_id: string
          client_name: string
          endpoint: string
          id: string
          ip_address: string
          method: string
          response_time: number
          status_code: number
          timestamp: string
          user_agent: string
        }
        Update: {
          client_id?: string
          client_name?: string
          endpoint?: string
          id?: string
          ip_address?: string
          method?: string
          response_time?: number
          status_code?: number
          timestamp?: string
          user_agent?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          auth_user_id: string
          client_id: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          name: string
          role: string
        }
        Insert: {
          auth_user_id: string
          client_id?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          role: string
        }
        Update: {
          auth_user_id?: string
          client_id?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
