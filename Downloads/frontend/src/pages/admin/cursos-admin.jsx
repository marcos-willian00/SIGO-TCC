import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AdminMenu from "./admin-menu";
import httpClient from "../../services/api";
import { 
  FiBook, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiUser, 
  FiSearch, 
  FiUsers, 
  FiX,
  FiCheck,
  FiUserCheck
} from "react-icons/fi";

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
            const response = await httpClient.put(`/admin/cursos/${cursoSelecionado.id_curso}/assign-coordenador/${professorId}`);
            console.log("Resposta da atribuição:", response.data);
            
            await fetchCursos();
            setShowAssignModal(false);
            setCursoSelecionado(null);
            toast.success("Coordenador atribuído com sucesso!");
        } catch (err) {
            console.error("Erro ao atribuir coordenador:", err);
            console.error("Resposta do erro:", err?.response);
            
            // Mesmo se der erro, tentar atualizar a lista para ver se funcionou
            await fetchCursos();
            
            const errorMessage = err?.response?.data?.detail || err?.message || "Erro ao atribuir coordenador.";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminMenu />
            <div className="flex-1 ml-64">
                <div className="min-h-screen bg-gray-100 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#2F9E41] bg-opacity-10 p-2 rounded-lg">
                                        <FiBook className="h-8 w-8 text-[#2F9E41]" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Cursos</h1>
                                        <p className="text-gray-600">Administre os cursos e seus coordenadores</p>
                                    </div>
                                </div>
                                
                                {/* Estatísticas */}
                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-[#2F9E41]">{cursos.length}</p>
                                        <p className="text-sm text-gray-600">Total de Cursos</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-[#2F9E41]">
                                            {cursos.filter(c => c.coordenador).length}
                                        </p>
                                        <p className="text-sm text-gray-600">Com Coordenador</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-orange-500">
                                            {cursos.filter(c => !c.coordenador).length}
                                        </p>
                                        <p className="text-sm text-gray-600">Sem Coordenador</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="bg-gradient-to-r from-[#2F9E41] to-[#217a32] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                    >
                                        <FiPlus className="h-4 w-4" />
                                        Cadastrar Curso
                                    </button>
                                    <button
                                        onClick={() => handleOpenAssignModal(null)}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                    >
                                        <FiUserCheck className="h-4 w-4" />
                                        Atribuir Coordenador
                                    </button>
                                </div>
                            </div>
                        </div>

                {/* Modal para cadastro de curso */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                            <div className="bg-gradient-to-r from-[#2F9E41] to-[#217a32] px-6 py-4 rounded-t-lg">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <FiPlus className="h-5 w-5" />
                                    Cadastrar Curso
                                </h2>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleAddCurso} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome do Curso *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Digite o nome do curso"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F9E41] focus:border-[#2F9E41]"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setShowForm(false); setNome(""); }}
                                            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-[#2F9E41] text-white rounded-lg hover:bg-[#217a32] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FiCheck className="h-4 w-4" />
                                            Salvar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para atribuir coordenador */}
                {showAssignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <FiUserCheck className="h-5 w-5" />
                                    Atribuir Coordenador
                                </h2>
                            </div>
                            <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
                                <p className="text-gray-600 mb-6">
                                    Selecione o curso e o professor que será o coordenador:
                                </p>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Curso *
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Professores Disponíveis
                                    </label>
                                    <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                                        {professores.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500">
                                                Nenhum professor encontrado
                                            </div>
                                        ) : (
                                            professores.map(prof => (
                                                <div key={prof.id_professor ?? prof.id} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-2">
                                                            <FiUser className="h-4 w-4 text-white" />
                                                        </div>
                                                        <span className="font-medium text-gray-900">{prof.nome}</span>
                                                    </div>
                                                    <button
                                                        className="bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#217a32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        onClick={() => handleAssignCoordenador(prof.id_professor ?? prof.id)}
                                                        disabled={!cursoSelecionado}
                                                    >
                                                        <FiUserCheck className="h-4 w-4" />
                                                        Atribuir
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end">
                                <button
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    onClick={() => { setShowAssignModal(false); setCursoSelecionado(null); }}
                                >
                                    <FiX className="h-4 w-4" />
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Cursos */}
                <div className="space-y-4">
                    {cursos.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            <div className="text-center">
                                <FiBook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso cadastrado</h3>
                                <p className="text-gray-600 mb-4">
                                    Comece cadastrando o primeiro curso da instituição.
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-gradient-to-r from-[#2F9E41] to-[#217a32] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
                                >
                                    <FiPlus className="h-4 w-4" />
                                    Cadastrar Primeiro Curso
                                </button>
                            </div>
                        </div>
                    ) : (
                        cursos.map((curso, idx) => (
                            <div key={curso.id_curso ?? curso.nome_curso ?? idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gradient-to-r from-[#2F9E41] to-[#217a32] rounded-full p-3">
                                                <FiBook className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                {editId === curso.id_curso ? (
                                                    <form onSubmit={handleSaveEdit} className="flex items-center gap-3">
                                                        <input
                                                            type="text"
                                                            value={editNome}
                                                            onChange={(e) => setEditNome(e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F9E41] focus:border-[#2F9E41] flex-1"
                                                        />
                                                        <button 
                                                            type="submit" 
                                                            className="p-2 text-[#2F9E41] hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Salvar"
                                                        >
                                                            <FiCheck className="h-5 w-5" />
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setEditId(null)} 
                                                            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                                                            title="Cancelar"
                                                        >
                                                            <FiX className="h-5 w-5" />
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{curso.nome_curso}</h3>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                                                <FiUser className="h-3 w-3" />
                                                                Coordenador: {curso.coordenador?.nome || "Não atribuído"}
                                                            </span>
                                                            {curso.coordenador ? (
                                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                                    Com Coordenador
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                                                    Sem Coordenador
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditCurso(curso.id_curso, curso.nome_curso)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                disabled={!curso.id_curso || editId === curso.id_curso}
                                                title="Editar curso"
                                            >
                                                <FiEdit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenAssignModal(curso)}
                                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                disabled={!curso.id_curso}
                                                title="Atribuir coordenador"
                                            >
                                                <FiUserCheck className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCurso(curso.id_curso)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                disabled={!curso.id_curso}
                                                title="Excluir curso"
                                            >
                                                <FiTrash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}