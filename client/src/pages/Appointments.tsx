import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  startAppointmentAttendance,
  getAppointmentById,
} from "@/services/appointmentsService";

import Modal from "@/components/modal/Modal";

import { getMedicalRecordByAppointment } from "@/services/medicalRecordService";
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
    case "EM_ATENDIMENTO":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "AGENDADO":
      return "Agendado";      
    case "REALIZADO":
      return "Realizado";
    case "CANCELADO":
      return "Cancelado";
    case "EM_ATENDIMENTO":
      return "Em Atendimento";
    default:
      return status;
  }
}

export default function Appointments() {
  const { data, loading, error } =
    useFetch<Appointment[]>(getAppointments);

  const { data: patientsData } = useFetch(getPatients);
  const { data: professionalsData } = useFetch(getProfessionals);

  const patients = patientsData ?? [];
  const professionals = professionalsData ?? [];

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("AGENDADO");
  const [dateFilter, setDateFilter] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [patientFilter, setPatientFilter] = useState<string>("TODOS");
  const [professionalFilter, setProfessionalFilter] = useState<string>("TODOS");
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);

  const navigate = useNavigate();

  // AUTH GLOBAL CORRETO
  const { user: currentUser } = useAuth();

  const [form, setForm] = useState<AppointmentForm>({
    data_hora: "",
    status: "AGENDADO",
    observacoes: "",
    paciente: "",
    profissional: "",
  });

  const filteredAppointments = appointments.filter((a) => {
    const appointmentDate = a.data_hora.split("T")[0];

    const matchStatus =
      statusFilter === "TODOS" || a.status === statusFilter;

    const matchDate =
      !dateFilter || appointmentDate === dateFilter;

    const matchPatient =
      patientFilter === "TODOS" ||
      String(a.paciente) === patientFilter;

    const matchProfessional =
      professionalFilter === "TODOS" ||
      String(a.profissional) === professionalFilter;

    return matchStatus && matchDate && matchPatient && matchProfessional;
  });

  useEffect(() => {
    if (data) {
      const sorted = [...data].sort(
        (a, b) =>
          new Date(a.data_hora).getTime() -
          new Date(b.data_hora).getTime()
      );

      setAppointments(sorted);
    }
  }, [data]);

  // -----------------------------
  // PERMISSÃO 
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
    setSubmitted(false);
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
    if (appointment.status !== "AGENDADO") return;

    setEditing(appointment);
    setSubmitted(false);
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
    setSubmitted(true);

    if (!form.data_hora || !form.paciente || !form.profissional) {
      return;
    }

    try {
      if (editing) {
        const updated = await updateAppointment(editing.id, form);

        setAppointments((prev) =>
          prev.map((a) => (a.id === editing.id ? updated : a))
        );

        setSuccessMessage("Agendamento atualizado com sucesso!");
      } else {
        const newAppointment = await createAppointment(form);

        setAppointments((prev) => [...prev, newAppointment]);

        setSuccessMessage("Agendamento criado com sucesso!");
      }

      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);

      setSubmitted(false);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  // -----------------------------
  // CANCEL (FIXED PATCH ISSUE)
  // -----------------------------

  async function handleCancel(id: number) {
    setCancelId(id);
  }

  async function confirmCancel() {
    if (!cancelId) return;

    const appointment = appointments.find((a) => a.id === cancelId);
    if (!appointment) return;

    const updated = await updateAppointment(cancelId, {
      ...appointment,
      status: "CANCELADO",
    });

    setAppointments((prev) =>
      prev.map((a) => (a.id === cancelId ? updated : a))
    );

    setCancelId(null);
  }

  // -----------------------------
  // START APPOINTMENT
  // -----------------------------

  async function handleStart(appointmentId: number) {
    try {
      const res = await startAppointmentAttendance(appointmentId);

      navigate(`/atendimento/${res.prontuario_id}`);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAttendance(appointmentId: number) {
    try {
      const record = await getMedicalRecordByAppointment(appointmentId);
      navigate(`/atendimento/${record.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
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
        
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Agendamentos
            </h1>
            <p className="text-sm text-gray-500">
              Lista de agendamentos cadastrados
            </p>
          </div>

          <button
            onClick={openNewModal}
            className="bg-blue-600 text-white px-4 py-1 rounded-lg"
          >
            + Novo
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { value: "AGENDADO", label: "Agendado" },
            { value: "EM_ATENDIMENTO", label: "Em Atendimento" },
            { value: "REALIZADO", label: "Realizado" },
            { value: "CANCELADO", label: "Cancelado" },
            { value: "TODOS", label: "Todos" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setStatusFilter(item.value)}
              className={`px-3 py-1 rounded-full text-sm transition mb-4
                ${
                  statusFilter === item.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          />

          <select
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="TODOS">Todos os pacientes</option>
            {patients.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>

          <select
            value={professionalFilter}
            onChange={(e) => setProfessionalFilter(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="TODOS">Todos os profissionais</option>
            {professionals.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading && <div>Carregando...</div>}
        {error && <div className="text-red-500">{error}</div>}

          {filteredAppointments.map((a) => (
            <div key={a.id} className="bg-white border rounded-xl p-5 shadow-sm" >
              <div className="flex justify-between">
                <h4 className="font-semibold">
                  {formatDate(a.data_hora)}
                </h4>

                <span
                  className={`px-3 py-1 text-xs items-stretch rounded-full ${getStatusStyle(
                    a.status
                  )}`}
                >
                  {getStatusLabel(a.status)}
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
                    onClick={() => openEditModal(a)}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleCancel(a.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {a.status === "EM_ATENDIMENTO" && (
                <div className="mt-4 flex gap-2">
                  {canStart(a) && (
                    <button
                      onClick={() => handleAttendance(a.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Continuar Atendimento
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {cancelId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-2">
                Cancelar agendamento
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Deseja realmente cancelar este agendamento?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCancelId(null)}
                  className="px-4 py-2 text-sm rounded-lg border"
                >
                  Voltar
                </button>

                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

  
      {/* MODAL */}
      <Modal
        isOpen={openModal}
        onClose={handleClose}
        title={editing ? "Editar Agendamento" : "Novo Agendamento"}
      >
        <div className="space-y-3">
          <input
            type="datetime-local"
            min={getNowForInput()}
            value={form.data_hora}
            onChange={(e) =>
              setForm({ ...form, data_hora: e.target.value })
            }
            className={`w-full rounded p-2 border ${
              submitted && !form.data_hora ? "border-red-500" : "border-gray-300"
            }`}
          />

          <select
            value={form.paciente}
            onChange={(e) =>
              setForm({
                ...form,
                paciente: Number(e.target.value),
              })
            }
            className={`w-full rounded p-2 border ${
              submitted && !form.paciente ? "border-red-500" : "border-gray-300"
            }`}
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
            className={`w-full rounded p-2 border ${
              submitted && !form.profissional ? "border-red-500" : "border-gray-300"
            }`}
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
              className="border px-4 py-1 rounded-lg"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}