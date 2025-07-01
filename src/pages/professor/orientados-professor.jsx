import { useEffect, useState } from "react";
import ProfessorMenu from "./menu-professor";
import { ToastContainer, toast } from "react-toastify";

export default function OrientandosProfessor() {
  const [orientandos, setOrientandos] = useState([]);
  const [showConvite, setShowConvite] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Novos states para convite com título e descrição
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [tituloProposto, setTituloProposto] = useState("");
  const [descricaoProposta, setDescricaoProposta] = useState("");

  // Buscar orientandos do professor
  useEffect(() => {
    async function fetchOrientandos() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/professors/orientandos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOrientandos(data);
        } else {
          toast.error("Não foi possível carregar os orientandos.");
        }
      } catch {
        toast.error("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrientandos();
  }, []);

  // Buscar todos os alunos cadastrados (apenas quando abrir o modal)
  const handleAbrirConvite = async () => {
    setShowConvite(true);
    setSearch("");
    setAlunoSelecionado(null);
    setTituloProposto("");
    setDescricaoProposta("");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/professors/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAlunos(data);
      } else {
        toast.error("Não foi possível carregar os alunos.");
      }
    } catch {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Selecionar aluno para convite
  const handleSelecionarAluno = (alunoId) => {
    setAlunoSelecionado(alunoId);
    setTituloProposto("");
    setDescricaoProposta("");
  };

  // Enviar convite para aluno ser orientado (com título e descrição)
  const handleConvidar = async () => {
    if (!alunoSelecionado || !tituloProposto.trim() || !descricaoProposta.trim()) {
      toast.error("Preencha todos os campos!");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/professors/me/convites-orientacao",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estudante_id: alunoSelecionado,
            titulo_proposto: tituloProposto,
            descricao_proposta: descricaoProposta
          }),
        }
      );
      if (response.ok) {
        toast.success("Convite enviado!");
        setShowConvite(false);
      } else {
        const data = await response.json();
        toast.error(data.detail || "Não foi possível enviar o convite.");
      }
    } catch {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar alunos pelo nome ou email digitado
  const alunosFiltrados = alunos.filter(
    (aluno) =>
      (aluno.nome && aluno.nome.toLowerCase().includes(search.toLowerCase())) ||
      (aluno.email && aluno.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfessorMenu />
      <div className="flex-1 p-10 ml-64">
        <h1 className="text-2xl font-bold text-[#2F9E41] mb-6">Meus Orientandos</h1>
        {/* Botão de convidar aluno logo abaixo do título */}
        <button
          onClick={handleAbrirConvite}
          className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32] transition mb-6"
        >
          Convidar Aluno
        </button>
        <div className="bg-white rounded shadow p-6 mb-6">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b font-semibold">Nome</th>
                <th className="py-2 px-4 border-b font-semibold">Email</th>
                <th className="py-2 px-4 border-b font-semibold">Matrícula</th>
                <th className="py-2 px-4 border-b font-semibold">Turma</th>
              </tr>
            </thead>
            <tbody>
              {orientandos.map((aluno) => (
                <tr key={aluno.id || aluno.id_estudante}>
                  <td className="py-2 px-4">{aluno.nome}</td>
                  <td className="py-2 px-4">{aluno.email}</td>
                  <td className="py-2 px-4">{aluno.matricula}</td>
                  <td className="py-2 px-4">{aluno.turma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de convite */}
        {showConvite && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative z-[101]">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setShowConvite(false)}
                aria-label="Fechar"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">Convidar Aluno</h2>
              {!alunoSelecionado ? (
                <>
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou email..."
                    className="border rounded px-4 py-2 mb-4 w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                  <div className="max-h-64 overflow-y-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b font-semibold">Nome</th>
                          <th className="py-2 px-4 border-b font-semibold">Email</th>
                          <th className="py-2 px-4 border-b font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {alunosFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-gray-500">
                              Nenhum aluno encontrado.
                            </td>
                          </tr>
                        ) : (
                          alunosFiltrados.map((aluno) => (
                            <tr key={aluno.id}>
                              <td>{aluno.nome}</td>
                              <td>{aluno.email}</td>
                              <td>
                                <button
                                  onClick={() => handleSelecionarAluno(aluno.id)}
                                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                  disabled={loading}
                                >
                                  Selecionar
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleConvidar();
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Título do TCC</label>
                    <input
                      type="text"
                      className="border rounded px-4 py-2 w-full"
                      value={tituloProposto}
                      onChange={e => setTituloProposto(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Descrição do TCC</label>
                    <textarea
                      className="border rounded px-4 py-2 w-full"
                      value={descricaoProposta}
                      onChange={e => setDescricaoProposta(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32] transition"
                      disabled={loading}
                    >
                      Enviar Convite
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlunoSelecionado(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      Voltar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}