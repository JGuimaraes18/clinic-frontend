import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMedicalRecordById,
  updateMedicalRecord,
  closeMedicalRecord,
  getMedicalHistory,
} from "@/services/medicalRecordService";

export default function Attendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<any>(null);
  const [conteudo, setConteudo] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const data = await getMedicalRecordById(Number(id));
      setRecord(data);
      setConteudo(data.conteudo);

      const historyData = await getMedicalHistory(Number(id));
      setHistory(historyData);
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

    await updateMedicalRecord(record.id, { conteudo });
    await closeMedicalRecord(record.id);

    alert("Atendimento finalizado!");
    navigate("/agendamentos");
  }

  if (!record) return <div className="p-6">Carregando...</div>;

  const isClosed = record.status === "FECHADO";

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-3 gap-6">

      {/* COLUNA PRINCIPAL */}
      <div className="col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">
          Atendimento #{record.id}
        </h1>

        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          disabled={isClosed}
          className="w-full border rounded-lg p-4 min-h-[400px]"
        />

        {!isClosed && (
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Salvar Rascunho
            </button>

            <button
              onClick={handleClose}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
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

      {/* COLUNA LATERAL HISTÓRICO */}
      <div className="bg-gray-50 border rounded-xl p-4 space-y-4">
        <h2 className="font-semibold text-lg">
          Histórico do Paciente
        </h2>

        {history.length === 0 && (
          <div className="text-sm text-gray-500">
            Nenhum atendimento anterior.
          </div>
        )}

        {history.map((item) => (
          <div
            key={item.id}
            className="p-3 border rounded-lg bg-white shadow-sm"
          >
            <div className="text-xs text-gray-500">
              {new Date(item.data).toLocaleDateString("pt-BR")}
            </div>
            <div className="text-sm mt-1 line-clamp-3">
              {item.resumo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}