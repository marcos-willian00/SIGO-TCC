import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AdminMenu from "./admin-menu";
import httpClient from "../../services/api";

export default function CursosAdmin() {
    const [cursos, setCursos] = useState([]);
    const [nome, setNome] = useState("");
    const [editId, setEditId] = useState(null);
    const [editNome, setEditNome] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Novos estados para atribuição de coordenador
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [professores, setProfessores] = useState([]);
    const [cursoSelecionado, setCursoSelecionado] = useState(null);

    // Buscar cursos da API
    async function fetchCursos() {
        try {
            const res = await httpClient.get("/admin/cursos");
            setCursos(res.data);
        } catch {
            toast.error("Erro ao buscar cursos.");
        }
    }

    // Buscar professores da API
    async function fetchProfessores() {
        try {
            const res = await httpClient.get("/admin/users/professors");
            setProfessores(res.data);
        } catch {
            toast.error("Erro ao buscar professores.");
        }
    }

    useEffect(() => {
        fetchCursos();
    }, []);

    // Cadastrar curso
    async function handleAddCurso(e) {
        e.preventDefault();
        if (!nome.trim()) return;
        try {
            await httpClient.post("/admin/cursos", { nome_curso: nome });
            toast.success("Curso cadastrado!");
            setNome("");
            setShowForm(false);
            fetchCursos();
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Erro ao cadastrar curso.");
        }
    }

    // Editar curso
    async function handleSaveEdit(e) {
        e.preventDefault();
        try {
            await httpClient.put(`/admin/cursos/${editId}`, { nome_curso: editNome });
            toast.success("Curso editado!");
            setEditId(null);
            setEditNome("");
            fetchCursos();
        } catch {
            toast.error("Erro ao editar curso.");
        }
    }

    // Excluir curso
    async function handleDeleteCurso(id) {
        try {
            await httpClient.delete(`/admin/cursos/${id}`);
            toast.success("Curso excluído!");
            fetchCursos();
        } catch {
            toast.error("Erro ao excluir curso.");
        }
    }

    function handleEditCurso(id, nomeAtual) {
        setEditId(id);
        setEditNome(nomeAtual);
    }

    // Abrir modal de atribuição e buscar professores
    function handleOpenAssignModal(curso) {
        setCursoSelecionado(curso);
        setShowAssignModal(true);
        fetchProfessores();
    }

    // Atribuir coordenador
    async function handleAssignCoordenador(professorId) {
    if (!cursoSelecionado) {
        toast.error("Selecione um curso primeiro.");
        return;
    }
    try {
        await httpClient.put(`/admin/cursos/${cursoSelecionado.id_curso}/assign-coordenador/${professorId}`);
        await fetchCursos(); // Aguarda atualizar os cursos antes de fechar o modal e mostrar o toast
        setShowAssignModal(false);
        setCursoSelecionado(null);
        toast.success("Coordenador atribuído com sucesso!");
    } catch (err) {
        toast.error(err?.response?.data?.detail || "Erro ao atribuir coordenador.");
    }
}

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminMenu />
            <div className="flex-1 ml-64 p-10">
                <h1 className="text-2xl font-bold text-[#2F9E41] mb-6">Gerenciar Cursos</h1>
                
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#2F9E41] text-white px-6 py-2 rounded hover:bg-[#217a32] transition"
                    >
                        Cadastrar Curso
                    </button>
                    <button
                        onClick={() => handleOpenAssignModal(null)}
                        className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
                    >
                        Atribuir Coordenador
                    </button>
                </div>

                {/* Modal para cadastro de curso */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4 text-[#2F9E41]">Cadastrar Curso</h2>
                            <form onSubmit={handleAddCurso} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Nome do curso"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="border rounded px-4 py-2"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); setNome(""); }}
                                        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#2F9E41] text-white px-6 py-2 rounded hover:bg-[#217a32] transition"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal para atribuir coordenador */}
                {showAssignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
                            <h2 className="text-xl font-bold mb-4 text-yellow-600">Atribuir Coordenador</h2>
                            <p className="mb-4 text-gray-700">
                                Selecione o curso e o professor que será o coordenador:
                            </p>
                            <div className="flex gap-4 mb-4">
                                <select
                                    className="border rounded px-4 py-2 flex-1"
                                    value={cursoSelecionado?.id_curso || ""}
                                    onChange={e => {
                                        const curso = cursos.find(c => c.id_curso === Number(e.target.value));
                                        setCursoSelecionado(curso);
                                    }}
                                >
                                    <option value="">Selecione o curso</option>
                                    {cursos.map(curso => (
                                        <option key={curso.id_curso} value={curso.id_curso}>
                                            {curso.nome_curso}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="max-h-64 overflow-y-auto mb-4">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b font-semibold">Professor</th>
                                            <th className="py-2 px-4 border-b font-semibold">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
    {professores.map(prof => (
        <tr key={prof.id_professor ?? prof.id}>
            <td className="py-2 px-4">{prof.nome}</td>
            <td className="py-2 px-4">
                <button
                    className="bg-[#2F9E41] text-white px-4 py-1 rounded hover:bg-[#217a32] transition"
                    onClick={() => handleAssignCoordenador(prof.id_professor ?? prof.id)}
                    disabled={!cursoSelecionado}
                >
                    Atribuir
                </button>
            </td>
        </tr>
    ))}
</tbody>
                                </table>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                                    onClick={() => { setShowAssignModal(false); setCursoSelecionado(null); }}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#2F9E41]">Cursos cadastrados</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b font-semibold">Curso</th>
                                    <th className="py-2 px-4 border-b font-semibold">Coordenador</th>
                                    <th className="py-2 px-4 border-b font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cursos.map((curso, idx) => (
                                    <tr key={curso.id_curso ?? curso.nome_curso ?? idx} className="border-b last:border-b-0">
                                        <td className="py-2 px-4">
                                            {editId === curso.id_curso ? (
                                                <form onSubmit={handleSaveEdit} className="flex flex-1 gap-2">
                                                    <input
                                                        type="text"
                                                        value={editNome}
                                                        onChange={(e) => setEditNome(e.target.value)}
                                                        className="border rounded px-2 py-1 flex-1"
                                                    />
                                                    <button type="submit" className="text-[#2F9E41] font-bold">Salvar</button>
                                                    <button type="button" onClick={() => setEditId(null)} className="text-gray-500">Cancelar</button>
                                                </form>
                                            ) : (
                                                <span>{curso.nome_curso}</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4">
                                            {curso.coordenador?.nome || "—"}
                                        </td>
                                        <td className="py-2 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditCurso(curso.id_curso, curso.nome_curso)}
                                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full"
                                                    disabled={!curso.id_curso}
                                                    title="Editar"
                                                >
                                                    {/* Ícone lápis */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-yellow-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCurso(curso.id_curso)}
                                                    className="text-red-600 hover:text-red-800 p-2 rounded-full"
                                                    disabled={!curso.id_curso}
                                                    title="Excluir"
                                                >
                                                    {/* Ícone lixeira */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleOpenAssignModal(curso)}
                                                    className="text-yellow-600 hover:text-yellow-700 p-2 rounded-full"
                                                    title="Atribuir Coordenador"
                                                >
                                                    {/* Ícone usuário/coroa */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}