-- Add delete policy for reports table
create policy "Users can delete their own reports"
    on public.reports for delete
    using (auth.uid() = created_by); 