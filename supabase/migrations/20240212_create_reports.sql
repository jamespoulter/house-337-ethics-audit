-- Enable the moddatetime extension
create extension if not exists moddatetime schema extensions;

-- Create reports table
create table if not exists public.reports (
    id uuid default gen_random_uuid() primary key,
    audit_id uuid references public.audits(id) on delete cascade,
    title text not null,
    description text,
    content text not null,
    custom_instructions text,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status text default 'draft' check (status in ('draft', 'completed', 'archived')),
    version integer default 1
);

-- Enable RLS
alter table public.reports enable row level security;

-- Create RLS policies
create policy "Users can view their own reports"
    on public.reports for select
    using (auth.uid() = created_by);

create policy "Users can insert their own reports"
    on public.reports for insert
    with check (auth.uid() = created_by);

create policy "Users can update their own reports"
    on public.reports for update
    using (auth.uid() = created_by);

-- Create updated_at trigger
create trigger handle_updated_at before update on public.reports
    for each row execute procedure moddatetime (updated_at); 