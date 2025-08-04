import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import ProfessorMenu from "../../components/SidebarProfessor";
import { 
  FiUser, 
  FiMail, 
  FiBook, 
  FiCalendar, 
  FiPlus, 
  FiSearch, 
  FiEye, 
  FiChevronDown, 
  FiChevronUp, 
  FiFileText, 
  FiPhone, 
  FiUsers, 
  FiClock 
} from "react-icons/fi";

export default function OrientadosProfessor() {
  const [orientandos, setOrientandos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showConvite, setShowConvite] = useState(false);
  const [search, setSearch] = useState("");
  const [buscaOrientando, setBuscaOrientando] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [tituloProposto, setTituloProposto] = useState("");
  const [descricaoProposta, setDescricaoProposta] = useState("");
  const [expandedOrientando, setExpandedOrientando] = useState(null);

  useEffect(() => {
    fetchOrientandos();
  }, []);

  // Buscar orientandos do professor
  const fetchOrientandos = async () => {
    setCarregando(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/professors/me/orientandos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrientandos(data);
      } else {
        toast.error("Não foi possível carregar os orientandos.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  // Filtrar orientandos
  const orientandosFiltrados = orientandos.filter((orientando) =>
    orientando.nome?.toLowerCase().includes(buscaOrientando.toLowerCase()) ||
    orientando.email?.toLowerCase().includes(buscaOrientando.toLowerCase()) ||
    orientando.matricula?.toLowerCase().includes(buscaOrientando.toLowerCase())
  );

  // Alternar expansão dos detalhes do orientando
  const toggleExpansao = (orientandoId) => {
    setExpandedOrientando(expandedOrientando === orientandoId ? null : orientandoId);
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "em_andamento":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "finalizado":
        return "bg-green-100 text-green-800 border-green-200";
      case "suspenso":
        return "bg-red-100 text-red-800 border-red-200";
      case "concluido":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Função para obter texto do status
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "em_andamento":
        return "Em Andamento";
      case "finalizado":
        return "Finalizado";
      case "suspenso":
        return "Suspenso";
      case "concluido":
        return "Concluído";
      default:
        return "Em Andamento";
    }
  };

  // Abrir modal de convite e buscar alunos
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

  // Enviar convite para aluno ser orientado
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
      <div className="flex-1 ml-64">
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <FiUsers className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Meus Orientandos</h1>
                    <p className="text-gray-600">Gerencie seus alunos orientandos e seus projetos de TCC</p>
                  </div>
                </div>
                
                {/* Estatísticas */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{orientandos.length}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {orientandos.filter(o => o.tcc && o.tcc.status === 'concluido').length}
                    </p>
                    <p className="text-sm text-gray-600">Concluídos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {orientandos.filter(o => o.tcc && o.tcc.status === 'em_andamento').length}
                    </p>
                    <p className="text-sm text-gray-600">Em Andamento</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de Busca e Ações */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar orientandos..."
                    value={buscaOrientando}
                    onChange={(e) => setBuscaOrientando(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <button
                  onClick={handleAbrirConvite}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiPlus className="h-4 w-4" />
                  Convidar Orientando
                </button>
              </div>
            </div>

            {/* Lista de Orientandos */}
            {carregando ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando orientandos...</p>
                </div>
              </div>
            ) : orientandosFiltrados.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum orientando encontrado</h3>
                  <p className="text-gray-600 mb-4">
                    {buscaOrientando ? 'Tente ajustar sua busca.' : 'Você ainda não possui orientandos.'}
                  </p>
                  {!buscaOrientando && (
                    <button
                      onClick={handleAbrirConvite}
                      className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FiPlus className="h-4 w-4" />
                      Convidar Primeiro Orientando
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orientandosFiltrados.map((orientando) => (
                  <div key={orientando.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-3">
                            <FiUser className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{orientando.nome}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <FiMail className="h-3 w-3" />
                                {orientando.email}
                              </span>
                              <span className="text-sm text-gray-600">
                                Turma: {orientando.turma}
                              </span>
                              <span className="text-sm text-gray-600">
                                Matrícula: {orientando.matricula}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {orientando.tcc && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(orientando.tcc.status)}`}>
                              {getStatusText(orientando.tcc.status)}
                            </span>
                          )}
                          <button
                            onClick={() => toggleExpansao(orientando.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {expandedOrientando === orientando.id ? (
                              <FiChevronUp className="h-5 w-5" />
                            ) : (
                              <FiChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Expandidos */}
                    {expandedOrientando === orientando.id && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="p-6">
                          {orientando.tcc ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Informações do TCC */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <FiBook className="h-5 w-5 text-indigo-600" />
                                  <h4 className="font-semibold text-gray-900">Informações do TCC</h4>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Título:</label>
                                  <p className="text-gray-900 mt-1">{orientando.tcc.titulo}</p>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Descrição:</label>
                                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                                    {orientando.tcc.descricao || 'Nenhuma descrição disponível'}
                                  </p>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Status:</label>
                                  <div className="mt-1">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(orientando.tcc.status)}`}>
                                      {getStatusText(orientando.tcc.status)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Informações do Aluno */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <FiUser className="h-5 w-5 text-green-600" />
                                  <h4 className="font-semibold text-gray-900">Dados do Aluno</h4>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Nome Completo:</label>
                                    <p className="text-gray-900 mt-1">{orientando.nome}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Email:</label>
                                    <p className="text-gray-900 mt-1 break-all">{orientando.email}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Matrícula:</label>
                                    <p className="text-gray-900 mt-1">{orientando.matricula}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Turma:</label>
                                    <p className="text-gray-900 mt-1">{orientando.turma}</p>
                                  </div>
                                  
                                  {orientando.telefone && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Telefone:</label>
                                      <p className="text-gray-900 mt-1 flex items-center gap-1">
                                        <FiPhone className="h-3 w-3" />
                                        {orientando.telefone}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h4 className="text-lg font-medium text-gray-900 mb-2">
                                TCC não iniciado
                              </h4>
                              <p className="text-gray-600 mb-4">
                                Este orientando ainda não possui um TCC cadastrado.
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Email:</label>
                                  <p className="text-gray-900 mt-1">{orientando.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Matrícula:</label>
                                  <p className="text-gray-900 mt-1">{orientando.matricula}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Ações */}
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex justify-end gap-3">
                              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <FiMail className="h-4 w-4" />
                                Enviar Email
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
                                <FiEye className="h-4 w-4" />
                                Ver Detalhes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Convite */}
      {showConvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">Convidar Aluno para Orientação</h3>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
              {/* Campos de Título e Descrição */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Proposto *
                  </label>
                  <input
                    type="text"
                    value={tituloProposto}
                    onChange={(e) => setTituloProposto(e.target.value)}
                    placeholder="Digite o título do TCC proposto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Proposta *
                  </label>
                  <textarea
                    value={descricaoProposta}
                    onChange={(e) => setDescricaoProposta(e.target.value)}
                    placeholder="Descreva a proposta de TCC para o aluno"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Campo de busca */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Aluno
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Digite o nome ou email do aluno"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Lista de alunos */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Aluno *
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg">
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Carregando alunos...</p>
                    </div>
                  ) : alunosFiltrados.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Nenhum aluno encontrado
                    </div>
                  ) : (
                    alunosFiltrados.map((aluno) => (
                      <div
                        key={aluno.id}
                        onClick={() => handleSelecionarAluno(aluno.id)}
                        className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                          alunoSelecionado === aluno.id ? 'bg-indigo-50 border-indigo-200' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            alunoSelecionado === aluno.id 
                              ? 'border-indigo-600 bg-indigo-600' 
                              : 'border-gray-300'
                          }`}>
                            {alunoSelecionado === aluno.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{aluno.nome}</p>
                            <p className="text-sm text-gray-600">{aluno.email}</p>
                            <p className="text-xs text-gray-500">
                              Matrícula: {aluno.matricula} | Turma: {aluno.turma}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowConvite(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConvidar}
                disabled={!alunoSelecionado || !tituloProposto.trim() || !descricaoProposta.trim() || loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FiMail className="h-4 w-4" />
                    Enviar Convite
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
