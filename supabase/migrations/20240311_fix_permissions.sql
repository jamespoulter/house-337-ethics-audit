-- Enable RLS
ALTER TABLE staff_interviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON staff_interviews FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON staff_interviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON staff_interviews FOR UPDATE USING (true);

-- Do the same for RACI matrix
ALTER TABLE raci_matrix ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON raci_matrix FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON raci_matrix FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON raci_matrix FOR UPDATE USING (true); 