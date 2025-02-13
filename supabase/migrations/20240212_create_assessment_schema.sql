-- Drop existing tables if they exist (in reverse order of dependencies)
drop table if exists public.ethical_assessment_responses;
drop table if exists public.ethical_assessment_categories;
drop table if exists public.ethical_assessment_questions;

-- Enable RLS
alter table public.audits enable row level security;

-- Create the ethical assessment questions table first (no dependencies)
create table if not exists public.ethical_assessment_questions (
    id text primary key, -- Using the question_id format like "transparency-1"
    category_name text not null,
    question_text text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the ethical assessment categories table
create table if not exists public.ethical_assessment_categories (
    id uuid default gen_random_uuid() primary key,
    audit_id uuid references public.audits(id) on delete cascade,
    category_name text not null,
    score integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(audit_id, category_name)
);

-- Create the ethical assessment responses table last (has dependencies)
create table if not exists public.ethical_assessment_responses (
    id uuid default gen_random_uuid() primary key,
    audit_id uuid references public.audits(id) on delete cascade,
    category_name text not null,
    question_id text references public.ethical_assessment_questions(id) on delete cascade,
    response integer not null check (response >= 0 and response <= 5),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(audit_id, question_id)
);

-- Enable RLS on all tables
alter table public.ethical_assessment_categories enable row level security;
alter table public.ethical_assessment_questions enable row level security;
alter table public.ethical_assessment_responses enable row level security;

-- Create policies for ethical_assessment_categories
create policy "Users can view their own audit categories"
    on public.ethical_assessment_categories for select
    using (
        exists (
            select 1 from public.audits
            where audits.id = ethical_assessment_categories.audit_id
            and audits.user_id = auth.uid()
        )
    );

create policy "Users can insert their own audit categories"
    on public.ethical_assessment_categories for insert
    with check (
        exists (
            select 1 from public.audits
            where audits.id = audit_id
            and audits.user_id = auth.uid()
        )
    );

create policy "Users can update their own audit categories"
    on public.ethical_assessment_categories for update
    using (
        exists (
            select 1 from public.audits
            where audits.id = ethical_assessment_categories.audit_id
            and audits.user_id = auth.uid()
        )
    );

-- Create policies for ethical_assessment_questions
create policy "Anyone can view questions"
    on public.ethical_assessment_questions for select
    using (true);

-- Create policies for ethical_assessment_responses
create policy "Users can view their own responses"
    on public.ethical_assessment_responses for select
    using (
        exists (
            select 1 from public.audits
            where audits.id = ethical_assessment_responses.audit_id
            and audits.user_id = auth.uid()
        )
    );

create policy "Users can insert their own responses"
    on public.ethical_assessment_responses for insert
    with check (
        exists (
            select 1 from public.audits
            where audits.id = audit_id
            and audits.user_id = auth.uid()
        )
    );

create policy "Users can update their own responses"
    on public.ethical_assessment_responses for update
    using (
        exists (
            select 1 from public.audits
            where audits.id = ethical_assessment_responses.audit_id
            and audits.user_id = auth.uid()
        )
    );

-- Insert the predefined questions
insert into public.ethical_assessment_questions (id, category_name, question_text) values
    -- Transparency
    ('transparency-1', 'transparency', 'Does the system provide clear explanations of how it makes decisions?'),
    ('transparency-2', 'transparency', 'Are users informed about what data is collected and how it''s used?'),
    ('transparency-3', 'transparency', 'Is there clear communication about the AI system''s capabilities and limitations?'),
    ('transparency-4', 'transparency', 'Are algorithmic processes documented and explainable to users?'),
    
    -- Privacy
    ('privacy-1', 'privacy', 'Is data collection limited to stated purposes only?'),
    ('privacy-2', 'privacy', 'Are there robust measures to protect user data?'),
    ('privacy-3', 'privacy', 'Can users access, modify, or delete their personal data?'),
    ('privacy-4', 'privacy', 'Is data handling compliant with privacy regulations?'),
    
    -- Inclusivity
    ('inclusivity-1', 'inclusivity', 'Is the AI system tested across diverse user groups?'),
    ('inclusivity-2', 'inclusivity', 'Are accessibility features built into the system?'),
    ('inclusivity-3', 'inclusivity', 'Is there regular testing for bias against underrepresented groups?'),
    ('inclusivity-4', 'inclusivity', 'Does the system accommodate different languages and cultural contexts?'),
    
    -- Accountability
    ('accountability-1', 'accountability', 'Are there clear lines of responsibility for AI decisions?'),
    ('accountability-2', 'accountability', 'Is there a comprehensive audit trail for AI actions?'),
    ('accountability-3', 'accountability', 'Are there mechanisms for users to challenge AI decisions?'),
    ('accountability-4', 'accountability', 'Is there a clear process for handling AI-related incidents?'),
    
    -- Sustainability
    ('sustainability-1', 'sustainability', 'Is the economic impact of the AI system assessed?'),
    ('sustainability-2', 'sustainability', 'Are social consequences evaluated and monitored?'),
    ('sustainability-3', 'sustainability', 'Is energy efficiency considered in system design?'),
    ('sustainability-4', 'sustainability', 'Are there measures to reduce environmental impact?'),
    
    -- Compliance and Governance
    ('compliance-1', 'complianceAndGovernance', 'Does the system comply with relevant AI regulations?'),
    ('compliance-2', 'complianceAndGovernance', 'Is there a documented ethical governance framework?'),
    ('compliance-3', 'complianceAndGovernance', 'Are compliance records maintained and updated?'),
    ('compliance-4', 'complianceAndGovernance', 'Is there regular review of compliance requirements?')
on conflict (id) do update set
    question_text = excluded.question_text,
    updated_at = timezone('utc'::text, now());