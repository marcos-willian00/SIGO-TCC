import { useEffect, useState } from "react";
import ProfessorMenu from "./menu-professor";
import { ToastContainer, toast } from "react-toastify";

export default function OrientandosProfessor() {
  const [orientandos, setOrientandos] = useState([]);
  const [showConvite, setShowConvite] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar orientandos do professor
  useEffect(() => {
    async function fetchOrientandos() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/professor/orientandos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOrientandos(data);
        } else {
          toast.error("Não foi possível carregar os orientandos.");
        }
      } catch {
        toast.error("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrientandos();
  }, []);

  // Buscar todos os alunos cadastrados
  const handleAbrirConvite = async () => {
    setShowConvite(true);
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/professor/alunos-disponiveis", {
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

  // Enviar convite para aluno ser orientado
  const handleConvidar = async (alunoId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/professor/convidar-aluno/${alunoId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Convite enviado!");
      } else {
        toast.error("Não foi possível enviar o convite.");
      }
    } catch {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfessorMenu />
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold text-[#2F9E41] mb-6">Meus Orientandos</h1>
        <div className="bg-white rounded shadow p-6 mb-6">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b font-semibold">Nome</th>
                <th className="py-2 px-4 border-b font-semibold">Email</th>
                <th className="py-2 px-4 border-b font-semibold">Matrícula</th>
                <th className="py-2 px-4 border-b font-semibold">Turma</th>
              </tr>
            </thead>
            <tbody>
              {orientandos.map((aluno) => (
                <tr key={aluno.id}>
                  <td className="py-2 px-4">{aluno.nome}</td>
                  <td className="py-2 px-4">{aluno.email}</td>
                  <td className="py-2 px-4">{aluno.matricula}</td>
                  <td className="py-2 px-4">{aluno.turma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handleAbrirConvite}
          className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32] transition mb-4"
        >
          Convidar Aluno
        </button>

        {showConvite && (
          <div className="bg-white rounded shadow p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">Alunos Cadastrados</h2>
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b font-semibold">Nome</th>
                  <th className="py-2 px-4 border-b font-semibold">Email</th>
                  <th className="py-2 px-4 border-b font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td className="py-2 px-4">{aluno.nome}</td>
                    <td className="py-2 px-4">{aluno.email}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleConvidar(aluno.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Convidar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}