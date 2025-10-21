import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, Car, Target, CheckSquare, MessageSquare } from "lucide-react";
import okBozLogo from "@/assets/ok-boz-logo.png";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/add-users", icon: UserPlus, label: "Add Users" },
    { path: "/employees", icon: Users, label: "Employees" },
    { path: "/drivers", icon: Car, label: "Drivers" },
    { path: "/leads", icon: Target, label: "Lead Conversions" },
    { path: "/tasks", icon: CheckSquare, label: "Task Management" },
    { path: "/chat", icon: MessageSquare, label: "Group Chat" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <img src={okBozLogo} alt="OK BOZ" className="w-full" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
