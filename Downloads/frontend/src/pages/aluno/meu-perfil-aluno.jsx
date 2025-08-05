import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AlunoMenu from "./aluno-menu";

function MeuPerfilAluno() {
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
      const response = await fetch("http://localhost:8000/estudantes/me", {
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
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <AlunoMenu />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* ToastContainer estilizado global para toda a página */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName={(context) => {
            // context.type pode ser: "default", "success", "info", "warning", "error"
            const base =
              "!rounded-l !shadow-lg !font-semibold !text-base !px-6 !py-4 !text-white";
            switch (context?.type) {
              case "success":
                return `${base} !bg-[#2F9E41]`; // verde
              case "error":
                return `${base} !bg-red-600`;
              case "info":
                return `${base} !bg-blue-600`;
              case "warning":
                return `${base} !bg-yellow-600 !text-black`;
              default:
                return `${base} !bg-[#2F9E41]`;
            }
          }}
          bodyClassName="!text-white"
        />
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-[#2F9E41]/20 p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#2F9E41] text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white">
              {user.nome?.charAt(0) || "A"}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#2F9E41] drop-shadow mb-1">
                Meu Perfil
              </h1>
              <p className="text-gray-500">
                Gerencie suas informações pessoais
              </p>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-[#2F9E41] mb-6 border-b pb-2">
            Dados Pessoais
          </h3>
          <div className="space-y-4">
            {editMode ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Nome Completo:
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome || ""}
                    onChange={handleChange}
                    className="border-2 border-[#2F9E41] rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email || ""}
                    onChange={handleChange}
                    className="border-2 border-[#2F9E41] rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Matrícula:
                  </label>
                  <span className="text-gray-700">{form.matricula}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Status:
                  </label>
                  <span className="text-gray-700">{form.status}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Turma:
                  </label>
                  <input
                    type="text"
                    name="turma"
                    value={form.turma || ""}
                    onChange={handleChange}
                    className="border-2 border-[#2F9E41] rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Telefone:
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={form.telefone || ""}
                    onChange={handleChange}
                    className="border-2 border-[#2F9E41] rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Curso ID:
                  </label>
                  <span className="text-gray-700">{form.curso_id}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Tipo de Usuário:
                  </label>
                  <span className="text-gray-700">{form.user_type}</span>
                </div>
                <div className="flex gap-2 mt-6 justify-end">
                  <button
                    type="submit"
                    className="bg-[#2F9E41] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#217a32] transition"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Nome Completo:
                  </label>
                  <span className="text-gray-700">{user.nome}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Email:
                  </label>
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Matrícula:
                  </label>
                  <span className="text-gray-700">{user.matricula}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Status:
                  </label>
                  <span className="text-gray-700">{user.status}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Telefone:
                  </label>
                  <span className="text-gray-700">{user.telefone}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="font-semibold w-40 text-[#2F9E41]">
                    Tipo de Usuário:
                  </label>
                  <span className="text-gray-700">{user.user_type}</span>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-yellow-600 transition"
                  >
                    Editar Informações
                  </button>
                </div>
              </>
            )}
          </div>
          {/* ToastContainer removido daqui, agora global acima */}
        </div>
      </div>
    </div>
  );
}

export default MeuPerfilAluno;
