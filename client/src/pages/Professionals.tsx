import { useFetch } from "@/hooks/useFetch";
import { getProfessionals, Professional } from "@/services/professionalService";
import { formatPhone } from "@/utils/format";

export default function Professionals() {
  const { data: professionals = [], loading, error } = useFetch(getProfessionals);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profissionais</h1>
          <p className="text-sm text-gray-500">
            Lista de profissionais cadastrados no sistema
          </p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          + Novo
        </button>
      </div>

      {loading && (
        <div className="p-6 text-gray-500">Carregando profissionais...</div>
      )}

      {error && (
        <div className="p-6 text-red-500 font-medium">{error}</div>
      )}

      {!loading && professionals.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-6 text-center text-muted-foreground">
          Nenhum profissional cadastrado.
        </div>
      )}

      {!loading && professionals.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {professionals.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{p.full_name}</h3>
                <p className="text-sm text-muted-foreground">{p.email}</p>
                <p className="text-sm text-muted-foreground">{formatPhone(p.phone)}</p>
              </div>

              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Registro:</span>{" "}
                  {p.registration_type} - {p.registration_number}
                </p>
                <p>
                  <span className="font-medium">Especialidade:</span>{" "}
                  {p.specialty}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      p.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {p.is_active ? "Ativo" : "Inativo"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}