import { useEffect, useState } from "react";
import AlunoMenu from "./aluno-menu";
import { ToastContainer, toast } from "react-toastify";
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

  useEffect(() => {
    async function fetchConvites() {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/students/me/convites-orientacao", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setConvites(data);
      }
      setLoading(false);
    }
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
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8000/students/me/convites-orientacao/${conviteId}/responder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "status": "aceito" })
      }
    );
    if (response.ok) {
      toast.success("Convite aceito! Agora você é orientando deste professor.");
      setConvites(convites.filter((c) => c.id !== conviteId));
      // Aqui você pode atualizar o acesso do aluno, se necessário
    } else {
      const data = await response.json();
      toast.error(data.detail || "Erro ao aceitar convite.");
    }
    setLoading(false);
  };

  // Recusar convite
  const handleRecusar = async (conviteId) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8000/students/me/convites-orientacao/${conviteId}/responder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "status": "recusado" }),
      }
    );
    if (response.ok) {
      toast.success("Convite recusado.");
      setConvites(convites.filter((c) => c.id !== conviteId));
    } else {
      const data = await response.json();
      toast.error(data.detail || "Erro ao recusar convite.");
    }
    setLoading(false);
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
                <div className="bg-[#2F9E41] bg-opacity-10 p-2 rounded-lg">
                  <FiMail className="h-8 w-8 text-[#2F9E41]" />
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
                  <p className="text-sm text-gray-600">Convites Pendentes</p>
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
                    <div className="bg-gradient-to-r from-[#2F9E41] to-[#217a32] px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white bg-opacity-20 rounded-full p-2">
                            <FiUser className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {convite.professor?.nome || "Professor"}
                            </h3>
                            <p className="text-green-100 text-sm">
                              {convite.professor?.departamento && `${convite.professor.departamento} • `}
                              {convite.professor?.titulacao || "Professor"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                          <FiClock className="h-4 w-4 text-white" />
                          <span className="text-white text-sm">Pendente</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Proposta de TCC */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FiBook className="h-5 w-5 text-[#2F9E41]" />
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
                          <div className="flex items-center gap-2 mb-3">
                            <FiUser className="h-5 w-5 text-[#2F9E41]" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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