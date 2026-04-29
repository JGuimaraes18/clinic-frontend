import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMedicalRecordById,
  updateMedicalRecord,
  closeMedicalRecord,
} from "@/services/medicalRecordService";

export default function Attendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<any>(null);
  const [conteudo, setConteudo] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) return;

      const data = await getMedicalRecordById(Number(id));
      setRecord(data);
      setConteudo(data.conteudo);
    }

    load();
  }, [id]);

  async function handleSave() {
    if (!record) return;

    const updated = await updateMedicalRecord(record.id, {
      conteudo,
    });

    setRecord(updated);
    alert("Salvo como rascunho.");
  }

  async function handleClose() {
    if (!record) return;

    if (!conteudo.trim()) {
      alert("Não é possível fechar prontuário vazio.");
      return;
    }

    await updateMedicalRecord(record.id, {
      conteudo,
    });

    await closeMedicalRecord(record.id);

    alert("Atendimento finalizado!");
    navigate("/agendamentos");
  }

  if (!record) return <div className="p-6">Carregando...</div>;

  const isClosed = record.status === "FECHADO";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">
        Atendimento #{record.id}
      </h1>

      <textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        disabled={isClosed}
        className="w-full border rounded-lg p-4 min-h-[300px]"
      />

      {!isClosed && (
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Salvar Rascunho
          </button>

          <button
            onClick={handleClose}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Finalizar Atendimento
          </button>
        </div>
      )}

      {isClosed && (
        <div className="text-green-600 font-semibold">
          Prontuário fechado em{" "}
          {new Date(record.finalizado_em).toLocaleString("pt-BR")}
        </div>
      )}
    </div>
  );
}