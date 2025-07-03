import AlunoMenu from "./aluno-menu";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";

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
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    async function fetchTarefas() {
      const token = localStorage.getItem("token");
      const tccId = localStorage.getItem("tcc_id");
      if (!tccId) return;
      const response = await fetch(`http://localhost:8000/tccs/${tccId}/tarefas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    }
    fetchTarefas();
  }, []);

  // Atualizar status da tarefa ao arrastar
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

      // Atualiza status no backend
      await fetch(`http://localhost:8000/tarefas/${tarefaId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: destination.droppableId }),
      });

      // Atualiza localmente
      setTasks((prev) =>
        prev.map((t) =>
          t.id === tarefaId ? { ...t, status: destination.droppableId } : t
        )
      );
    }
  };

  // Upload de arquivo para tarefa
  const handleFileChange = async (tarefaId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingTaskId(tarefaId);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`http://localhost:8000/tarefas/${tarefaId}/arquivos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("Arquivo enviado com sucesso!");
      // Atualize a tarefa se quiser mostrar arquivos enviados
    } else {
      alert("Erro ao enviar arquivo.");
    }
    setUploadingTaskId(null);
    e.target.value = ""; // limpa o input
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-white">
      <AlunoMenu />
      <div className="flex-1 ml-64 px-4 py-8 overflow-x-hidden">
        <h2 className="text-2xl font-bold text-[#2F9E41] mb-6 text-center drop-shadow">
          Meu Kanban de Tarefas
        </h2>
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
                                  onClick={() =>
                                    setExpandedTaskId(
                                      expandedTaskId === task.id ? null : task.id
                                    )
                                  }
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{task.titulo || task.title}</span>
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1">
                                    Criada em: {dayjs(task.createdAt || task.created_at).isValid()
                                      ? dayjs(task.createdAt || task.created_at).format("DD/MM/YYYY HH:mm")
                                      : "Data inválida"}
                                  </span>
                                </div>
                                {/* Modalzinho embaixo do card para descrição e upload */}
                                {expandedTaskId === task.id && (
                                  <div className="bg-white border-2 border-[#2F9E41] rounded-xl shadow p-3 mt-2">
                                    <div className="font-semibold mb-1 text-[#2F9E41]">Descrição:</div>
                                    <div className="text-gray-700 mb-2">{task.descricao || task.description || "Sem descrição"}</div>
                                    <label className="block mt-2">
                                      <span className="text-xs text-gray-700">Enviar arquivo:</span>
                                      <input
                                        type="file"
                                        className="block mt-1"
                                        onChange={(e) => handleFileChange(task.id, e)}
                                        disabled={uploadingTaskId === task.id}
                                      />
                                    </label>
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
    </div>
  );
º}