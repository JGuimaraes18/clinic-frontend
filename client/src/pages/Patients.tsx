import { useState, useEffect } from "react";
import Modal from "@/components/modal/Modal";
import { getPatients, createPatient, updatePatient, } from "@/services/patientService";
import { useFetch } from "@/hooks/useFetch";
import { formatCPF, formatPhone, formatDateBR, calculateAge, } from "@/utils/format";
import { Patient, PatientForm } from "@/types/patient";

export default function Patients() {
  const { data, loading, error } = useFetch<Patient[]>(getPatients);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState<PatientForm>({
    full_name: "",
    cpf: "",
    email: "",
    phone: "",
    birth_date: "",
  });

  const [errors, setErrors] = useState<Partial<PatientForm>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (data) setPatients(data);
  }, [data]);

  function validate() {
    const newErrors: Partial<PatientForm> = {};

    if (!form.full_name.trim())
      newErrors.full_name = "Nome é obrigatório";

    if (form.email && !emailRegex.test(form.email))
      newErrors.email = "Email inválido";

    if (!form.phone.trim())
      newErrors.phone = "Telefone é obrigatório";

    if (!form.birth_date)
      newErrors.birth_date = "Data é obrigatória";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleClose() {
    setIsOpen(false);
    setEditingId(null);

    setForm({
      full_name: "",
      cpf: "",
      email: "",
      phone: "",
      birth_date: "",
    });

    setErrors({});
  }

  async function handleSave() {
    if (!validate()) return;

    try {
      if (editingId) {
        const updated = await updatePatient(editingId, form);

        setPatients((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p))
        );

        setSuccessMessage("Paciente atualizado com sucesso!");
      } else {
        const newPatient = await createPatient(form);

        setPatients((prev) => [...prev, newPatient]);
        setSuccessMessage("Paciente criado com sucesso!");
      }

      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(patient: Patient) {
    setEditingId(patient.id);

    setForm({
      full_name: patient.full_name || "",
      cpf: patient.cpf || "",
      email: patient.email || "",
      phone: patient.phone || "",
      birth_date: patient.birth_date || "",
    });

    setIsOpen(true);
  }

  return (
    <>
      <div className="p-6">
        {successMessage && (
          <div className="fixed top-6 right-6 z-50">
            <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm">
              {successMessage}
            </div>
          </div>
        )}
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Pacientes
            </h1>
            <p className="text-sm text-gray-500">
              Pacientes cadastrados no sistema
            </p>
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-1 rounded-lg"
            onClick={() => setIsOpen(true)}
          >
            + Novo
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && (
            <div className="p-6 text-gray-500">
              Carregando pacientes...
            </div>
          )}

          {error && (
            <div className="p-6 text-red-500 font-medium">
              {error}
            </div>
          )}

          {!loading && patients.length === 0 && (
            <div className="p-6 text-gray-500">
              Nenhum paciente cadastrado.
            </div>
          )}

          {!loading && patients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">Telefone</th>
                    <th className="px-6 py-3">Idade</th>
                    <th className="px-6 py-3">Nascimento</th>
                    <th className="px-6 py-3">CPF</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {patients.map((p) => {
                    const age = calculateAge(p.birth_date);

                    return (
                      <tr
                        key={p.id}
                        onClick={() => handleEdit(p)}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {p.full_name}
                        </td>

                        <td className="px-2 py-2 text-gray-600">
                          {formatPhone(p.phone) || "-"}
                        </td>

                        <td className="px-2 py-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              age < 18
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {age} anos
                          </span>
                        </td>

                        <td className="px-2 py-2 text-gray-600">
                          {formatDateBR(p.birth_date)}
                        </td>

                        <td className="px-2 py-2 text-gray-600">
                          {formatCPF(p.cpf)}
                        </td>

                        <td className="px-2 py-2 text-gray-600">
                          {p.email}
                        </td>

                        <td className="px-2 py-2">
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? "Editar Paciente" : "Novo Paciente"}
      >
        <div className="space-y-3">
          <input
            type="text"
            required 
            aria-required="true" 
            placeholder="Nome completo"
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">
              {errors.full_name}
            </p>
          )}

          <input
            type="text"
            placeholder="CPF"
            className="w-full border p-3 rounded-lg"
            value={form.cpf}
            onChange={(e) =>
              setForm({ ...form, cpf: formatCPF(e.target.value) })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}

          <input
            type="text"
            required 
            aria-required="true" 
            placeholder="Telefone"
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: formatPhone(e.target.value) })
            }
          />
          {errors.phone && (
            <p className="text-xs text-red-500">
              {errors.phone}
            </p>
          )}

          <input
            type="date"
            required
            aria-label="Data de nascimento"
            title="Data de nascimento"
            max={new Date().toISOString().split("T")[0]} // bloqueia datas futuras
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.birth_date ? "border-red-500" : "border-gray-300"
            }`}
            value={form.birth_date}
            onChange={(e) =>
              setForm({ ...form, birth_date: e.target.value })
            }
          />

          {errors.birth_date && (
            <p className="text-xs text-red-500 mt-1">
              {errors.birth_date}
            </p>
          )}

          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {editingId ? "Salvar Alterações" : "Criar Paciente"}
          </button>
        </div>
      </Modal>
    </>
  );
}