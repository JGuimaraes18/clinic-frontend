import { useState } from 'react';
import { Calendar, Users, Stethoscope, Clock, TrendingUp, AlertCircle, CheckCircle, Activity, Menu, X, LogOut } from 'lucide-react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-primary">ClinicHub</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground hover:bg-secondary p-2 rounded-lg transition">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
            { id: 'pacientes', label: 'Pacientes', icon: Users },
            { id: 'profissionais', label: 'Profissionais', icon: Stethoscope },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === id
                  ? 'bg-secondary text-primary font-semibold'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-red-50 rounded-lg transition">
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'pacientes' && 'Gestão de Pacientes'}
              {currentPage === 'profissionais' && 'Gestão de Profissionais'}
              {currentPage === 'agendamentos' && 'Agendamentos'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Bem-vindo ao sistema de gestão clínica</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">JD</div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'pacientes' && <PacientesPage />}
          {currentPage === 'profissionais' && <ProfissionaisPage />}
          {currentPage === 'agendamentos' && <AgendamentosPage />}
        </main>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Hero Section with Background Image */}
      <div className="rounded-xl overflow-hidden h-48 bg-gradient-to-r from-primary/10 to-accent/10 border border-border flex items-center justify-between p-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Bem-vindo de volta!</h3>
          <p className="text-muted-foreground">Aqui está um resumo do seu dia na clínica</p>
        </div>
        <Activity size={80} className="text-primary/20" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pacientes', value: '248', icon: Users, color: 'bg-blue-50', iconColor: 'text-blue-600' },
          { label: 'Atendimentos Hoje', value: '12', icon: Clock, color: 'bg-green-50', iconColor: 'text-green-600' },
          { label: 'Profissionais', value: '8', icon: Stethoscope, color: 'bg-purple-50', iconColor: 'text-purple-600' },
          { label: 'Agendados', value: '34', icon: Calendar, color: 'bg-orange-50', iconColor: 'text-orange-600' },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition">
              <div className={`${metric.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`${metric.iconColor}`} size={24} />
              </div>
              <p className="text-muted-foreground text-sm mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-foreground">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Atendimentos por Mês</h3>
          <div className="h-64 flex items-end gap-2">
            {[40, 55, 65, 48, 72, 85, 90, 78, 92, 88, 95, 100].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg hover:from-primary/80 transition"
                style={{ height: `${(val / 100) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Alertas</h3>
          {[
            { type: 'warning', title: 'Consulta em 30min', desc: 'Dr. Silva' },
            { type: 'success', title: 'Pagamento recebido', desc: 'R$ 450,00' },
            { type: 'info', title: 'Novo paciente', desc: 'Maria Santos' },
          ].map((alert, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-secondary rounded-lg">
              {alert.type === 'warning' && <AlertCircle className="text-orange-600 flex-shrink-0" size={20} />}
              {alert.type === 'success' && <CheckCircle className="text-green-600 flex-shrink-0" size={20} />}
              {alert.type === 'info' && <Activity className="text-blue-600 flex-shrink-0" size={20} />}
              <div>
                <p className="font-semibold text-sm text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Próximos Atendimentos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Paciente</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Profissional</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Horário</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { patient: 'João Silva', doctor: 'Dr. Carlos', time: '10:00', status: 'Confirmado' },
                { patient: 'Maria Santos', doctor: 'Dra. Ana', time: '10:30', status: 'Pendente' },
                { patient: 'Pedro Costa', doctor: 'Dr. Carlos', time: '11:00', status: 'Confirmado' },
                { patient: 'Ana Oliveira', doctor: 'Dra. Beatriz', time: '14:00', status: 'Confirmado' },
              ].map((apt, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-secondary transition">
                  <td className="py-3 px-4 text-sm text-foreground">{apt.patient}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{apt.doctor}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{apt.time}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      apt.status === 'Confirmado' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PacientesPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Pacientes</h3>
          <p className="text-muted-foreground">Gerencie todos os pacientes da clínica</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition font-semibold">
          + Novo Paciente
        </button>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Nome</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">CPF</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Email</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Telefone</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'João Silva', cpf: '123.456.789-00', email: 'joao@email.com', phone: '(11) 98765-4321' },
              { name: 'Maria Santos', cpf: '987.654.321-00', email: 'maria@email.com', phone: '(11) 99876-5432' },
              { name: 'Pedro Costa', cpf: '456.789.123-00', email: 'pedro@email.com', phone: '(11) 97654-3210' },
              { name: 'Ana Oliveira', cpf: '789.123.456-00', email: 'ana@email.com', phone: '(11) 96543-2109' },
              { name: 'Carlos Mendes', cpf: '321.654.987-00', email: 'carlos@email.com', phone: '(11) 95432-1098' },
            ].map((patient, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-secondary transition">
                <td className="py-4 px-6 text-sm text-foreground font-medium">{patient.name}</td>
                <td className="py-4 px-6 text-sm text-muted-foreground">{patient.cpf}</td>
                <td className="py-4 px-6 text-sm text-muted-foreground">{patient.email}</td>
                <td className="py-4 px-6 text-sm text-muted-foreground">{patient.phone}</td>
                <td className="py-4 px-6 text-sm">
                  <button className="text-primary hover:text-primary/80 font-semibold">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfissionaisPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Profissionais</h3>
          <p className="text-muted-foreground">Gerencie os profissionais da clínica</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition font-semibold">
          + Novo Profissional
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Dr. Carlos Silva', specialty: 'Cardiologia', patients: '45', status: 'Ativo' },
          { name: 'Dra. Ana Costa', specialty: 'Dermatologia', patients: '38', status: 'Ativo' },
          { name: 'Dr. Pedro Mendes', specialty: 'Ortopedia', patients: '52', status: 'Ativo' },
          { name: 'Dra. Beatriz Santos', specialty: 'Pediatria', patients: '41', status: 'Ativo' },
          { name: 'Dr. Felipe Oliveira', specialty: 'Oftalmologia', patients: '33', status: 'Ativo' },
          { name: 'Dra. Juliana Rocha', specialty: 'Ginecologia', patients: '39', status: 'Ativo' },
        ].map((prof, idx) => (
          <div key={idx} className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{prof.name}</h4>
                <p className="text-sm text-muted-foreground">{prof.specialty}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pacientes:</span>
                <span className="font-semibold text-foreground">{prof.patients}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">{prof.status}</span>
                <button className="text-primary text-sm font-semibold hover:text-primary/80">Ver detalhes</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgendamentosPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Agendamentos</h3>
          <p className="text-muted-foreground">Visualize e gerencie todos os agendamentos</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition font-semibold">
          + Novo Agendamento
        </button>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mini Calendar */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Calendário</h4>
          <div className="space-y-2">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day, idx) => (
              <div key={idx} className="text-center text-sm font-semibold text-muted-foreground">{day}</div>
            ))}
            {Array.from({ length: 35 }).map((_, idx) => (
              <div
                key={idx}
                className={`text-center py-2 rounded-lg text-sm cursor-pointer transition ${
                  idx === 14 ? 'bg-primary text-white font-semibold' : 'hover:bg-secondary'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { date: '23 de Abril', time: '09:00', patient: 'João Silva', doctor: 'Dr. Carlos', status: 'Confirmado' },
            { date: '23 de Abril', time: '10:30', patient: 'Maria Santos', doctor: 'Dra. Ana', status: 'Pendente' },
            { date: '23 de Abril', time: '14:00', patient: 'Pedro Costa', doctor: 'Dr. Carlos', status: 'Confirmado' },
            { date: '24 de Abril', time: '09:30', patient: 'Ana Oliveira', doctor: 'Dra. Beatriz', status: 'Confirmado' },
            { date: '24 de Abril', time: '11:00', patient: 'Carlos Mendes', doctor: 'Dr. Felipe', status: 'Cancelado' },
          ].map((apt, idx) => (
            <div key={idx} className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{apt.patient}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        apt.status === 'Confirmado' ? 'bg-green-100 text-green-700' :
                        apt.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.doctor} • {apt.date} às {apt.time}</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary/80 font-semibold text-sm">Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
