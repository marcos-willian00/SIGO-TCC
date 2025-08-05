import { useEffect, useState } from "react";
import AlunoMenu from "./aluno-menu";
import { ToastContainer, toast } from "react-toastify";
import httpClient from "../../services/api";
import { 
  FiMail, 
  FiUser, 
  FiBook, 
  FiCheck, 
  FiX, 
  FiClock,
  FiFileText,
  FiInbox
} from "react-icons/fi";

export default function ConvitesAluno() {
  const [convites, setConvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, action: null, conviteId: null });

  // Função para buscar convites
  const fetchConvites = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get("/students/me/convites-orientacao");
      setConvites(response.data);
    } catch (error) {
      console.error("Erro ao carregar convites:", error);
      toast.error("Erro ao carregar convites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvites();
  }, []);

  const confirmarAceitar = (conviteId) => setConfirm({ open: true, action: "aceitar", conviteId });
  const confirmarRecusar = (conviteId) => setConfirm({ open: true, action: "recusar", conviteId });

  const executarConfirmacao = async () => {
    if (confirm.action === "aceitar") await handleAceitar(confirm.conviteId);
    if (confirm.action === "recusar") await handleRecusar(confirm.conviteId);
    setConfirm({ open: false, action: null, conviteId: null });
  };

  // Aceitar convite
  const handleAceitar = async (conviteId) => {
    setLoading(true);
    try {
      console.log("Enviando requisição para aceitar convite:", conviteId);
      
      const response = await httpClient.post(
        `/students/me/convites-orientacao/${conviteId}/responder`,
        { "status": "aceito" }
      );
      
      console.log("Resposta do servidor:", response.data);
      toast.success("Convite aceito com sucesso!");
      fetchConvites();
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Erro ao aceitar convite. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Recusar convite
  const handleRecusar = async (conviteId) => {
    setLoading(true);
    try {
      console.log("Enviando requisição para recusar convite:", conviteId);
      
      const response = await httpClient.post(
        `/students/me/convites-orientacao/${conviteId}/responder`,
        { "status": "recusado" }
      );
      
      console.log("Resposta do servidor:", response.data);
      toast.success("Convite recusado.");
      fetchConvites();
    } catch (error) {
      console.error("Erro ao recusar convite:", error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Erro ao recusar convite. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AlunoMenu />
      <div className="flex-1 ml-64">
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#2F9E41] bg-opacity-15 p-3 rounded-lg border border-[#2F9E41] border-opacity-20">
                  <FiMail className="h-8 w-8 text-[#ffffff]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Convites de Orientação</h1>
                  <p className="text-gray-600">Gerencie os convites recebidos de professores para orientação de TCC</p>
                </div>
              </div>
              
              {/* Estatísticas */}
              <div className="mt-4 flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#2F9E41]">{convites.length}</p>
                  <p className="text-sm text-gray-600">Total de Convites</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {convites.filter(c => c.status === 'aceito').length}
                  </p>
                  <p className="text-sm text-gray-600">Aceitos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">
                    {convites.filter(c => c.status === 'pendente' || !c.status).length}
                  </p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {convites.filter(c => c.status === 'recusado').length}
                  </p>
                  <p className="text-sm text-gray-600">Recusados</p>
                </div>
              </div>
            </div>

            {/* Lista de Convites */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F9E41] mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando convites...</p>
                </div>
              </div>
            ) : convites.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <FiInbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum convite recebido</h3>
                  <p className="text-gray-600 mb-6">
                    Você ainda não recebeu convites de orientação de professores.
                  </p>
                  <button
                    onClick={() => (window.location.href = '/aluno/professores-aluno')}
                    className="bg-[#2F9E41] text-white px-6 py-2 rounded-lg hover:bg-[#217a32] transition-colors font-medium"
                  >
                    Ver Professores Disponíveis
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {convites.map((convite) => (
                  <div key={convite.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className={`px-6 py-4 ${
                      convite.status === "aceito" ? "bg-gradient-to-r from-green-500 to-green-600" :
                      convite.status === "recusado" ? "bg-gradient-to-r from-red-500 to-red-600" :
                      "bg-gradient-to-r from-[#2F9E41] to-[#217a32]"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white bg-opacity-30 rounded-full p-2 border border-white border-opacity-30">
                            <FiUser className="h-6 w-6 text-[#2F9E41]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {convite.professor?.nome || "Professor"}
                            </h3>
                            <p className="text-white text-opacity-90 text-sm">
                              {convite.professor?.departamento && `${convite.professor.departamento} • `}
                              {convite.professor?.titulacao || "Professor"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-white bg-opacity-30 px-3 py-1 rounded-full border border-white border-opacity-30">
                          {convite.status === "aceito" ? (
                            <FiCheck className="h-4 w-4 text-[#2F9E41] drop-shadow-sm" />
                          ) : convite.status === "recusado" ? (
                            <FiX className="h-4 w-4 text-red drop-shadow-sm" />
                          ) : (
                            <FiClock className="h-4 w-4 text-[#2F9E41] drop-shadow-sm" />
                          )}
                          <span className="text-[#2F9E41] text-sm font-medium">
                            {convite.status === "aceito" ? "Aceito" : 
                             convite.status === "recusado" ? "Recusado" : "Pendente"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Proposta de TCC */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-[#2F9E41] bg-opacity-10 p-2 rounded-lg">
                              <FiBook className="h-5 w-5 text-[#ffffff]" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Proposta de TCC</h4>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700">Título Proposto:</label>
                            <p className="text-gray-900 mt-1 font-medium">{convite.titulo_proposto}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700">Descrição:</label>
                            <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                              {convite.descricao_proposta}
                            </p>
                          </div>
                        </div>

                        {/* Informações do Professor */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-[#2F9E41] bg-opacity-10 p-2 rounded-lg">
                              <FiUser className="h-5 w-5 text-[#ffffff]" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Informações do Professor</h4>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Nome:</label>
                              <p className="text-gray-900 mt-1">{convite.professor?.nome || "Não informado"}</p>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-700">Email:</label>
                              <p className="text-gray-900 mt-1 break-all">{convite.professor?.email || "Não informado"}</p>
                            </div>
                            
                            {convite.professor?.departamento && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Departamento:</label>
                                <p className="text-gray-900 mt-1">{convite.professor.departamento}</p>
                              </div>
                            )}
                            
                            {convite.professor?.telefone && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Telefone:</label>
                                <p className="text-gray-900 mt-1">{convite.professor.telefone}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        {convite.status === "aceito" ? (
                          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <FiCheck className="h-5 w-5 text-green-600" />
                            <span className="text-green-800 font-medium">Convite Aceito - Você agora é orientando deste professor</span>
                          </div>
                        ) : convite.status === "recusado" ? (
                          <div className="flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <FiX className="h-5 w-5 text-red-600" />
                            <span className="text-red-800 font-medium">Convite Recusado</span>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                              onClick={() => confirmarRecusar(convite.id)}
                              disabled={loading}
                              className="flex items-center justify-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                              <FiX className="h-4 w-4" />
                              Recusar Convite
                            </button>
                            
                            <button
                              onClick={() => confirmarAceitar(convite.id)}
                              disabled={loading}
                              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#2F9E41] text-white rounded-lg hover:bg-[#217a32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                              <FiCheck className="h-4 w-4" />
                              Aceitar Convite
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {confirm.open && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                confirm.action === "aceitar" ? "bg-green-100" : "bg-red-100"
              }`}>
                {confirm.action === "aceitar" ? (
                  <FiCheck className={`h-6 w-6 text-green-600`} />
                ) : (
                  <FiX className={`h-6 w-6 text-red-600`} />
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {confirm.action === "aceitar" ? "Aceitar Convite" : "Recusar Convite"}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {confirm.action === "aceitar" 
                  ? "Ao aceitar este convite, você se tornará orientando deste professor e não poderá aceitar outros convites."
                  : "Tem certeza que deseja recusar este convite? Esta ação não pode ser desfeita."
                }
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirm({ open: false, action: null, conviteId: null })}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={executarConfirmacao}
                  className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                    confirm.action === "aceitar" 
                      ? "bg-[#2F9E41] hover:bg-[#217a32]" 
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {confirm.action === "aceitar" ? "Aceitar" : "Recusar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}