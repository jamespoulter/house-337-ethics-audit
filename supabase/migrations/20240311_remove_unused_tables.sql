DO $$ 
BEGIN
    -- Drop policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polrelid = 'public.audit_questions'::regclass
        AND polname = 'Access own audit data'
    ) THEN
        DROP POLICY "Access own audit data" ON public.audit_questions;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policy 
        WHERE polrelid = 'public.audit_sections'::regclass
        AND polname = 'Access own audit data'
    ) THEN
        DROP POLICY "Access own audit data" ON public.audit_sections;
    END IF;

    -- Drop triggers if they exist
    IF EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgrelid = 'public.audit_questions'::regclass
        AND tgname = 'handle_audit_questions_updated_at'
    ) THEN
        DROP TRIGGER handle_audit_questions_updated_at ON public.audit_questions;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgrelid = 'public.audit_sections'::regclass
        AND tgname = 'handle_audit_sections_updated_at'
    ) THEN
        DROP TRIGGER handle_audit_sections_updated_at ON public.audit_sections;
    END IF;

    -- Drop tables if they exist
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_questions'
    ) THEN
        DROP TABLE public.audit_questions;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_sections'
    ) THEN
        DROP TABLE public.audit_sections;
    END IF;
END $$;