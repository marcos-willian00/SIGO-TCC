import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ProfessorMenu from "./menu-professor";

function MeuPerfilProfessor() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setForm(data);
        } else {
          toast.error("Não foi possível carregar os dados do perfil.");
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor.");
      }
    }
    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(user);
  };

  const handleSave = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8000/professors/me", { // <-- troque aqui
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      setEditMode(false);
      toast.success("Informações atualizadas com sucesso!");
    } else {
      toast.error("Erro ao atualizar informações.");
    }
  } catch (error) {
    toast.error("Erro ao conectar com o servidor.");
  }
};

  if (!user) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfessorMenu />
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-[#2F9E41] mt-10 ml-10 mb-4">Meu Perfil</h1>
        <div className="flex flex-col">
          <div className="flex-1 flex items-start justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-xl">
              <h3 className="text-xl font-semibold text-[#2F9E41] mb-6">Dados Pessoais</h3>
              <div className="space-y-4">
                {editMode ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <strong>Nome Completo:</strong>
                      <input
                        type="text"
                        name="nome"
                        value={form.nome || ""}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 ml-2 w-2/3"
                      />
                    </div>
                    <div>
                      <strong>Email:</strong>
                      <input
                        type="email"
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 ml-2 w-2/3"
                      />
                    </div>
                    <div>
                      <strong>SIAPE:</strong> {form.siape}
                    </div>
                    <div>
                      <strong>Departamento:</strong>
                      <input
                        type="text"
                        name="departamento"
                        value={form.departamento || ""}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 ml-2 w-2/3"
                      />
                    </div>
                    <div>
                      <strong>Titulação:</strong>
                      <input
                        type="text"
                        name="titulacao"
                        value={form.titulacao || ""}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 ml-2 w-2/3"
                      />
                    </div>
                    <div>
                      <strong>Telefone:</strong>
                      <input
                        type="text"
                        name="telefone"
                        value={form.telefone || ""}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 ml-2 w-2/3"
                      />
                    </div>
                    <div>
                      <strong>Tipo de Usuário:</strong> {form.user_type || form.role}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="submit"
                        className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32] transition"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div><strong>Nome Completo:</strong> {user.nome}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>SIAPE:</strong> {user.siape}</div>
                    <div><strong>Departamento:</strong> {user.departamento}</div>
                    <div><strong>Titulação:</strong> {user.titulacao}</div>
                    <div><strong>Telefone:</strong> {user.telefone}</div>
                    <div><strong>Tipo de Usuário:</strong> {user.user_type || user.role}</div>
                    <button
                      onClick={handleEdit}
                      className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                    >
                      Editar Informações
                    </button>
                  </>
                )}
              </div>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeuPerfilProfessor;