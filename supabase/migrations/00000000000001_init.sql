-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create audits table with expanded fields
CREATE TABLE public.audits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'In Progress',
    overall_score INTEGER,
    ethical_framework TEXT,
    risks_and_challenges TEXT,
    mitigation_strategies TEXT,
    continuous_monitoring TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create audit_sections table
CREATE TABLE public.audit_sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Not Started',
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create audit_questions table
CREATE TABLE public.audit_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_id UUID NOT NULL REFERENCES public.audit_sections(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create staff_interviews table
CREATE TABLE public.staff_interviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
    staff_name TEXT NOT NULL,
    position TEXT NOT NULL,
    interview_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RACI matrix table
CREATE TABLE public.raci_matrix (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    responsibility TEXT NOT NULL,
    assignment_type TEXT NOT NULL, -- R, A, C, or I
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ethical_assessment_categories table
CREATE TABLE public.ethical_assessment_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL,
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ethical_assessment_responses table
CREATE TABLE public.ethical_assessment_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.ethical_assessment_categories(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    response INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raci_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethical_assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethical_assessment_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables
CREATE POLICY "Enable read access for own audits" ON public.audits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for own audits" ON public.audits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for own audits" ON public.audits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for own audits" ON public.audits
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for related tables based on audit ownership
CREATE POLICY "Access own audit data" ON public.ethical_assessment_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.audits
            WHERE audits.id = ethical_assessment_categories.audit_id
            AND audits.user_id = auth.uid()
        )
    );

CREATE POLICY "Access own audit data" ON public.ethical_assessment_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.ethical_assessment_categories
            JOIN public.audits ON audits.id = ethical_assessment_categories.audit_id
            WHERE ethical_assessment_categories.id = ethical_assessment_responses.category_id
            AND audits.user_id = auth.uid()
        )
    );

CREATE POLICY "Access own audit data" ON public.raci_matrix
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.audits
            WHERE audits.id = raci_matrix.audit_id
            AND audits.user_id = auth.uid()
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_audits_updated_at
    BEFORE UPDATE ON public.audits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_ethical_categories_updated_at
    BEFORE UPDATE ON public.ethical_assessment_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_ethical_responses_updated_at
    BEFORE UPDATE ON public.ethical_assessment_responses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_raci_updated_at
    BEFORE UPDATE ON public.raci_matrix
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 