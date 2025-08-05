import ProfessorMenu from "./menu-professor";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
  FiPaperclip,
  FiEye,
  FiDownload,
} from "react-icons/fi";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";

// Modal base
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-lg w-full relative border-2 border-[#2F9E41]">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// Status conforme backend
const columns = [
  { key: "a_fazer", label: "A Fazer" },
  { key: "fazendo", label: "Fazendo" },
  { key: "revisar", label: "Revisar" },
  { key: "feita", label: "Feita" },
  { key: "concluida", label: "Concluída" },
];

export default function TarefasProfessor() {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [tccId, setTccId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("a_fazer");
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [menuTaskId, setMenuTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("a_fazer");
  const [editTaskFile, setEditTaskFile] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [addTaskError, setAddTaskError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para convite
  const [showConvite, setShowConvite] = useState(false);
  const [alunosConvite, setAlunosConvite] = useState([]);
  const [search, setSearch] = useState("");
  const [alunoSelecionadoConvite, setAlunoSelecionadoConvite] = useState(null);
  const [tituloProposto, setTituloProposto] = useState("");
  const [descricaoProposta, setDescricaoProposta] = useState("");

  // Buscar orientandos do professor
  useEffect(() => {
    async function fetchOrientandos() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:8000/professors/orientandos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAlunos(data);
        }
      } catch (err) {
        setAlunos([]);
      }
    }
    fetchOrientandos();
  }, []);

  // Modal convite: buscar todos os alunos cadastrados
  const handleAbrirConvite = async () => {
    setShowConvite(true);
    setSearch("");
    setAlunoSelecionadoConvite(null);
    setTituloProposto("");
    setDescricaoProposta("");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/professors/students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAlunosConvite(data);
      } else {
        toast.error("Não foi possível carregar os alunos.");
      }
    } catch {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Modal convite: selecionar aluno
  const handleSelecionarAlunoConvite = (alunoId) => {
    setAlunoSelecionadoConvite(alunoId);
    setTituloProposto("");
    setDescricaoProposta("");
  };

  // Modal convite: enviar convite
  const handleConvidar = async () => {
    if (
      !alunoSelecionadoConvite ||
      !tituloProposto.trim() ||
      !descricaoProposta.trim()
    ) {
      toast.error("Preencha todos os campos!");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/professors/me/convites-orientacao",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estudante_id: alunoSelecionadoConvite,
            titulo_proposto: tituloProposto,
            descricao_proposta: descricaoProposta,
          }),
        }
      );
      if (response.ok) {
        toast.success("Convite enviado!");
        setShowConvite(false);
      } else {
        const data = await response.json();
        toast.error(data.detail || "Não foi possível enviar o convite.");
      }
    } catch {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar alunos pelo nome ou email digitado (modal convite)
  const alunosFiltrados = alunosConvite.filter(
    (aluno) =>
      (aluno.nome && aluno.nome.toLowerCase().includes(search.toLowerCase())) ||
      (aluno.email && aluno.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Selecionar aluno e buscar tarefas do TCC dele
  const handleSelecionarAluno = async (aluno) => {
    setAlunoSelecionado(aluno);
    setShowNewTask(false);
    setMenuTaskId(null);
    setEditTaskId(null);
    setTasks([]);
    setTccId(null);

    const tccIdAluno = aluno.tcc?.id;
    if (tccIdAluno) {
      setTccId(tccIdAluno);
      const token = localStorage.getItem("token");
      const tarefasRes = await fetch(
        `http://localhost:8000/professors/tccs/${tccIdAluno}/tarefas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (tarefasRes.ok) {
        const tarefas = await tarefasRes.json();
        setTasks(tarefas);
      } else {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  };

  // Voltar para lista de orientandos
  const handleVoltar = () => {
    setAlunoSelecionado(null);
    setTasks([]);
    setShowNewTask(false);
    setMenuTaskId(null);
    setEditTaskId(null);
    setTccId(null);
  };

  // Drag and drop (agora salva status no backend)
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Só atualiza se mudou de coluna (status)
    if (source.droppableId !== destination.droppableId) {
      const sourceTasks = tasks
        .filter((t) => t.status === source.droppableId)
        .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));
      const movedTask = sourceTasks[source.index];

      // Atualiza status no backend
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:8000/professors/tarefas/${movedTask.id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: destination.droppableId }),
          }
        );
        if (response.ok) {
          const tarefaAtualizada = await response.json();
          setTasks(
            tasks.map((t) =>
              t.id === tarefaAtualizada.id ? tarefaAtualizada : t
            )
          );
        } else {
          toast.error("Erro ao atualizar status da tarefa.");
        }
      } catch {
        toast.error("Erro de conexão ao atualizar status.");
      }
    } else {
      // Se só mudou a ordem, atualiza localmente
      const sourceTasks = tasks
        .filter((t) => t.status === source.droppableId)
        .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));
      const newColumn = Array.from(sourceTasks);
      const [removed] = newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, removed);

      const newTasks = [];
      let i = 0;
      tasks.forEach((t) => {
        if (t.status === source.droppableId) {
          newTasks.push(newColumn[i]);
          i++;
        } else {
          newTasks.push(t);
        }
      });
      setTasks(newTasks);
    }
  };

  // Adicionar tarefa (sincronizado com backend, permite arquivo)
  const handleAddTask = async (e) => {
    e.preventDefault();
    setAddTaskError("");
    if (!newTaskTitle.trim() || !tccId) {
      setAddTaskError(
        "Selecione um aluno com TCC ativo para adicionar tarefa."
      );
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("titulo", newTaskTitle);
    formData.append("descricao", newTaskDescription);
    formData.append("status", newTaskStatus);
    if (newTaskFile) formData.append("file", newTaskFile);

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/professors/tccs/${tccId}/tarefas`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const tarefa = await response.json();
        setTasks([...tasks, tarefa]);
        setNewTaskTitle("");
        setNewTaskDescription("");
        setNewTaskStatus("a_fazer");
        setNewTaskFile(null);
        setShowNewTask(false);
        toast.success("Tarefa criada com sucesso!");
      } else {
        let errorMsg = "Erro ao adicionar tarefa.";
        try {
          const error = await response.json();
          errorMsg = error.detail || errorMsg;
        } catch {}
        setAddTaskError(errorMsg);
      }
    } catch (err) {
      setAddTaskError("Erro de conexão com o servidor.");
      console.error("Erro ao adicionar tarefa:", err);
    } finally {
      setLoading(false);
    }
  };

  // Excluir tarefa (sincronizado com backend)
  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/professors/tarefas/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok || response.status === 204) {
        setTasks(tasks.filter((t) => t.id !== id));
        setMenuTaskId(null);
        toast.success("Tarefa excluída com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Erro ao excluir tarefa.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  // Excluir arquivo específico
  const handleDeleteFile = async (arquivoId) => {
    if (!window.confirm("Tem certeza que deseja excluir este arquivo?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/professors/arquivos/${arquivoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok || response.status === 204) {
        // Atualizar a lista de tarefas para refletir a exclusão do arquivo
        if (alunoSelecionado && tccId) {
          const tarefasRes = await fetch(
            `http://localhost:8000/professors/tccs/${tccId}/tarefas`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (tarefasRes.ok) {
            const tarefas = await tarefasRes.json();
            setTasks(tarefas);
          }
        }
        toast.success("Arquivo excluído com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Erro ao excluir arquivo.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
      console.error("Erro ao excluir arquivo:", error);
    }
  };

  // Editar tarefa (sincronizado com backend, permite arquivo)
  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.titulo || "");
    setEditTaskDescription(task.descricao || "");
    setEditTaskStatus(task.status || "a_fazer");
    setEditTaskFile(null);
    setMenuTaskId(null);
  };

  const handleSaveEditTask = async (id) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("titulo", editTaskTitle);
    formData.append("descricao", editTaskDescription);
    formData.append("status", editTaskStatus);
    if (editTaskFile) formData.append("file", editTaskFile);

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/professors/tarefas/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const tarefaAtualizada = await response.json();
        setTasks(tasks.map((t) => (t.id === id ? tarefaAtualizada : t)));
        setEditTaskId(null);
        setEditTaskTitle("");
        setEditTaskDescription("");
        setEditTaskStatus("a_fazer");
        setEditTaskFile(null);
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Erro ao atualizar tarefa.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
      console.error("Erro ao atualizar tarefa:", error);
    } finally {
      setLoading(false);
    }
  };

  // Estilização do campo de upload de arquivo (usado em criação e edição)
  function FileUpload({ file, setFile }) {
    return (
      <label className="flex flex-col gap-1 text-sm text-[#2F9E41] font-semibold">
        <span className="flex items-center gap-2">
          <FiPaperclip /> Anexar arquivo
        </span>
        <div className="relative w-fit">
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.docx"
          />
          <label
            htmlFor="file-upload"
            className="bg-[#2F9E41] text-white px-4 py-2 rounded-lg shadow cursor-pointer hover:bg-[#217a32] transition font-semibold flex items-center gap-2"
          >
            <FiPaperclip /> Selecionar arquivo
          </label>
        </div>
        {file && (
          <span className="text-xs text-gray-600 mt-1 flex items-center gap-1">
            <FiPaperclip className="text-[#2F9E41]" /> {file.name}
          </span>
        )}
      </label>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <ProfessorMenu />
      <div className="flex-1 ml-64 px-4 py-8 overflow-x-hidden">
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
        {!alunoSelecionado ? (
          <div>
            <h1 className="text-3xl font-extrabold text-[#2F9E41] mb-4 ml-5 text-left drop-shadow">
              Meus Orientandos
            </h1>
            <button
              onClick={handleAbrirConvite}
              className="flex items-center gap-2 bg-[#2F9E41] text-white px-5 py-2 rounded-lg shadow hover:bg-[#217a32] transition ml-5 mb-8 font-semibold"
            >
              <FiEdit2 /> Convidar Aluno
            </button>
            <div className="flex flex-col gap-6 w-full max-w-5xl items-start ml-20">
              {alunos.map((aluno) => (
                <button
                  key={aluno.id}
                  onClick={() => handleSelecionarAluno(aluno)}
                  className={`bg-white rounded-xl shadow-lg p-6 w-full flex flex-row items-center justify-between hover:bg-[#D3FFD2] transition border-2 ${
                    aluno.tcc
                      ? "border-[#2F9E41]"
                      : "border-gray-200 opacity-70 cursor-not-allowed"
                  }`}
                  disabled={!aluno.tcc}
                  title={
                    !aluno.tcc
                      ? "O aluno ainda não aceitou o convite de orientação."
                      : ""
                  }
                >
                  <div>
                    <span className="text-xl font-bold text-[#2F9E41]">
                      {aluno.nome}
                    </span>
                    <br />
                    <span className="text-gray-500 text-sm mt-2">
                      {aluno.tcc
                        ? "Ver tarefas"
                        : "Aguardando aceite do convite"}
                    </span>
                  </div>
                  <FiChevronRight size={32} className="text-[#2F9E41]" />
                </button>
              ))}
            </div>
            {/* Modal de convite */}
            <Modal open={showConvite} onClose={() => setShowConvite(false)}>
              <div>
                <h2 className="text-2xl font-bold text-[#2F9E41] mb-4">
                  Convidar Aluno
                </h2>
                {!alunoSelecionadoConvite ? (
                  <>
                    <input
                      type="text"
                      placeholder="Pesquisar por nome ou email..."
                      className="border-2 border-[#2F9E41] rounded-lg px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-[#2F9E41] shadow-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                    <div className="max-h-64 overflow-y-auto rounded-lg border border-[#2F9E41]/10 shadow-inner bg-[#f8fff7]">
                      <table className="min-w-full text-left">
                        <thead>
                          <tr className="bg-[#2F9E41]/10">
                            <th className="py-2 px-4 border-b font-semibold text-[#2F9E41]">
                              Nome
                            </th>
                            <th className="py-2 px-4 border-b font-semibold text-[#2F9E41]">
                              Email
                            </th>
                            <th className="py-2 px-4 border-b font-semibold"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {alunosFiltrados.length === 0 ? (
                            <tr>
                              <td
                                colSpan={3}
                                className="py-4 text-center text-gray-500"
                              >
                                Nenhum aluno encontrado.
                              </td>
                            </tr>
                          ) : (
                            alunosFiltrados.map((aluno) => (
                              <tr
                                key={aluno.id}
                                className="hover:bg-[#e9ffe7] transition"
                              >
                                <td className="px-4 py-2">{aluno.nome}</td>
                                <td className="px-4 py-2">{aluno.email}</td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() =>
                                      handleSelecionarAlunoConvite(aluno.id)
                                    }
                                    className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition font-semibold shadow"
                                    disabled={loading}
                                  >
                                    Selecionar
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleConvidar();
                    }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1 text-[#2F9E41]">
                        Título do TCC
                      </label>
                      <input
                        type="text"
                        className="border-2 border-[#2F9E41] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2F9E41] shadow-sm"
                        value={tituloProposto}
                        onChange={(e) => setTituloProposto(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1 text-[#2F9E41]">
                        Descrição do TCC
                      </label>
                      <textarea
                        className="border-2 border-[#2F9E41] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2F9E41] shadow-sm"
                        value={descricaoProposta}
                        onChange={(e) => setDescricaoProposta(e.target.value)}
                        required
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="submit"
                        className="bg-[#2F9E41] text-white px-6 py-2 rounded-lg hover:bg-[#217a32] transition font-semibold shadow"
                        disabled={loading}
                      >
                        Enviar Convite
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlunoSelecionadoConvite(null)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition shadow"
                      >
                        Voltar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Modal>
            <ToastContainer theme="colored" />
          </div>
        ) : (
          <div>
            <button
              onClick={handleVoltar}
              className="mb-4 text-[#2F9E41] hover:underline font-semibold flex items-center gap-1"
            >
              <FiChevronRight className="rotate-180" /> Voltar para orientandos
            </button>
            <h2 className="text-2xl font-bold text-[#2F9E41] mb-6 text-center drop-shadow">
              Kanban de tarefas de {alunoSelecionado.nome}
            </h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowNewTask(true)}
                className="flex items-center gap-2 bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#217a32] transition font-semibold shadow"
                disabled={!tccId}
                title={
                  !tccId
                    ? "O aluno ainda não aceitou o convite de orientação."
                    : ""
                }
              >
                <FiEdit2 /> Nova Tarefa
              </button>
            </div>
            {/* Modal de criar tarefa */}
            <Modal open={showNewTask} onClose={() => setShowNewTask(false)}>
              <form onSubmit={handleAddTask}>
                <h3 className="text-xl font-bold text-[#2F9E41] mb-4">
                  Nova Tarefa
                </h3>
                {addTaskError && (
                  <div className="text-red-600 mb-2">{addTaskError}</div>
                )}
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    className="border-2 border-[#2F9E41] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Descrição da tarefa"
                    className="border-2 border-[#2F9E41] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    required
                  />
                  <select
                    className="border-2 border-[#2F9E41] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                  >
                    {columns.map((col) => (
                      <option key={col.key} value={col.key}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                  <FileUpload file={newTaskFile} setFile={setNewTaskFile} />
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      type="submit"
                      className="bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#217a32] transition font-semibold"
                      disabled={!tccId || loading}
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewTask(false);
                        setNewTaskFile(null);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </Modal>
            {/* Modal de editar tarefa */}
            <Modal
              open={editTaskId !== null}
              onClose={() => setEditTaskId(null)}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEditTask(editTaskId);
                }}
                className="flex flex-col gap-3"
              >
                <h3 className="text-xl font-bold text-[#2F9E41] mb-2">
                  Editar Tarefa
                </h3>
                <input
                  className="border-2 border-[#2F9E41] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  required
                />
                <input
                  className="border-2 border-[#2F9E41] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                  value={editTaskDescription}
                  onChange={(e) => setEditTaskDescription(e.target.value)}
                  required
                />
                <select
                  className="border-2 border-[#2F9E41] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
                  value={editTaskStatus}
                  onChange={(e) => setEditTaskStatus(e.target.value)}
                >
                  {columns.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                </select>

                {/* Mostrar arquivos existentes */}
                {editTaskId &&
                  tasks.find((t) => t.id === editTaskId)?.arquivos &&
                  tasks.find((t) => t.id === editTaskId).arquivos.length >
                    0 && (
                    <div className="mb-4">
                      <div className="font-semibold text-[#2F9E41] mb-2 flex items-center gap-1">
                        <FiPaperclip /> Arquivos anexados:
                      </div>
                      <div className="flex flex-col gap-2">
                        {tasks
                          .find((t) => t.id === editTaskId)
                          .arquivos.map((arq) => (
                            <div
                              key={arq.id}
                              className="flex items-center gap-2 bg-[#e9ffe7] border border-[#2F9E41]/30 rounded-lg px-3 py-2 shadow-sm"
                            >
                              <FiPaperclip className="text-[#2F9E41]" />
                              <span className="text-sm font-medium text-gray-700 truncate flex-1">
                                {arq.nome_arquivo}
                              </span>
                              <a
                                href={`http://localhost:8000/${arq.caminho_arquivo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 bg-[#2F9E41] text-white px-2 py-1 rounded hover:bg-[#217a32] text-xs font-semibold transition"
                                title="Visualizar arquivo"
                              >
                                <FiEye /> Ver
                              </a>
                              <a
                                href={`http://localhost:8000/${arq.caminho_arquivo}`}
                                download={arq.nome_arquivo}
                                className="flex items-center gap-1 bg-[#217a32] text-white px-2 py-1 rounded hover:bg-[#2F9E41] text-xs font-semibold transition"
                                title="Baixar arquivo"
                              >
                                <FiDownload /> Baixar
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteFile(arq.id)}
                                className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs font-semibold transition"
                                title="Excluir arquivo"
                              >
                                <FiTrash2 /> Excluir
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                <FileUpload file={editTaskFile} setFile={setEditTaskFile} />
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="submit"
                    className="bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#217a32] transition font-semibold"
                    disabled={loading}
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTaskId(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </Modal>
            {/* Modal de descrição da tarefa */}
            <Modal
              open={expandedTaskId !== null}
              onClose={() => setExpandedTaskId(null)}
            >
              {tasks.find((t) => t.id === expandedTaskId) && (
                <div>
                  <h3 className="text-xl font-bold text-[#2F9E41] mb-2">
                    Descrição da Tarefa
                  </h3>
                  <div className="text-gray-700 mb-4">
                    {tasks.find((t) => t.id === expandedTaskId).descricao ||
                      "Sem descrição"}
                  </div>
                  {/* Arquivos anexados na modal de descrição */}
                  {tasks.find((t) => t.id === expandedTaskId).arquivos &&
                    tasks.find((t) => t.id === expandedTaskId).arquivos.length >
                      0 && (
                      <div className="mb-4">
                        <div className="font-semibold text-[#2F9E41] mb-1 flex items-center gap-1">
                          <FiPaperclip /> Arquivos anexados:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tasks
                            .find((t) => t.id === expandedTaskId)
                            .arquivos.map((arq) => (
                              <div
                                key={arq.id}
                                className="flex items-center gap-2 bg-[#e9ffe7] border border-[#2F9E41]/30 rounded-lg px-3 py-2 shadow-sm"
                              >
                                <FiPaperclip className="text-[#2F9E41]" />
                                <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                                  {arq.nome_arquivo}
                                </span>
                                <a
                                  href={`http://localhost:8000/${arq.caminho_arquivo}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 bg-[#2F9E41] text-white px-2 py-1 rounded hover:bg-[#217a32] text-xs font-semibold transition"
                                  title="Visualizar arquivo"
                                >
                                  <FiEye /> Ver
                                </a>
                                <a
                                  href={`http://localhost:8000/${arq.caminho_arquivo}`}
                                  download={arq.nome_arquivo}
                                  className="flex items-center gap-1 bg-[#217a32] text-white px-2 py-1 rounded hover:bg-[#2F9E41] text-xs font-semibold transition"
                                  title="Baixar arquivo"
                                >
                                  <FiDownload /> Baixar
                                </a>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  <button
                    className="bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#217a32] transition font-semibold"
                    // onClick={() => setExpandedTaskId(null)}
                  >
                    Fechar
                  </button>
                </div>
              )}
            </Modal>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 justify-center items-start overflow-x-auto pb-4">
                {columns.map((col) => {
                  const columnTasks = tasks
                    .filter((t) => t.status === col.key)
                    .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));
                  return (
                    <Droppable droppableId={col.key} key={col.key}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`bg-white rounded-2xl shadow-xl min-w-[210px] max-w-xs flex flex-col transition-all h-full border-2 ${
                            snapshot.isDraggingOver
                              ? "bg-green-50 border-[#2F9E41]"
                              : "border-gray-200"
                          }`}
                        >
                          <div
                            className={`p-4 font-bold text-lg text-center border-b ${
                              col.key === "a_fazer"
                                ? "text-red-600"
                                : col.key === "fazendo"
                                ? "text-yellow-600"
                                : col.key === "revisar"
                                ? "text-blue-600"
                                : col.key === "feita"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {col.label}
                          </div>
                          <div className="flex-1 p-2 space-y-3 min-h-[60px]">
                            {columnTasks.map((task, idx) => (
                              <Draggable
                                draggableId={task.id.toString()}
                                index={idx}
                                key={task.id}
                              >
                                {(provided, snapshot) => (
                                  <div key={task.id}>
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-gray-100 rounded-xl p-3 shadow flex flex-col gap-2 relative border ${
                                        snapshot.isDragging
                                          ? "ring-2 ring-green-400 border-[#2F9E41]"
                                          : "border-gray-200"
                                      } hover:bg-green-50 transition`}
                                      style={provided.draggableProps.style}
                                      // onClick={() => setExpandedTaskId(task.id)}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                          {task.titulo || task.title}
                                        </span>
                                        <button
                                          className="ml-2 p-1 rounded hover:bg-gray-200"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuTaskId(
                                              menuTaskId === task.id
                                                ? null
                                                : task.id
                                            );
                                          }}
                                          tabIndex={0}
                                          type="button"
                                        >
                                          <FiMoreVertical size={18} />
                                        </button>
                                        {menuTaskId === task.id && (
                                          <div className="absolute right-2 top-8 z-10 bg-white border rounded shadow flex flex-col min-w-[120px]">
                                            <button
                                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditTask(task);
                                              }}
                                            >
                                              <FiEdit2 /> Editar
                                            </button>
                                            <button
                                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task.id);
                                              }}
                                            >
                                              <FiTrash2 /> Excluir
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-xs text-gray-500 mt-1">
                                        Criada em:{" "}
                                        {dayjs(
                                          task.createdAt || task.created_at
                                        ).isValid()
                                          ? dayjs(
                                              task.createdAt || task.created_at
                                            ).format("DD/MM/YYYY HH:mm")
                                          : "Data inválida"}
                                      </span>
                                      {/* Arquivos da tarefa */}
                                      {task.arquivos &&
                                        task.arquivos.length > 0 && (
                                          <div className="mt-2">
                                            <div className="font-semibold text-[#2F9E41] mb-1 flex items-center gap-1">
                                              <FiPaperclip /> Arquivos anexados:
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              {task.arquivos.map((arq) => (
                                                <div
                                                  key={arq.id}
                                                  className="flex items-center gap-2 bg-[#e9ffe7] border border-[#2F9E41]/30 rounded-lg px-3 py-2 shadow-sm"
                                                >
                                                  <FiPaperclip className="text-[#2F9E41]" />
                                                  <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                                                    {arq.nome_arquivo}
                                                  </span>
                                                  <a
                                                    href={`http://localhost:8000/${arq.caminho_arquivo}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 bg-[#2F9E41] text-white px-2 py-1 rounded hover:bg-[#217a32] text-xs font-semibold transition"
                                                    title="Visualizar arquivo"
                                                  >
                                                    <FiEye />
                                                  </a>
                                                  <a
                                                    href={`http://localhost:8000/${arq.caminho_arquivo}`}
                                                    download={arq.nome_arquivo}
                                                    className="flex items-center gap-1 bg-[#217a32] text-white px-2 py-1 rounded hover:bg-[#2F9E41] text-xs font-semibold transition"
                                                    title="Baixar arquivo"
                                                  >
                                                    <FiDownload />
                                                  </a>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {columnTasks.length === 0 && (
                              <div className="text-gray-400 text-center text-sm">
                                Sem tarefas
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </DragDropContext>
          </div>
        )}
        {/* ToastContainer removido daqui, agora global acima */}
      </div>
    </div>
  );
}
