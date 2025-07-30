import { useEffect, useState } from "react";
import AlunoMenu from "./aluno-menu";
import { ToastContainer, toast } from "react-toastify";

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
      <div className="flex-1 ml-64 px-4 py-8">
        <h2 className="text-xl font-bold text-[#2F9E41] mb-6 text-center">
          Convites de Orientação
        </h2>
        <div className="bg-white rounded shadow p-6">
          {convites.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum convite recebido.</p>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b font-semibold">Professor</th>
                  <th className="py-2 px-4 border-b font-semibold">Título</th>
                  <th className="py-2 px-4 border-b font-semibold">Descrição</th>
                  <th className="py-2 px-4 border-b font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {convites.map((convite) => (
                  <tr key={convite.id}>
                    <td className="py-2 px-4">{convite.professor?.nome || "Professor"}</td>
                    <td className="py-2 px-4">{convite.titulo_proposto}</td>
                    <td className="py-2 px-4">{convite.descricao_proposta}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => confirmarAceitar(convite.id)}
                        className="bg-[#2F9E41] text-white px-3 py-1 rounded hover:bg-[#217a32] transition"
                        disabled={loading}
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => confirmarRecusar(convite.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        disabled={loading}
                      >
                        Recusar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Popup de confirmação */}
        {confirm.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded shadow-lg p-8 max-w-sm w-full text-center">
              <p className="mb-6 text-lg">
                Tem certeza que deseja {confirm.action === "aceitar" ? "aceitar" : "recusar"} este convite?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={executarConfirmacao}
                  className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32] transition"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirm({ open: false, action: null, conviteId: null })}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}