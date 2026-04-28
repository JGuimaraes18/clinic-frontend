import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Calendar,
  Users,
  Stethoscope,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { path: "/", label: "Dashboard", icon: Activity },
    { path: "/agendamentos", label: "Agendamentos", icon: Calendar },
    { path: "/pacientes", label: "Pacientes", icon: Users },
    { path: "/profissionais", label: "Profissionais", icon: Stethoscope },
  ];

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-white border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-primary text-white">
          {sidebarOpen && (
            <h1 className="font-bold">GC</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground hover:bg-secondary p-2 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menu.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === path
                  ? "bg-secondary text-primary font-semibold"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-red-50 rounded-lg"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}