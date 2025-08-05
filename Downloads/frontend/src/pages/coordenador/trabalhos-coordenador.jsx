import { useState, useEffect } from "react";
import {
  FiUsers,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiBook,
  FiCalendar,
  FiUser,
  FiFileText,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import CoordenadorMenu from "./menu-coordenador";

export default function TrabalhosCoordenador() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedProfessor, setExpandedProfessor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar professores com TCCs ativos
  useEffect(() => {
    async function fetchProfessoresComTccs() {
      const token = localStorage.getItem("token");
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:8000/coordenador/professores/com-tccs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfessores(data);
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.detail || "Erro ao carregar professores com TCCs."
          );
        }
      } catch (err) {
        toast.error("Erro ao conectar com o servidor.");
        console.error("Erro ao buscar professores:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfessoresComTccs();
  }, []);

  // Filtrar professores pelo termo de busca
  const professoresFiltrados = professores.filter(
    (professor) =>
      professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.tccs.some(
        (tcc) =>
          tcc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tcc.estudante?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Alternar expansão dos detalhes do professor
  const toggleExpansao = (professorId) => {
    setExpandedProfessor(
      expandedProfessor === professorId ? null : professorId
    );
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return "Não definida";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <CoordenadorMenu />
      <div className="flex-1 ml-64 px-6 py-8">
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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#2F9E41] mb-6 text-center drop-shadow">
            Trabalhos de Conclusão de Curso
          </h1>

          <div className="mb-6 text-center text-gray-600">
            <p>
              Acompanhe todos os TCCs em andamento orientados pelos professores
              do departamento
            </p>
          </div>

          {/* Barra de busca */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Buscar por professor, aluno ou título do TCC..."
                className="w-full pl-4 pr-4 py-3 border-2 border-[#2F9E41] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F9E41] focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Cards dos professores */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F9E41] mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando trabalhos...</p>
              </div>
            ) : professoresFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <FiBook className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-2">
                  {searchTerm
                    ? "Nenhum resultado encontrado"
                    : "Nenhum TCC ativo encontrado"}
                </p>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Tente ajustar os termos da sua busca"
                    : "Não há professores orientando TCCs no momento"}
                </p>
              </div>
            ) : (
              professoresFiltrados.map((professor) => (
                <div
                  key={professor.id}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-[#2F9E41] transition-all duration-200"
                >
                  {/* Cabeçalho do professor */}
                  <div
                    className="p-6 cursor-pointer flex items-center justify-between hover:bg-green-50 rounded-t-xl transition-colors"
                    onClick={() => toggleExpansao(professor.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-[#2F9E41] p-3 rounded-full">
                        <FiUser className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#2F9E41]">
                          {professor.nome}
                        </h3>
                        <p className="text-gray-600">{professor.email}</p>
                        <p className="text-sm text-gray-500">
                          Departamento: {professor.departamento}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#2F9E41]">
                          {professor.total_tccs}
                        </p>
                        <p className="text-sm text-gray-600">
                          {professor.total_tccs === 1 ? "TCC" : "TCCs"}
                        </p>
                      </div>

                      {expandedProfessor === professor.id ? (
                        <FiChevronUp className="h-6 w-6 text-[#2F9E41]" />
                      ) : (
                        <FiChevronDown className="h-6 w-6 text-[#2F9E41]" />
                      )}
                    </div>
                  </div>

                  {/* Detalhes dos TCCs (expandível) */}
                  {expandedProfessor === professor.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {professor.tccs.map((tcc) => (
                          <div
                            key={tcc.id}
                            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="mb-3">
                              <h4 className="font-semibold text-gray-900 mb-2 leading-tight">
                                {tcc.titulo}
                              </h4>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                  tcc.status
                                )}`}
                              >
                                {getStatusText(tcc.status)}
                              </span>
                            </div>

                            {tcc.estudante && (
                              <div className="mb-3 p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <FiUsers className="h-4 w-4 text-[#2F9E41]" />
                                  <span className="text-sm font-medium text-gray-900">
                                    Orientando
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 font-medium">
                                  {tcc.estudante.nome}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {tcc.estudante.email}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Matrícula: {tcc.estudante.matricula}
                                </p>
                              </div>
                            )}

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <FiFileText className="h-4 w-4" />
                                <span>Status: {getStatusText(tcc.status)}</span>
                              </div>
                              {tcc.descricao && (
                                <div className="flex items-start space-x-2">
                                  <FiCalendar className="h-4 w-4 mt-0.5" />
                                  <span className="line-clamp-2">
                                    {tcc.descricao}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {professor.tccs.length === 0 && (
                        <div className="text-center py-8">
                          <FiBook className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-600">Nenhum TCC encontrado</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Estatísticas resumo */}
          {professoresFiltrados.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-[#2F9E41] mb-4 text-center">
                Resumo Geral
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {professoresFiltrados.length}
                  </p>
                  <p className="text-blue-800 font-medium">
                    Professores Orientadores
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {professoresFiltrados.reduce(
                      (total, prof) => total + prof.total_tccs,
                      0
                    )}
                  </p>
                  <p className="text-green-800 font-medium">
                    TCCs em Andamento
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {professoresFiltrados.length > 0
                      ? Math.round(
                          (professoresFiltrados.reduce(
                            (total, prof) => total + prof.total_tccs,
                            0
                          ) /
                            professoresFiltrados.length) *
                            10
                        ) / 10
                      : 0}
                  </p>
                  <p className="text-purple-800 font-medium">
                    Média por Professor
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ToastContainer removido daqui, agora global acima */}
      </div>
    </div>
  );
}
