import { useState, useEffect } from "react";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import CoordenadorMenu from "./menu-coordenador";
import { FiUser, FiArchive, FiRefreshCw, FiSearch, FiUserCheck } from "react-icons/fi";

export default function GerenciarAlunosCoordenador() {
  const [modal, setModal] = useState({ open: false, tipo: null, alunoId: null, nome: "" });
  const [alunos, setAlunos] = useState([]);
  const [alunosArquivados, setAlunosArquivados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showArquivados, setShowArquivados] = useState(false);
  const [search, setSearch] = useState("");

  // Buscar alunos ativos
  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/admin/estudantes?arquivados=false", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAlunos(data);
      } else {
        toast.error("Erro ao carregar alunos ativos.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar alunos arquivados
  const fetchAlunosArquivados = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/admin/estudantes?arquivados=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAlunosArquivados(data);
      } else {
        toast.error("Erro ao carregar alunos arquivados.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
    fetchAlunosArquivados();
  }, []);

  // Arquivar aluno
  const handleArquivarAluno = async (alunoId, nomeAluno) => {
    setModal({ open: true, tipo: "arquivar", alunoId, nome: nomeAluno });
  };

  // Desarquivar aluno
  const handleDesarquivarAluno = async (alunoId, nomeAluno) => {
    setModal({ open: true, tipo: "desarquivar", alunoId, nome: nomeAluno });
  };
  // Função para confirmar ação do modal
  const confirmarModal = async () => {
    if (!modal.open) return;
    try {
      const token = localStorage.getItem("token");
      let url = "";
      if (modal.tipo === "arquivar") {
        url = `http://localhost:8000/admin/estudantes/${modal.alunoId}/arquivar`;
      } else {
        url = `http://localhost:8000/admin/estudantes/${modal.alunoId}/desarquivar`;
      }
      const response = await fetch(url, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success(modal.tipo === "arquivar" ? "Aluno arquivado com sucesso!" : "Aluno desarquivado com sucesso!");
        fetchAlunos();
        fetchAlunosArquivados();
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || (modal.tipo === "arquivar" ? "Erro ao arquivar aluno." : "Erro ao desarquivar aluno."));
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    }
    setModal({ open: false, tipo: null, alunoId: null, nome: "" });
  };

  // Função para fechar modal
  const fecharModal = () => setModal({ open: false, tipo: null, alunoId: null, nome: "" });

  // Filtrar alunos por busca
  const alunosFiltrados = (showArquivados ? alunosArquivados : alunos).filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
      aluno.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CoordenadorMenu />
      <div className="flex-1 ml-64 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2F9E41]">Gerenciar Alunos</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowArquivados(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${ 
                !showArquivados 
                  ? "bg-[#2F9E41] text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FiUser /> Alunos Ativos
            </button>
            <button
              onClick={() => setShowArquivados(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                showArquivados 
                  ? "bg-orange-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FiArchive /> Alunos Arquivados
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F9E41] focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <FiRefreshCw className="animate-spin mx-auto text-2xl text-[#2F9E41] mb-2" />
            <p>Carregando...</p>
          </div>
        )}

        {/* Tabela de Alunos */}
        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            {/* Header da tabela fixo */}
            <div className="bg-gray-50 border-b border-gray-200">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            
            {/* Área com scroll para o corpo da tabela */}
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full">
                <tbody className="bg-white divide-y divide-gray-200">
                  {alunosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        {search ? "Nenhum aluno encontrado." : showArquivados ? "Nenhum aluno arquivado." : "Nenhum aluno ativo."}
                      </td>
                    </tr>
                  ) : (
                    alunosFiltrados.map((aluno) => (
                      <tr key={aluno.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiUser className="text-gray-400 mr-3" />
                            <div className="text-sm font-medium text-gray-900">{aluno.nome}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{aluno.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              showArquivados
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {showArquivados ? "Arquivado" : "Ativo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {showArquivados ? (
                            <button
                              onClick={() => handleDesarquivarAluno(aluno.id, aluno.nome)}
                              className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                              title="Desarquivar aluno"
                            >
                              <FiUserCheck /> Desarquivar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArquivarAluno(aluno.id, aluno.nome)}
                              className="inline-flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                              title="Arquivar aluno"
                            >
                              <FiArchive /> Arquivar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Indicador de quantidade de alunos na lista */}
            {alunosFiltrados.length > 0 && (
              <div className="bg-gray-50 px-6 py-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Mostrando {alunosFiltrados.length} {alunosFiltrados.length === 1 ? 'aluno' : 'alunos'}
                  {search && ` encontrado${alunosFiltrados.length === 1 ? '' : 's'} para "${search}"`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiUser className="text-[#2F9E41] text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Alunos Ativos</p>
                <p className="text-2xl font-bold text-[#2F9E41]">{alunos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiArchive className="text-orange-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Alunos Arquivados</p>
                <p className="text-2xl font-bold text-orange-500">{alunosArquivados.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmação */}
        {modal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: "rgba(255,255,255,0.6)"}}>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                {modal.tipo === "arquivar" ? <FiArchive className="text-orange-500" /> : <FiUserCheck className="text-green-600" />}
                {modal.tipo === "arquivar" ? "Arquivar Aluno" : "Desarquivar Aluno"}
              </h2>
              <p className="mb-6 text-gray-700 text-base">
                {modal.tipo === "arquivar"
                  ? `Tem certeza que deseja arquivar o aluno "${modal.nome}"? Ele não conseguirá mais fazer login.`
                  : `Tem certeza que deseja desarquivar o aluno "${modal.nome}"? Ele poderá fazer login novamente.`}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={fecharModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarModal}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${modal.tipo === "arquivar" ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
                >
                  {modal.tipo === "arquivar" ? "Arquivar" : "Desarquivar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
