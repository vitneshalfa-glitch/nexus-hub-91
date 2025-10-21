export type UserType = "employee" | "driver";

export interface User {
  id: string;
  name: string;
  age: number;
  phone1: string;
  phone2: string;
  location: string;
  user_type: UserType;
  created_at?: string;
}

export interface AttendanceRecord {
  id?: string;
  user_id: string;
  date: string;
  status: "present" | "absent" | "leave";
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "main" | "reassigned" | "reuse";
  task_status: "pending" | "in-progress" | "completed";
  due_date: string;
  created_at?: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  value: number;
  created_at?: string;
}
