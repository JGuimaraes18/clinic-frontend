import { useFetch } from "@/hooks/useFetch";
import { getAppointments } from "@/services/appointmentsService";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR");
}

function getStatusStyle(status: string) {
  switch (status) {
    case "AGENDADO":
      return "bg-blue-100 text-blue-700";
    case "REALIZADO":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function Appointments() {
  const { data: appointments = [], loading, error } = useFetch(getAppointments);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-sm text-gray-500">
            Lista de agendamentos cadastrados no sistema
          </p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          + Novo
        </button>
      </div>

      {loading && (
        <div className="p-6 text-gray-500">Carregando agendamentos...</div>
      )}

      {error && (
        <div className="p-6 text-red-500 font-medium">{error}</div>
      )}

      {!loading && appointments.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-6 text-center text-muted-foreground">
          Nenhum agendamento cadastrado.
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {appointments.map((a) => (
            <div
              key={a.id}
                 className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {formatDate(a.data_hora)}
                </h3>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                    a.status
                  )}`}
                >
                  {a.status}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">
                    Paciente:
                  </span>{" "}
                  {a.paciente_nome}
                </p>

                <p>
                  <span className="font-medium text-foreground">
                    Profissional:
                  </span>{" "}
                  {a.profissional_nome}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}