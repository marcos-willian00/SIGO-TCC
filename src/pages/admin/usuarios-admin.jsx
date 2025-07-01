import { useEffect, useState } from "react";
import AdminMenu from "./admin-menu";
import httpClient from "../../services/api";

export default function UsuariosAdmin() {
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "editar" | "arquivar" | "excluir"
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Junta todos os usuários para pesquisa
  const allUsers = [
    ...alunos.map(a => ({ ...a, tipo: "Aluno" })),
    ...professores.map(p => ({
      ...p,
      tipo: p.role === "COORDENADOR" ? "Coordenador" : "Professor"
    })),
  ];

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      try {
        const [alunosRes, profsRes] = await Promise.all([
          httpClient.get("/admin/users/students"),
          httpClient.get("/admin/users/professors"),
        ]);
        setAlunos(alunosRes.data);
        setProfessores(profsRes.data);
      } catch {
        // Trate erros conforme necessário
      }
      setLoading(false);
    }
    fetchUsuarios();
  }, []);

  // Filtra usuários conforme pesquisa
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      allUsers.filter(
        u =>
          u.nome.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, alunos, professores]);

  // Abre modal para ação
  function openModal(action) {
    setModalAction(action);
    setShowModal(true);
    setSearchTerm("");
    setFilteredUsers([]);
  }

  // Fecha modal
  function closeModal() {
    setShowModal(false);
    setModalAction("");
    setSearchTerm("");
    setFilteredUsers([]);
  }

  // Placeholder para ações
  function handleUserAction(user) {
    alert(`Ação: ${modalAction}\nUsuário: ${user.nome} (${user.tipo})`);
    closeModal();
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenu />
      <div className="flex-1 ml-64 p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2F9E41]">Gerenciar Usuários</h1>
          <div className="flex gap-2">

            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              onClick={() => openModal("arquivar")}
            >
              Arquivar Usuário
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={() => openModal("excluir")}
            >
              Excluir Usuário
            </button>
          </div>
        </div>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className="flex gap-8">
            {/* Tabela de Alunos */}
            <div className="bg-white rounded shadow p-6 flex-1">
              <h2 className="text-xl font-semibold mb-4 text-[#2F9E41]">Alunos</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b font-semibold">Nome</th>
                      <th className="py-2 px-4 border-b font-semibold">E-mail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map((aluno) => (
                      <tr key={`aluno-${aluno.id_estudante || aluno.id}`}>
                        <td className="py-2 px-4">{aluno.nome}</td>
                        <td className="py-2 px-4">{aluno.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {alunos.length === 0 && (
                  <div className="text-gray-500 mt-4">Nenhum aluno encontrado.</div>
                )}
              </div>
            </div>
            {/* Tabela de Professores/Coordenadores */}
            <div className="bg-white rounded shadow p-6 flex-1">
              <h2 className="text-xl font-semibold mb-4 text-[#2F9E41]">Professores e Coordenadores</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b font-semibold">Nome</th>
                      <th className="py-2 px-4 border-b font-semibold">E-mail</th>
                      <th className="py-2 px-4 border-b font-semibold">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professores.map((prof) => (
                      <tr key={`prof-${prof.id_professor || prof.id}`}>
                        <td className="py-2 px-4">{prof.nome}</td>
                        <td className="py-2 px-4">{prof.email}</td>
                        <td className="py-2 px-4">
                          {prof.role === "COORDENADOR" ? "Coordenador" : "Professor"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {professores.length === 0 && (
                  <div className="text-gray-500 mt-4">Nenhum professor encontrado.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de ação */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4 text-[#2F9E41] capitalize">
                {modalAction} usuário
              </h2>
              <input
                type="text"
                className="border rounded px-4 py-2 w-full mb-4"
                placeholder="Pesquise pelo nome ou e-mail do usuário"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <div className="max-h-60 overflow-y-auto border rounded mb-4">
                  {filteredUsers.length === 0 ? (
                    <div className="p-4 text-gray-500">Nenhum usuário encontrado.</div>
                  ) : (
                    <ul>
                      {filteredUsers.map(user => (
                        <li
                          key={`${user.tipo}-${user.id_estudante || user.id_professor || user.id}`}
                          className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <span>
                            <span className="font-semibold">{user.nome}</span> <span className="text-gray-500">({user.tipo})</span>
                            <br />
                            <span className="text-xs text-gray-500">{user.email}</span>
                          </span>
                          <button
                            className={`ml-4 px-3 py-1 rounded text-white ${
                              modalAction === "editar"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : modalAction === "arquivar"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                            onClick={() => handleUserAction(user)}
                          >
                            {modalAction.charAt(0).toUpperCase() + modalAction.slice(1)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                  onClick={closeModal}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
);
}