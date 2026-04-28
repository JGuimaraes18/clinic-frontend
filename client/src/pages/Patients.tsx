import { getPatients } from "@/services/patientService";
import { useFetch } from "@/hooks/useFetch";
import { formatCPF, formatPhone, formatDateBR, formatAgeWithBirth, calculateAge } from "@/utils/format";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function Patients() {
  const { data: patients = [], loading, error } = useFetch(getPatients);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
          <p className="text-sm text-gray-500">
            Lista de pacientes cadastrados no sistema
          </p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          + Novo
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && (
          <div className="p-6 text-gray-500">Carregando pacientes...</div>
        )}

        {error && (
          <div className="p-6 text-red-500 font-medium">{error}</div>
        )}

        {!loading && patients.length === 0 && (
          <div className="p-6 text-gray-500">
            Nenhum paciente cadastrado.
          </div>
        )}

        {!loading && patients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Telefone</th>
                  <th className="px-6 py-3">Idade</th>
                  <th className="px-6 py-3">Nascimento</th>
                  <th className="px-6 py-3">CPF</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-100 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {p.full_name}
                    </td>
                    <td className="text-sm px-2 py-1 text-gray-600">
                      {formatPhone(p.phone) || "-"}
                    </td>
                    <td className="text-sm px-2 py-1 text-gray-600">
                      {(() => {
                        const age = calculateAge(p.birth_date);

                        return (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              age < 18
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {age} anos
                          </span>
                        );
                      })()}
                    </td>
                     <td className="text-sm px-2 py-1 text-gray-600">
                      {formatDateBR(p.birth_date) || "-"}
                    </td>
                    <td className="text-sm px-2 py-1 text-gray-600">
                      {formatCPF(p.cpf) || "-"}
                    </td>
                    <td className="text-sm px-2 py-1 text-gray-600">
                      {p.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p.is_deleted ? (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                          Inativo
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                          Ativo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}