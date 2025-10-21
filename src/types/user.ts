export type UserType = "employee" | "driver";

export interface User {
  id: string;
  name: string;
  age: number;
  phone1: string;
  phone2: string;
  location: string;
  userType: UserType;
  attendance?: AttendanceRecord[];
  tasks?: string[];
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "leave";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  status: "main" | "reassigned" | "reuse";
  createdAt: string;
  dueDate: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  value: number;
  createdAt: string;
}
