import React, { useEffect, useState } from "react";
import { FiMail, FiUser, FiBookOpen, FiClock, FiCheck } from "react-icons/fi";
import ProfessorMenu from "./menu-professor";
import { toast, ToastContainer } from "react-toastify";

export default function ConvitesRecebidosProfessor() {
  const [convites, setConvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aceitando, setAceitando] = useState(null);

  useEffect(() => {
    fetchConvites();
  }, []);

  const fetchConvites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/professors/me/convites-orientacao/recebidos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401 || response.status === 403) {
        window.location.href = "/login";
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setConvites(data);
      } else {
        toast.error("Não foi possível carregar os convites.");
      }
    } catch {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleAceitarConvite = async (conviteId) => {
  setAceitando(conviteId);
  try {
    const token = localStorage.getItem("token");
    // Aceita o convite e cria o TCC
    const response = await fetch(
      `http://localhost:8000/professors/convites-orientacao/${conviteId}/aceitar`, // <-- CORRIGIDO
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      toast.success("Convite aceito e TCC criado!");
      await sincronizarKanban(conviteId);
      fetchConvites();
    } else {
      toast.error("Erro ao aceitar convite.");
    }
  } catch {
    toast.error("Erro ao conectar com o servidor.");
  } finally {
    setAceitando(null);
  }
};

  // Exemplo de função para sincronizar Kanban (ajuste conforme seu backend)
  const sincronizarKanban = async (conviteId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:8000/professors/convites-orientacao/${conviteId}/sincronizar-kanban`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Kanban de tarefas sincronizado!");
    } catch {
      toast.error("Erro ao sincronizar Kanban.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "aceito":
        return "bg-green-100 text-green-800 border-green-200";
      case "recusado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "aceito":
        return "Aceito";
      case "recusado":
        return "Recusado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfessorMenu />
      <div className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <FiMail className="text-indigo-600" /> Convites Recebidos
          </h1>
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando convites...</p>
            </div>
          ) : convites.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FiMail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum convite recebido</h3>
              <p className="text-gray-600">Você ainda não recebeu convites de orientação de alunos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {convites.map((convite) => (
                <div key={convite.id} className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiUser className="h-6 w-6 text-indigo-600" />
                      <span className="font-semibold text-gray-900">{convite.estudante?.nome || "Aluno"}</span>
                      <span className="text-sm text-gray-600">{convite.estudante?.email}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(convite.status)}`}>
                      {getStatusText(convite.status)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <FiBookOpen className="text-purple-600" />
                      <span className="font-medium text-gray-800">Título:</span>
                      <span className="text-gray-900">{convite.titulo_proposto}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <FiClock className="text-gray-500" />
                      <span className="font-medium text-gray-800">Descrição:</span>
                      <span className="text-gray-700">{convite.descricao_proposta}</span>
                    </div>
                  </div>
                  {convite.status === "pendente" && (
                    <button
                      onClick={() => handleAceitarConvite(convite.id)}
                      disabled={aceitando === convite.id}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold shadow"
                    >
                      <FiCheck />
                      {aceitando === convite.id ? "Aceitando..." : "Aceitar Convite e Criar TCC"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}