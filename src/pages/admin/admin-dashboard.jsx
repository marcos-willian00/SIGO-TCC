import AdminMenu from "./admin-menu";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import httpClient from "../../services/api";
import { 
  FiUsers, 
  FiBook, 
  FiFileText, 
  FiSettings,
  FiBarChart2,
  FiTrendingUp,
  FiUserCheck,
  FiBookOpen,
  FiActivity,
  FiShield
} from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalProfessores: 0,
    totalEstudantes: 0,
    totalCursos: 0
  });
  const [loading, setLoading] = useState(true);

  // Função para buscar estatísticas
  const fetchStats = async () => {
    setLoading(true);
    try {
      console.log("Iniciando busca de estatísticas...");
      
      // Buscar professores
      let professoresResponse;
      try {
        professoresResponse = await httpClient.get("/admin/users/professors");
        console.log("Professores carregados:", professoresResponse.data);
      } catch (error) {
        console.warn("Erro ao buscar professores via admin, tentando coordenador...");
        professoresResponse = await httpClient.get("/coordenador/professores");
      }
      const professores = professoresResponse.data;

      // Buscar estudantes
      let estudantesResponse;
      try {
        estudantesResponse = await httpClient.get("/admin/users/students");
        console.log("Estudantes carregados:", estudantesResponse.data);
      } catch (error) {
        console.warn("Erro ao buscar estudantes via admin, tentando coordenador...");
        estudantesResponse = await httpClient.get("/coordenador/alunos");
      }
      const estudantes = estudantesResponse.data;

      // Buscar cursos
      const cursosResponse = await httpClient.get("/admin/cursos");
      console.log("Cursos carregados:", cursosResponse.data);
      const cursos = cursosResponse.data;

      // Calcular totais
      const totalProfessores = professores.length;
      const totalEstudantes = estudantes.length;
      const totalUsuarios = totalProfessores + totalEstudantes;
      const totalCursos = cursos.length;

      console.log("Estatísticas calculadas:", {
        totalUsuarios,
        totalProfessores,
        totalEstudantes,
        totalCursos
      });

      setStats({
        totalUsuarios,
        totalProfessores,
        totalEstudantes,
        totalCursos
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas do sistema.");
      
      // Fallback com dados vazios
      setStats({
        totalUsuarios: 0,
        totalProfessores: 0,
        totalEstudantes: 0,
        totalCursos: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AdminDashboard: useEffect executado - carregando estatísticas...");
    fetchStats();
  }, []);
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
                  <FiShield className="h-8 w-8 text-[#ffffff]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Painel do Administrador</h1>
                  <p className="text-gray-600">Gerencie o sistema acadêmico e monitore atividades</p>
                </div>
              </div>
            </div>

            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-[#2F9E41] to-[#217a32] rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-semibold mb-2">Bem-vindo, Administrador!</h2>
                  <p className="text-white text-opacity-90">
                    Monitore o sistema e gerencie usuários com facilidade
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <FiActivity className="h-8 w-8 text-[#2F9E41]" />
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : stats.totalUsuarios}
                    </p>
                    <p className="text-sm text-green-600 font-medium">Sistema ativo</p>
                  </div>
                  <div className="bg-blue-50 rounded-full p-3">
                    <FiUsers className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Professores</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : stats.totalProfessores}
                    </p>
                    <p className="text-sm text-gray-500">Cadastrados</p>
                  </div>
                  <div className="bg-green-50 rounded-full p-3">
                    <FiUserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estudantes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : stats.totalEstudantes}
                    </p>
                    <p className="text-sm text-gray-500">Cadastrados</p>
                  </div>
                  <div className="bg-purple-50 rounded-full p-3">
                    <FiBookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cursos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : stats.totalCursos}
                    </p>
                    <p className="text-sm text-gray-500">Ativos</p>
                  </div>
                  <div className="bg-orange-50 rounded-full p-3">
                    <FiBook className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#2F9E41] bg-opacity-10 p-2 rounded-lg">
                    <FiSettings className="h-5 w-5 text-[#ffffff]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.href = '/admin/gerenciar-alunos'}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiUsers className="h-5 w-5 text-[#2F9E41]" />
                    <div>
                      <p className="font-medium text-gray-900">Gerenciar Alunos</p>
                      <p className="text-sm text-gray-600">Cadastrar, editar e visualizar alunos</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => window.location.href = '/admin/gerenciar-professores'}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiUserCheck className="h-5 w-5 text-[#2F9E41]" />
                    <div>
                      <p className="font-medium text-gray-900">Gerenciar Professores</p>
                      <p className="text-sm text-gray-600">Cadastrar, editar e visualizar professores</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => window.location.href = '/admin/cursos-admin'}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiBook className="h-5 w-5 text-[#2F9E41]" />
                    <div>
                      <p className="font-medium text-gray-900">Gerenciar Cursos</p>
                      <p className="text-sm text-gray-600">Configurar cursos e disciplinas</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => window.location.href = '/admin/anexo-arquivos'}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiFileText className="h-5 w-5 text-[#2F9E41]" />
                    <div>
                      <p className="font-medium text-gray-900">Anexos e Arquivos</p>
                      <p className="text-sm text-gray-600">Gerenciar documentos do sistema</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#2F9E41] bg-opacity-10 p-2 rounded-lg">
                    <FiBarChart2 className="h-5 w-5 text-[#ffffff]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="bg-green-100 rounded-full p-2">
                      <FiTrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Sistema funcionando normalmente</p>
                      <p className="text-xs text-gray-600">Última verificação: agora</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="bg-blue-100 rounded-full p-2">
                      <FiUsers className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Usuários online</p>
                      <p className="text-xs text-gray-600">Monitoramento ativo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="bg-purple-100 rounded-full p-2">
                      <FiActivity className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Base de dados atualizada</p>
                      <p className="text-xs text-gray-600">Sincronização completa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#2F9E41] bg-opacity-10 p-2 rounded-lg">
                  <FiActivity className="h-5 w-5 text-[#ffffff]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-green-800">Banco de Dados</p>
                  <p className="text-xs text-green-600">Operacional</p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-green-800">API Backend</p>
                  <p className="text-xs text-green-600">Operacional</p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-green-800">Interface Web</p>
                  <p className="text-xs text-green-600">Operacional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}