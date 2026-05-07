import { useState, useEffect } from "react";
import Modal from "@/components/modal/Modal";
import { getUsers, createUser, updateUser } from "@/services/authService";
import { getClinics } from "@/services/clinicService";
import { useAuth } from "@/contexts/AuthContext";
import { useFetch } from "@/hooks/useFetch";
import { User, UserForm, UserErrors } from "@/types/users";

export default function Users() {
  const { data, loading, error } = useFetch<User[]>(getUsers);

  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<UserForm>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user: loggedUser } = useAuth();
  const [clinics, setClinics] = useState<{ id: number; name: string }[]>([]);

  const [form, setForm] = useState<UserForm>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "staff",
    clinic: null,
    password: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (data) setUsers(data);
  }, [data]);

  useEffect(() => {
    async function loadClinics() {
      if (loggedUser?.is_superuser) {
        const data = await getClinics();
        setClinics(data);
      }
    }

    loadClinics();
  }, [loggedUser]);

  async function loadUsers() {
    const users = await getUsers();
    setUsers(users);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function validate() {
    const newErrors: UserErrors = {};

    if (!form.username.trim())
      newErrors.username = "Username obrigatório";

    if (!form.email.trim())
      newErrors.email = "Email obrigatório";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Email inválido";

    if (!form.first_name.trim())
      newErrors.first_name = "Nome obrigatório";

    if (!form.last_name.trim())
      newErrors.last_name = "Sobrenome obrigatório";

    if (!form.clinic)
      newErrors.clinic = "Clínica obrigatória";

    if (!editingId && !form.password)
      newErrors.password = "Senha obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleClose() {
    setIsOpen(false);
    setEditingId(null);
    setErrors({});
    setForm({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      role: "staff",
      clinic: null,
      password: "",
    });
  }

  async function handleSave() {
    if (!validate()) return;

    const payload = { ...form };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      if (editingId) {
        const updated = await updateUser(editingId, payload);
        setSuccessMessage("Usuário atualizado com sucesso!");
      } else {
        const newUser = await createUser(payload);
        setSuccessMessage("Usuário criado com sucesso!");
      }
      await loadUsers(); 
      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(user: User) {
    setEditingId(user.id);

    setForm({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      clinic: user.clinic?.id || null,
      password: "",
    });

    setIsOpen(true);
  }

  function getRoleLabel(role: string) {
    if (role === "admin") return "Administrador";
    if (role === "professional") return "Profissional";
    return "Equipe";
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

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Usuários
            </h1>
            <p className="text-sm text-gray-500">
              Usuários cadastrados no sistema
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

          {loading && <div className="p-6">Carregando...</div>}
          {error && <div className="p-6 text-red-500">{error}</div>}

          {!loading && users.length === 0 && (
            <div className="p-6 text-gray-500">
              Nenhum usuário cadastrado.
            </div>
          )}

          {!loading && users.length > 0 && (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Nome</th>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Clínica</th>
                  <th className="px-6 py-3 text-left">Perfil</th>
                  <th className="px-6 py-3 text-center">Tipo</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => handleEdit(u)}
                    className="hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium">
                      {u.full_name || `${u.first_name} ${u.last_name}`}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {u.username}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {u.email}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {u.clinic?.name || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {getRoleLabel(u.role)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {u.is_superuser ? (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                          Superuser
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                          Usuário
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={
          editingId
            ? "Editar Usuário"
            : "Novo Usuário"
        }
      >
        <div className="p-6 space-y-4">
          <input
            name="username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            placeholder="Usuário"
            className={`w-full border p-3 rounded-lg ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />

          <input
            name="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            placeholder="Email"
            className={`w-full border p-3 rounded-lg ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />

          {!editingId && (
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Senha"
              className={`w-full border p-3 rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}

          <input
            name="first_name"
            value={form.first_name}
            onChange={(e) =>
              setForm({ ...form, first_name: e.target.value })
            }
            placeholder="Nome"
            className={`w-full border p-3 rounded-lg ${
              errors.first_name ? "border-red-500" : "border-gray-300"
            }`}
          />

          <input
            name="last_name"
            value={form.last_name}
            onChange={(e) =>
              setForm({ ...form, last_name: e.target.value })
            }
            placeholder="Sobrenome"
            className={`w-full border p-3 rounded-lg ${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
          />

          <select
            name="role"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as any })
            }
            className="w-full border p-2 rounded"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
            <option value="professional">Profissional</option>
          </select>

          {loggedUser?.is_superuser && (
          <select
              name="clinic"
              value={form.clinic || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  clinic: e.target.value ? Number(e.target.value) : null,
                })
              }
              className={`w-full border p-3 rounded-lg ${
                errors.clinic ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecione a clínica</option>
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}