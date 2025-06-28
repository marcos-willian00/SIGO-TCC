import AlunoMenu from "./aluno-menu";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import dayjs from "dayjs";

const columns = [
  { key: "todo", label: "To Do" },
  { key: "today", label: "Do Today" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function KanbanAluno() {
  const [tasks, setTasks] = useState([]);
  const [uploadingTaskId, setUploadingTaskId] = useState(null);

  // Buscar tarefas do TCC do aluno ao montar
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
      // Aqui você pode atualizar a tarefa se quiser mostrar arquivos enviados
    } else {
      alert("Erro ao enviar arquivo.");
    }
    setUploadingTaskId(null);
    e.target.value = ""; // limpa o input
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AlunoMenu />
      <div className="flex-1 ml-64 px-4 py-8 overflow-x-auto">
        <h2 className="text-xl font-bold text-[#2F9E41] mb-6 text-center">
          Meu Kanban de Tarefas
        </h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white rounded shadow p-4 min-h-[300px]"
                  >
                    <h3 className="text-lg font-bold mb-4 text-[#2F9E41]">{col.label}</h3>
                    {tasks
                      .filter((t) => t.status === col.key)
                      .map((task, index) => (
                        <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 rounded p-3 mb-3 shadow relative"
                            >
                              <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-[#2F9E41]">{task.title}</h4>
                                <p className="text-sm text-gray-600">{task.description}</p>
                                <p className="text-xs text-gray-400">
                                  Criado em {dayjs(task.createdAt).format('DD/MM/YYYY')}
                                </p>
                                <label className="block mt-2">
                                  <span className="text-xs text-gray-700">Enviar arquivo:</span>
                                  <input
                                    type="file"
                                    className="block mt-1"
                                    onChange={(e) => handleFileChange(task.id, e)}
                                    disabled={uploadingTaskId === task.id}
                                  />
                                </label>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}