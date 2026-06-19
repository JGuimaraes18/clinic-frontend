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
          fixed md:relative z-50 h-full bg-white border-r border-border
          flex flex-col transition-all duration-300

          ${isMobile
            ? sidebarOpen
              ? "left-0 w-40"
              : "-left-64 w-40"
            : sidebarCollapsed
              ? "w-20"
              : "w-50"
          }
        `}
      >

        {/* HEADER */}
        <div className="p-2 border-b border-border flex items-center justify-between bg-primary text-white">
          {!sidebarCollapsed && !isMobile && (
            <h1 className="text-lg font-bold">
              Sistema Clínica
            </h1>
          )}

          <button
            onClick={() =>
              isMobile
                ? setSidebarOpen(!sidebarOpen)
                : setSidebarCollapsed(!sidebarCollapsed)
            }
            className="hover:bg-white/10 p-2 rounded-lg"
          >
            {isMobile
              ? (sidebarOpen ? <X size={20} /> : <Menu size={20} />)
              : (sidebarCollapsed ? <Menu size={20} /> : <X size={20} />)
            }
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">
          {menu.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => {
                navigate(path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-2 py-2 rounded-lg transition
                ${location.pathname === path
                  ? "bg-secondary text-primary font-semibold"
                  : "text-foreground hover:bg-secondary"
                }
              `}
            >
              <Icon size={16} />
              {(!sidebarCollapsed || isMobile) && (
                <span className="text-sm">{label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-red-50 rounded-lg"
          >
            <LogOut size={16} />
            {(!sidebarCollapsed || isMobile) && (
              <span>Sair</span>
            )}
          </button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR MOBILE */}
        {isMobile && (
          // <div className="p-4 border-b flex items-center md:hidden">
          <div className="p-2 border-b border-border flex items-center bg-primary text-white">

            <button onClick={() => setSidebarOpen(true)}>
              <Menu />
            </button>
            <h1 className="ml-4 text-base sm:text-lg font-semibold">
              Sistema Clínica
            </h1>
          </div>
        )}

        {/* MAIN */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}