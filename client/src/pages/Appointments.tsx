import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
} from "@/services/appointmentsService";

import { createMedicalRecord } from "@/services/medicalRecordService";
import { getPatients } from "@/services/patientService";
import { getProfessionals } from "@/services/professionalService";

import { Appointment, AppointmentForm } from "@/types/appointment";
import { useAuth } from "@/contexts/AuthContext";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR");
}

function getNowForInput() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function getStatusStyle(status: string) {
  switch (status) {
    case "AGENDADO":
      return "bg-blue-100 text-blue-700";
    case "REALIZADO":
      return "bg-green-100 text-green-700";
    case "CANCELADO":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function Appointments() {
  const { data, loading, error } =
    useFetch<Appointment[]>(getAppointments);

  const { data: patients = [] } = useFetch(getPatients);
  const { data: professionals = [] } = useFetch(getProfessionals);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const navigate = useNavigate();

  // 🔥 AUTH GLOBAL CORRETO
  const { user: currentUser } = useAuth();

  const [form, setForm] = useState<AppointmentForm>({
    data_hora: "",
    status: "AGENDADO",
    observacoes: "",
    paciente: "",
    profissional: "",
  });

  useEffect(() => {
    if (data) setAppointments(data);
  }, [data]);

  // -----------------------------
  // PERMISSÃO CORRIGIDA
  // -----------------------------
  function canStart(appointment: Appointment) {
    if (!currentUser) return false;

    return (
      currentUser.is_superuser ||
      currentUser.role === "admin" ||
      appointment.profissional === currentUser.id
    );
  }

  // -----------------------------
  // MODAL
  // -----------------------------
  function openNewModal() {
    setEditing(null);
    setForm({
      data_hora: "",
      status: "AGENDADO",
      observacoes: "",
      paciente: "",
      profissional: "",
    });
    setOpenModal(true);
  }

  function openEditModal(appointment: Appointment) {
    if (appointment.status === "REALIZADO") return;

    setEditing(appointment);
    setForm({
      data_hora: appointment.data_hora.slice(0, 16),
      status: appointment.status,
      observacoes: appointment.observacoes,
      paciente: appointment.paciente,
      profissional: appointment.profissional,
    });
    setOpenModal(true);
  }

  function handleClose() {
    setOpenModal(false);
    setEditing(null);
  }

  // -----------------------------
  // SAVE
  // -----------------------------
  async function handleSave() {
    try {
      if (!form.data_hora || !form.paciente || !form.profissional) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      if (editing) {
        const updated = await updateAppointment(editing.id, form);

        setAppointments((prev) =>
          prev.map((a) => (a.id === editing.id ? updated : a))
        );
      } else {
        const newAppointment = await createAppointment(form);
        setAppointments((prev) => [...prev, newAppointment]);
      }

      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  // -----------------------------
  // CANCEL (FIXED PATCH ISSUE)
  // -----------------------------
  async function handleCancel(id: number) {
    if (!confirm("Deseja cancelar este agendamento?")) return;

    const appointment = appointments.find((a) => a.id === id);
    if (!appointment) return;

    const updated = await updateAppointment(id, {
      ...appointment,
      status: "CANCELADO",
    });

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    );
  }

  // -----------------------------
  // START APPOINTMENT
  // -----------------------------
  async function handleStart(appointment: any) {
    try {
      const record = await createMedicalRecord({
        atendimento: appointment.atendimento_id,
        conteudo: "Atendimento iniciado",
      });

      navigate(`/atendimento/${record.id}`);
    } catch (err: any) {
      console.log(err.response?.data);
      alert("Erro ao iniciar atendimento.");
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agendamentos</h1>
          <p className="text-sm text-gray-500">
            Lista de agendamentos cadastrados
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Novo
        </button>
      </div>

      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {appointments.map((a) => (
          <div
            key={a.id}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                {formatDate(a.data_hora)}
              </h3>

              <span
                className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                  a.status
                )}`}
              >
                {a.status}
              </span>
            </div>

            <div className="mt-4 text-sm">
              <p>
                <strong>Paciente:</strong> {a.paciente_nome}
              </p>
              <p>
                <strong>Profissional:</strong> {a.profissional_nome}
              </p>
            </div>

            {a.status === "AGENDADO" && (
              <div className="mt-4 flex gap-2">
                {canStart(a) && (
                  <button
                    onClick={() => handleStart(a.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Iniciar Atendimento
                  </button>
                )}

                <button
                  onClick={() => handleCancel(a.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="font-semibold">
              {editing ? "Editar Agendamento" : "Novo Agendamento"}
            </h2>

            <input
              type="datetime-local"
              min={getNowForInput()}
              value={form.data_hora}
              onChange={(e) =>
                setForm({ ...form, data_hora: e.target.value })
              }
              className="w-full border rounded p-2"
            />

            <select
              value={form.paciente}
              onChange={(e) =>
                setForm({
                  ...form,
                  paciente: Number(e.target.value),
                })
              }
              className="w-full border rounded p-2"
            >
              <option value="">Selecione o paciente</option>
              {patients.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.full_name}
                </option>
              ))}
            </select>

            <select
              value={form.profissional}
              onChange={(e) =>
                setForm({
                  ...form,
                  profissional: Number(e.target.value),
                })
              }
              className="w-full border rounded p-2"
            >
              <option value="">Selecione o profissional</option>
              {professionals.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.full_name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="border px-4 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}