-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  phone1 TEXT NOT NULL,
  phone2 TEXT,
  location TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('employee', 'driver')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since no auth required yet)
CREATE POLICY "Allow all operations on users"
  ON public.users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create tasks table with status
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'main' CHECK (status IN ('main', 'reassigned', 'reuse')),
  task_status TEXT NOT NULL DEFAULT 'pending' CHECK (task_status IN ('pending', 'in-progress', 'completed')),
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow all operations on tasks"
  ON public.tasks
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create task assignments table (many-to-many relationship)
CREATE TABLE public.task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Enable RLS
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow all operations on task_assignments"
  ON public.task_assignments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow all operations on attendance_records"
  ON public.attendance_records
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow all operations on leads"
  ON public.leads
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);