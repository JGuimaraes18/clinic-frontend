import { useState, useEffect } from "react";
import Modal from "@/components/modal/Modal";
import { getClinics, createClinic, updateClinic } from "@/services/clinicService"; 
import { useFetch } from "@/hooks/useFetch";
import { Clinic, ClinicForm } from "@/types/clinic";
import { formatCNPJ, formatPhone } from "@/utils/format";

export default function Clinics() {
    const { data, loading, error } = useFetch<Clinic[]>(getClinics);

    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [errors, setErrors] = useState<Partial<ClinicForm>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState<ClinicForm>({
        name: "",
        slug: "",
        document: "",
        phone: "",
        email: "",
    });

    useEffect(() => {
        if (data) setClinics(data);
    }, [data]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate() {
        const newErrors: Partial<ClinicForm> = {};
    
        if (!form.name.trim())
          newErrors.name = "Nome é obrigatório";
    
        if (!form.email.trim()) {
            newErrors.email = "Email é obrigatório";
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = "Email inválido";
        }

        if (!form.phone.trim())
          newErrors.phone = "Telefone é obrigatório";        
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      }

    function handleClose() {
        setIsOpen(false);
        setEditingId(null);
        setErrors({});
        setForm({ name: "", slug: "", document: "", phone: "", email: "" });
    }
 
    function isValidSlug(slug: string) {
        const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        return regex.test(slug);
    }

    async function handleSave() {
        if (!validate()) return;

        if (!isValidSlug(form.slug)) {
            setErrors((prev) => ({
                ...prev,
                slug: "Slug inválido. Use letras minúsculas, números e hífen.",
            }));
            return;
        }

        try {
            if (editingId) {
                const updated = await updateClinic(editingId, form);

                setClinics((prev) =>
                    prev.map((c) => (c.id === editingId ? updated : c))
                );
            } else {
                const newClinic = await createClinic(form);

                setClinics((prev) => [...prev, newClinic]);
            }

            handleClose();
        } catch (err) {
            console.error(err);
        }
    }

    function handleEdit(clinic: Clinic) {
        setEditingId(clinic.id);

        setForm({
            name: clinic.name,
            slug: clinic.slug,
            document: clinic.document,
            phone: clinic.phone,
            email: clinic.email,
        });

        setIsOpen(true);
    }

    return (
        <>
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                    Clínicas
                    </h1>
                    <p className="text-sm text-gray-500">
                    Clínicas cadastradas no sistema
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg"
                >
                    + Novo
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {loading && <div className="p-6">Carregando...</div>}
            {error && <div className="p-6 text-red-500">{error}</div>}

            <div className="divide-y text-sm">
                {[...clinics]
                .sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }))
                .map((c) => (
                <div
                    key={c.id}
                    onClick={() => handleEdit(c)}
                    className="p-4 hover:bg-blue-50 cursor-pointer"
                >
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-gray-500">{c.document}</div>
                </div>
                ))}
            </div>
            </div>
        </div>

        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editingId ? "Editar Clínica" : "Nova Clínica"}
        >
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Nome"
                    className={`w-full border p-3 rounded-lg ${
                        errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    value={form.name}
                    onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    type="text"
                    placeholder="Identificador"
                    className={`w-full border p-3 rounded-lg ${
                        errors.slug ? "border-red-500" : "border-gray-300"
                    }`} 
                    value={form.slug}
                    onChange={(e) => {
                        const value = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                        .replace(/--+/g, "-"); 
                        setForm({ ...form, slug: value });
                    }}
                />

                <input
                    type="text"
                    placeholder="Documento (CNPJ)"
                    className="w-full border p-3 rounded-lg"
                    value={form.document}
                    onChange={(e) =>
                    setForm({ ...form, document: formatCNPJ(e.target.value) })
                    }
                />

                <input
                type="text"
                placeholder="Telefone"
                className={`w-full border p-3 rounded-lg ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                value={form.phone}
                onChange={(e) =>
                    setForm({ ...form, phone: formatPhone(e.target.value) })
                }
                />

                <input
                type="email"
                placeholder="Email"
                className={`w-full border p-3 rounded-lg ${
                    errors.email ? "border-red-500" : "border-gray-300"
                }`}
                value={form.email}
                onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                }
                />


            <button
                onClick={handleSave}
                className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
                Salvar
            </button>
            </div>
        </Modal>
        </>
    );
}