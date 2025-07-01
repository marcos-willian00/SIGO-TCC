import ProfessorMenu from "./menu-professor";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiMoreVertical, FiEdit2, FiTrash2, FiChevronRight } from "react-icons/fi";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";

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
  const [menuTaskId, setMenuTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [addTaskError, setAddTaskError] = useState("");

  // Estados para convite
  const [showConvite, setShowConvite] = useState(false);
  const [alunosConvite, setAlunosConvite] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [alunoSelecionadoConvite, setAlunoSelecionadoConvite] = useState(null);
  const [tituloProposto, setTituloProposto] = useState("");
  const [descricaoProposta, setDescricaoProposta] = useState("");

  // Buscar orientandos do professor
  useEffect(() => {
    async function fetchOrientandos() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8000/professors/orientandos", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      const response = await fetch("http://localhost:8000/professors/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    if (!alunoSelecionadoConvite || !tituloProposto.trim() || !descricaoProposta.trim()) {
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
            descricao_proposta: descricaoProposta
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

  // ...restante do seu código (handleSelecionarAluno, handleVoltar, handleAddTask, etc)...

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfessorMenu />
      <div className="flex-1 ml-64 px-4 py-8 overflow-x-auto">
        {!alunoSelecionado ? (
          <div>
            <h1 className="text-2xl font-bold text-[#2F9E41] mb-2 ml-5 text-left">
              Meus Orientandos
            </h1>
            {/* Botão de convite logo abaixo do título */}
            <button
              onClick={handleAbrirConvite}
              className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32] transition ml-5 mb-8"
            >
              Convidar Aluno
            </button>
            
            <div className="flex flex-col gap-6 w-full max-w-5xl items-start ml-20">
              {alunos.map((aluno) => (
                <button
                  key={aluno.id}
                  onClick={() => handleSelecionarAluno(aluno)}
                  className="bg-white rounded-lg shadow p-6 w-full flex flex-row items-center justify-between hover:bg-[#D3FFD2] transition"
                  disabled={!aluno.tcc_id}
                  title={!aluno.tcc_id ? "O aluno ainda não aceitou o convite de orientação." : ""}
                >
                  <div>
                    <span className="text-lg font-bold text-[#2F9E41]">{aluno.nome}</span>
                    <br />
                    <span className="text-gray-500 text-sm mt-2">
                      {aluno.tcc_id ? "Ver tarefas" : "Aguardando aceite do convite"}
                    </span>
                  </div>
                  <FiChevronRight size={28} className="text-[#2F9E41]" />
                </button>
              ))}
            </div>
            {/* Modal de convite */}
            {showConvite && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative z-[101] border-2 border-[#2F9E41] animate-fade-in">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#2F9E41] text-3xl font-bold transition"
                    onClick={() => setShowConvite(false)}
                    aria-label="Fechar"
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-bold text-[#2F9E41] mb-6 text-center flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-8 bg-[#2F9E41] rounded-full mr-2"></span>
                    Convidar Aluno
                  </h2>
                  {!alunoSelecionadoConvite ? (
                    <>
                      <input
                        type="text"
                        placeholder="Pesquisar por nome ou email..."
                        className="border-2 border-[#2F9E41] rounded-lg px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-[#2F9E41] transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                      />
                      <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 shadow-inner bg-gray-50">
                        <table className="min-w-full text-left">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b font-semibold text-[#2F9E41]">Nome</th>
                              <th className="py-2 px-4 border-b font-semibold text-[#2F9E41]">Email</th>
                              <th className="py-2 px-4 border-b font-semibold"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {alunosFiltrados.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="py-4 text-center text-gray-400">
                                  Nenhum aluno encontrado.
                                </td>
                              </tr>
                            ) : (
                              alunosFiltrados.map((aluno) => (
                                <tr key={aluno.id} className="hover:bg-[#e8fbe7] transition">
                                  <td className="py-2 px-4">{aluno.nome}</td>
                                  <td className="py-2 px-4">{aluno.email}</td>
                                  <td className="py-2 px-4">
                                    <button
                                      onClick={() => handleSelecionarAlunoConvite(aluno.id)}
                                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg font-semibold shadow transition"
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
                      onSubmit={e => {
                        e.preventDefault();
                        handleConvidar();
                      }}
                      className="space-y-4"
                    >
                      <div className="mb-2">
                        <label className="block text-sm font-semibold text-[#2F9E41] mb-1">
                          Título do TCC
                        </label>
                        <input
                          type="text"
                          className="border-2 border-[#2F9E41] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2F9E41] transition"
                          value={tituloProposto}
                          onChange={e => setTituloProposto(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-semibold text-[#2F9E41] mb-1">
                          Descrição do TCC
                        </label>
                        <textarea
                          className="border-2 border-[#2F9E41] rounded-lg px-4 py-2 w-full min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#2F9E41] transition resize-none"
                          value={descricaoProposta}
                          onChange={e => setDescricaoProposta(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex gap-3 justify-end mt-6">
                        <button
                          type="submit"
                          className="bg-[#2F9E41] hover:bg-[#217a32] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                          disabled={loading}
                        >
                          Enviar Convite
                        </button>
                        <button
                          type="button"
                          onClick={() => setAlunoSelecionadoConvite(null)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow transition"
                        >
                          Voltar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
            <ToastContainer />
          </div>
        ) : (
          // ...restante do seu Kanban...
          <div>
            <button
              onClick={handleVoltar}
              className="mb-4 text-[#2F9E41] hover:underline font-semibold"
            >
              ← Voltar para orientandos
            </button>
            <h2 className="text-xl font-bold text-[#2F9E41] mb-6 text-center">
              Kanban de tarefas de {alunoSelecionado.nome}
            </h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowNewTask(true)}
                className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32] transition"
                disabled={!tccId}
                title={!tccId ? "O aluno ainda não aceitou o convite de orientação." : ""}
              >
                + Nova Tarefa
              </button>
            </div>
            {showNewTask && (
              <form
                onSubmit={handleAddTask}
                className="bg-white rounded shadow p-4 mb-6 max-w-xl mx-auto"
              >
                {addTaskError && (
                  <div className="text-red-600 mb-2">{addTaskError}</div>
                )}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    className="border rounded px-3 py-2 flex-1 min-w-0"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Descrição da tarefa"
                    className="border rounded px-3 py-2 flex-1 min-w-0"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    required
                  />
                  <select
                    className="border rounded px-3 py-2 flex-1 min-w-0"
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                  >
                    {columns.map((col) => (
                      <option key={col.key} value={col.key}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="submit"
                      className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32] transition"
                      disabled={!tccId}
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTask(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            )}
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
                          className={`bg-white rounded-lg shadow-md min-w-[250px] max-w-xs flex flex-col transition-all h-full ${
                            snapshot.isDraggingOver ? "bg-green-50" : ""
                          }`}
                        >
                          <div
                            className={`p-4 font-bold text-lg text-center ${
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
                              <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                                {(provided, snapshot) => (
                                  <div key={task.id}>
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-gray-100 rounded p-3 shadow flex flex-col gap-2 relative ${
                                        snapshot.isDragging ? "ring-2 ring-green-400" : ""
                                      }`}
                                      style={provided.draggableProps.style}
                                      onClick={() =>
                                        setExpandedTaskId(
                                          expandedTaskId === task.id ? null : task.id
                                        )
                                      }
                                    >
                                      <div className="flex items-center justify-between">
                                        {editTaskId === task.id ? (
                                          <input
                                            className="border rounded px-2 py-1 flex-1 mr-2"
                                            value={editTaskTitle}
                                            onChange={(e) => setEditTaskTitle(e.target.value)}
                                            onBlur={() => handleSaveEditTask(task.id)}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") handleSaveEditTask(task.id);
                                            }}
                                            autoFocus
                                          />
                                        ) : (
                                          <span className="font-medium">{task.titulo || task.title}</span>
                                        )}
                                        <button
                                          className="ml-2 p-1 rounded hover:bg-gray-200"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuTaskId(menuTaskId === task.id ? null : task.id);
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
                                              onClick={() => handleEditTask(task.id, task.titulo || task.title)}
                                            >
                                              <FiEdit2 /> Editar
                                            </button>
                                            <button
                                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
                                              onClick={() => handleDeleteTask(task.id)}
                                            >
                                              <FiTrash2 /> Excluir
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-xs text-gray-500 mt-1">
                                        Criada em: {dayjs(task.createdAt || task.created_at).isValid()
                                          ? dayjs(task.createdAt || task.created_at).format("DD/MM/YYYY HH:mm")
                                          : "Data inválida"}
                                      </span>
                                    </div>
                                    {/* Modalzinho embaixo do card para descrição */}
                                    {expandedTaskId === task.id && (
                                      <div className="bg-white border rounded shadow p-3 mt-2">
                                        <div className="font-semibold mb-1 text-[#2F9E41]">Descrição:</div>
                                        <div className="text-gray-700">{task.descricao || task.description || "Sem descrição"}</div>
                                        <button
                                          className="mt-2 text-sm text-[#2F9E41] hover:underline"
                                          onClick={() => setExpandedTaskId(null)}
                                        >
                                          Fechar
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {columnTasks.length === 0 && (
                              <div className="text-gray-400 text-center text-sm">Sem tarefas</div>
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
</div>
    </div>
  );
}