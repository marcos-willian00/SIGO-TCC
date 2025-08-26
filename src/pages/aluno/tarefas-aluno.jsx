
// @ts-nocheck
import AlunoMenu from "./aluno-menu";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";
import { FiPaperclip, FiDownload } from "react-icons/fi";

// Ajuste os status para bater com o backend, se necessário
const columns = [
  { key: "a_fazer", label: "A Fazer" },
  { key: "fazendo", label: "Fazendo" },
  { key: "revisar", label: "Revisar" },
  { key: "feita", label: "Feita" },
  { key: "concluida", label: "Concluída" },
];

export default function KanbanAluno() {
  const [tasks, setTasks] = useState([]);
  const [uploadingTaskId, setUploadingTaskId] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [novoComentario, setNovoComentario] = useState("");
  const pollingRef = useRef();

  // Função helper para construir URLs de arquivos
  const getFileUrl = (caminhoArquivo) => {
    return `http://localhost:8000/${caminhoArquivo}`;
  };

  // Função para buscar tarefas do backend
  const fetchTarefas = async () => {
    const token = localStorage.getItem("token");
    let tccId = localStorage.getItem("tcc_id");
    if (!tccId && token) {
      const res = await fetch("http://localhost:8000/students/me/tcc", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const tcc = await res.json();
        if (tcc && tcc.id) {
          tccId = tcc.id;
          localStorage.setItem("tcc_id", tccId);
        }
      }
    }
    if (!tccId) return;
    const response = await fetch(`http://localhost:8000/tccs/${tccId}/tarefas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTarefas();
    pollingRef.current = setInterval(fetchTarefas, 5000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceTasks = tasks
        .filter((t) => t.status === source.droppableId)
        .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));
      const tarefa = sourceTasks[source.index];
      const tarefaId = tarefa.id;
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/tarefas/${tarefaId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: destination.droppableId }),
      });
      fetchTarefas();
    }
  };

  const handleSaveFile = async () => {
    if (!fileToUpload || !selectedTask) return;
    setUploadingTaskId(selectedTask.id);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", fileToUpload);
    const response = await fetch(`http://localhost:8000/tarefas/${selectedTask.id}/arquivos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) {
      alert("Arquivo enviado com sucesso!");
      setFileToUpload(null);
      fetchTarefas();
    } else {
      alert("Erro ao enviar arquivo.");
    }
    setUploadingTaskId(null);
  };

  async function handleAddComentario(e) {
    e.preventDefault();
    if (!novoComentario.trim() || !selectedTask) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/tarefas/${selectedTask.id}/comentarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ texto: novoComentario }),
    });
    if (res.ok) {
      const comentario = await res.json();
      setSelectedTask({
        ...selectedTask,
        comentarios: [...(selectedTask.comentarios || []), comentario],
      });
      setNovoComentario("");
    }
  }

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
    setFileToUpload(null);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
    setFileToUpload(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <AlunoMenu />
      <div className="flex-1 ml-64 px-4 py-8 overflow-x-hidden">
        <h2 className="text-2xl font-bold text-[#2F9E41] mb-6 text-center drop-shadow">
          Meu Kanban de Tarefas
        </h2>
        <button
          className="bg-[#2F9E41] text-white px-4 py-2 rounded-lg mb-4"
          onClick={fetchTarefas}
        >
          Atualizar Tarefas
        </button>
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
                      className={`bg-white rounded-2xl shadow-xl min-w-[210px] max-w-xs flex flex-col transition h-full border-2 ${
                        snapshot.isDraggingOver ? "bg-green-50 border-[#2F9E41]" : "border-gray-200"
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
                          <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                            {(provided, snapshot) => (
                              <div key={task.id}>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-gray-100 rounded-xl p-3 shadow flex flex-col gap-2 relative border ${
                                    snapshot.isDragging ? "ring-2 ring-green-400 border-[#2F9E41]" : "border-gray-200"
                                  } hover:bg-green-50 transition`}
                                  style={provided.draggableProps.style}
                                  onClick={() => openTaskModal(task)}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{task.titulo || task.title}</span>
                                    {task.comentarios && task.comentarios.length > 0 && (
                                      <span className="ml-2 bg-[#2F9E41] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" title="Comentários">
                                        {task.comentarios.length}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1">
                                    Criada em: {dayjs(task.createdAt || task.created_at).isValid()
                                      ? dayjs(task.createdAt || task.created_at).format("DD/MM/YYYY HH:mm")
                                      : "Data inválida"}
                                  </span>
                                  {/* Arquivos da tarefa */}
                                  {task.arquivos && task.arquivos.length > 0 && (
                                    <div className="mt-2">
                                      <div className="font-semibold text-[#2F9E41] mb-1 flex items-center gap-1">
                                        <FiPaperclip /> Arquivos anexados:
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {task.arquivos.map((arq) => (
                                          <div
                                            key={arq.id}
                                            className="flex items-center gap-2 bg-[#e9ffe7] border border-[#2F9E41]/30 rounded-lg px-3 py-2 shadow-sm"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <FiPaperclip className="text-[#2F9E41]" />
                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{arq.nome_arquivo}</span>
                                            <a
                                              href={getFileUrl(arq.caminho_arquivo)}
                                              download={arq.nome_arquivo}
                                              className="flex items-center gap-1 bg-[#2F9E41] text-white px-2 py-1 rounded hover:bg-[#217a32] text-xs font-semibold transition"
                                              title="Baixar arquivo"
                                            >
                                              <FiDownload /> Baixar
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

        {/* Modal de detalhes da tarefa */}
        {showTaskModal && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                onClick={closeTaskModal}
                aria-label="Fechar"
              >
                ×
              </button>
              <h3 className="text-xl font-bold text-[#2F9E41] mb-2">Descrição da Tarefa</h3>
              <div className="text-gray-700 mb-4">
                {selectedTask.descricao || selectedTask.description || "Sem descrição"}
              </div>
              {/* Arquivos anexados */}
              {selectedTask.arquivos && selectedTask.arquivos.length > 0 && (
                <div className="mb-4">
                  <div className="font-semibold text-[#2F9E41] mb-1 flex items-center gap-1">
                    <FiPaperclip /> Arquivos anexados:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.arquivos.map((arq) => (
                      <div
                        key={arq.id}
                        className="flex items-center gap-2 bg-[#e9ffe7] border border-[#2F9E41]/30 rounded-lg px-3 py-2 shadow-sm"
                      >
                        <FiPaperclip className="text-[#2F9E41]" />
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{arq.nome_arquivo}</span>
                        <a
                          href={getFileUrl(arq.caminho_arquivo)}
                          download={arq.nome_arquivo}
                          className="flex items-center gap-1 bg-[#2F9E41] text-white px-2 py-1 rounded hover:bg-[#217a32] text-xs font-semibold transition"
                          title="Baixar arquivo"
                        >
                          <FiDownload /> Baixar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Upload de arquivo */}
              <label className="block mt-2">
                <span className="text-xs text-gray-700">Enviar arquivo:</span>
                <input
                  type="file"
                  className="block mt-1"
                  onChange={(e) => setFileToUpload(e.target.files[0])}
                  disabled={uploadingTaskId === selectedTask.id}
                />
                {fileToUpload && (
                  <span className="block text-xs text-gray-600 mt-1">
                    Selecionado: {fileToUpload.name}
                  </span>
                )}
              </label>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#217a32] transition font-semibold flex-1"
                  onClick={handleSaveFile}
                  disabled={!fileToUpload || uploadingTaskId === selectedTask.id}
                >
                  {uploadingTaskId === selectedTask.id ? "Enviando..." : "Salvar Arquivo"}
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold flex-1"
                  onClick={closeTaskModal}
                >
                  Fechar
                </button>
              </div>

              {/* Comentários */}
              <div className="mt-6">
                <h4 className="font-bold text-[#2F9E41] mb-2">Comentários</h4>
                <div className="space-y-3 mb-4">
                  {selectedTask.comentarios && selectedTask.comentarios.length > 0 ? (
                    selectedTask.comentarios.map((comentario) => (
                      <div key={comentario.id} className="bg-gray-100 rounded p-2">
                        <div className="text-sm text-gray-800">{comentario.texto}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {comentario.usuario_nome} • {dayjs(comentario.data_criacao).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">Nenhum comentário ainda.</div>
                  )}
                </div>
                <form onSubmit={handleAddComentario} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-2 py-1"
                    placeholder="Digite seu comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-[#2F9E41] text-white px-4 py-1 rounded hover:bg-[#217a32]"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
