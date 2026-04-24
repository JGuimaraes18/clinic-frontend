import { useEffect, useState } from "react";
import api from "../services/api";

interface Patient {
  id: number;
  name: string;
  email: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await api.get("/patients/");
        setPatients(response.data);
      } catch (err) {
        console.error("Erro:", err);
      }
    }

    fetchPatients();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pacientes</h1>

      <ul className="space-y-2">
        {patients.map((p) => (
          <li key={p.id} className="border p-3 rounded-lg">
            {p.name} - {p.email}
          </li>
        ))}
      </ul>
    </div>
  );
}