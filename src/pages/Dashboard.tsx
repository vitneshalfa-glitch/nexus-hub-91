import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, Target, CheckSquare, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const { users, tasks, leads } = useStore();
  
  const employees = users.filter(u => u.userType === "employee");
  const drivers = users.filter(u => u.userType === "driver");
  
  const tasksByStatus = [
    { name: "Main Tasks", value: tasks.filter(t => t.status === "main").length, color: "hsl(134, 100%, 39%)" },
    { name: "Reassigned", value: tasks.filter(t => t.status === "reassigned").length, color: "hsl(45, 100%, 50%)" },
    { name: "Reuse", value: tasks.filter(t => t.status === "reuse").length, color: "hsl(220, 100%, 50%)" },
  ];
  
  const leadsByStatus = [
    { name: "New", count: leads.filter(l => l.status === "new").length },
    { name: "Contacted", count: leads.filter(l => l.status === "contacted").length },
    { name: "Qualified", count: leads.filter(l => l.status === "qualified").length },
    { name: "Converted", count: leads.filter(l => l.status === "converted").length },
    { name: "Lost", count: leads.filter(l => l.status === "lost").length },
  ];

  const stats = [
    { title: "Total Employees", value: employees.length, icon: Users, color: "bg-primary" },
    { title: "Total Drivers", value: drivers.length, icon: Car, color: "bg-accent" },
    { title: "Active Leads", value: leads.filter(l => l.status !== "converted" && l.status !== "lost").length, icon: Target, color: "bg-secondary" },
    { title: "Pending Tasks", value: tasks.filter(t => t.status === "main").length, icon: CheckSquare, color: "bg-primary" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to OK BOZ CRM</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Lead Conversion Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tasksByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Users</span>
              <span className="font-semibold text-foreground">{users.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Tasks</span>
              <span className="font-semibold text-foreground">{tasks.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Leads</span>
              <span className="font-semibold text-foreground">{leads.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Conversion Rate</span>
              <span className="font-semibold text-primary">
                {leads.length > 0 ? ((leads.filter(l => l.status === "converted").length / leads.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
