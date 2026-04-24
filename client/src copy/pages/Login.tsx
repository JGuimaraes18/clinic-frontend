import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // ⚠️ depois vamos trocar pelo axios real
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // fake login por enquanto
      localStorage.setItem("access_token", "fake_token");

      navigate("/");
    } catch (error) {
      alert("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-6">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-lg p-8 space-y-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Activity className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">JG - Gestão Clínica</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acesse sua conta para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Senha
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} JG. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}