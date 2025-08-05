import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import CoordenadorMenu from "./menu-coordenador";
import { FiUser, FiSearch, FiRefreshCw } from "react-icons/fi";

export default function ProfessoresDepartamento() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Buscar professores do departamento
  const fetchProfessores = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/coordenador/professores/departamento",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfessores(data);
      } else {
        toast.error("Erro ao carregar professores do departamento.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
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
      professor.siape.toLowerCase().includes(search.toLowerCase()) ||
      (professor.titulacao &&
        professor.titulacao.toLowerCase().includes(search.toLowerCase()))
  );

  const getRoleLabel = (role) => {
    switch (role) {
      case "COORDENADOR":
        return "Coordenador";
      case "ADMIN":
        return "Administrador";
      default:
        return "Professor";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CoordenadorMenu />
      <div className="flex-1 ml-64 p-10">
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2F9E41]">
            Professores do Departamento
          </h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email, SIAPE ou titulação..."
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

        {/* Tabela de Professores */}
        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SIAPE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titulação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {professoresFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {search
                        ? "Nenhum professor encontrado."
                        : "Nenhum professor cadastrado no departamento."}
                    </td>
                  </tr>
                ) : (
                  professoresFiltrados.map((professor) => (
                    <tr key={professor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiUser className="text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {professor.nome}
                            </div>
                            {professor.telefone && (
                              <div className="text-sm text-gray-500">
                                {professor.telefone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {professor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {professor.siape}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {professor.titulacao || "Não informado"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            professor.role === "COORDENADOR"
                              ? "bg-purple-100 text-purple-800"
                              : professor.role === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {getRoleLabel(professor.role)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiUser className="text-[#2F9E41] text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total de Professores</p>
                <p className="text-2xl font-bold text-[#2F9E41]">
                  {professores.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiUser className="text-purple-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Coordenadores</p>
                <p className="text-2xl font-bold text-purple-500">
                  {professores.filter((p) => p.role === "COORDENADOR").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiUser className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Professores Regulares</p>
                <p className="text-2xl font-bold text-blue-500">
                  {professores.filter((p) => p.role === "PROFESSOR").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ToastContainer removido daqui, agora global acima */}
    </div>
  );
}
