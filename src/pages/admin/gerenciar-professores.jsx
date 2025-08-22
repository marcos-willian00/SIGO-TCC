import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import AdminMenu from "./admin-menu";
import { FiUser, FiRefreshCw, FiSearch, FiMail, FiBook, FiPhone, FiEdit, FiShield } from "react-icons/fi";
import httpClient from "../../services/api";

export default function GerenciarProfessores() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Buscar professores
  const fetchProfessores = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get("/admin/users/professors");
      setProfessores(response.data);
      console.log("Professores carregados:", response.data);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
      toast.error("Erro ao carregar professores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  // Filtrar professores por busca
  const professoresFiltrados = professores.filter(
    (professor) =>
      professor.nome.toLowerCase().includes(search.toLowerCase()) ||
      professor.email.toLowerCase().includes(search.toLowerCase()) ||
      (professor.departamento && professor.departamento.toLowerCase().includes(search.toLowerCase())) ||
      (professor.siape && professor.siape.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenu />
      <div className="flex-1 ml-64">
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#2F9E41] bg-opacity-15 p-3 rounded-lg border border-[#2F9E41] border-opacity-20">
                  <FiUser className="h-8 w-8 text-[#ffffff]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gerenciar Professores</h1>
                  <p className="text-gray-600">Visualize e gerencie os professores do sistema acadêmico</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, email, departamento ou SIAPE..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F9E41] focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F9E41] mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando professores...</p>
                </div>
              </div>
            )}

            {/* Tabela de Professores */}
            {!loading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Professor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SIAPE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Departamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Titulação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Função
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {professoresFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            <FiUser className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              {search ? "Nenhum professor encontrado" : "Nenhum professor cadastrado"}
                            </p>
                            <p className="text-gray-600">
                              {search ? "Tente ajustar sua pesquisa" : "Não há professores cadastrados no momento"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        professoresFiltrados.map((professor) => (
                          <tr key={professor.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`rounded-full p-2 mr-3 ${
                                  professor.role === 'ADMIN' ? 'bg-purple-100' :
                                  professor.role === 'COORDENADOR' ? 'bg-blue-100' :
                                  'bg-[#2F9E41] bg-opacity-10'
                                }`}>
                                  {professor.role === 'ADMIN' ? (
                                    <FiShield className="h-4 w-4 text-purple-600" />
                                  ) : (
                                    <FiUser className="h-4 w-4 text-[#ffffff]" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{professor.nome}</div>
                                  <div className="text-sm text-gray-500">ID: {professor.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                                  <div className="text-sm text-gray-900">{professor.email}</div>
                                </div>
                                {professor.telefone && (
                                  <div className="flex items-center">
                                    <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                                    <div className="text-sm text-gray-900">{professor.telefone}</div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-mono">
                                {professor.siape || "Não informado"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FiBook className="h-4 w-4 text-gray-400 mr-2" />
                                <div className="text-sm text-gray-900">
                                  {professor.departamento || "Não informado"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {professor.titulacao || "Não informado"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  professor.role === 'ADMIN' 
                                    ? "bg-purple-100 text-purple-800"
                                    : professor.role === 'COORDENADOR'
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {professor.role === 'ADMIN' && <FiShield className="h-3 w-3 mr-1" />}
                                {professor.role === 'ADMIN' ? "Administrador" : 
                                 professor.role === 'COORDENADOR' ? "Coordenador" : "Professor"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
