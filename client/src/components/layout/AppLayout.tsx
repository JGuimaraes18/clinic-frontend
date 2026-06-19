import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Activity, Calendar, Users, Stethoscope, Menu, X, LogOut, } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isProfessional } = useAuth();

  // detecta mobile
  const [isMobile, setIsMobile] = useState(false);

  // drawer mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // colapso desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menu = [
    { path: "/", label: "Dashboard", icon: Activity },
    { path: "/agendamentos", label: "Agendamentos", icon: Calendar },
    { path: "/calendar", label: "Calendário", icon: Calendar },
    { path: "/pacientes", label: "Pacientes", icon: Users },
    ...(!isProfessional
      ? [{ path: "/profissionais", label: "Profissionais", icon: Stethoscope }]
      : []),
    ...(user?.is_superuser
      ? [{ path: "/usuarios", label: "Usuários", icon: Users }]
      : []),
    ...(user?.is_superuser
      ? [{ path: "/clinicas", label: "Clínicas", icon: Stethoscope }]
      : []),
  ];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      {/* OVERLAY MOBILE */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR / DRAWER */}
      <div
        className={`
          fixed md:relative z-50 h-full bg-white border-r border-gray-100
          flex flex-col transition-all duration-300 shadow-xl shadow-gray-200/20
          ${isMobile
            ? sidebarOpen
              ? "left-0 w-64"
              : "-left-64 w-64"
            : sidebarCollapsed
              ? "w-20"
              : "w-64"
          }
        `}
      >
        {/* HEADER */}
        <div className="p-6 flex items-center justify-between">
          {!sidebarCollapsed && !isMobile && (
            <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-lg shadow-primary/30 text-white">
                <Activity size={20} strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent tracking-tight">
                Clinify
              </h1>
            </div>
          )}

          <button
            onClick={() =>
              isMobile
                ? setSidebarOpen(!sidebarOpen)
                : setSidebarCollapsed(!sidebarCollapsed)
            }
            className="hover:bg-gray-100 p-2 rounded-xl transition-colors text-gray-500 hover:text-gray-900"
          >
            {isMobile
              ? (sidebarOpen ? <X size={20} /> : <Menu size={20} />)
              : (sidebarCollapsed ? <Menu size={20} /> : <X size={20} />)
            }
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menu.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon 
                  size={20} 
                  className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                {(!sidebarCollapsed || isMobile) && (
                  <span className="text-sm">{label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform duration-200" />
            {(!sidebarCollapsed || isMobile) && (
              <span className="text-sm font-medium">Sair da conta</span>
            )}
          </button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR MOBILE */}
        {isMobile && (
          <div className="px-4 py-3 border-b border-gray-100 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-md text-white">
                <Activity size={16} strokeWidth={2.5} />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">
                Clinify
              </h1>
            </div>
          </div>
        )}

        {/* MAIN */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}