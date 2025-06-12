import ProfessorMenu from "./menu-professor";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiMoreVertical, FiEdit2, FiTrash2, FiChevronRight } from "react-icons/fi";
import dayjs from "dayjs";

const alunosExemplo = [
  { id: "a1", nome: "Ana Souza" },
  { id: "a2", nome: "Carlos Silva" },
  { id: "a3", nome: "Maria Oliveira" },
];

const tarefasPorAlunoExemplo = {
  a1: [
    { id: "1", title: "Corrigir capítulo 1", description: "Revisar o texto do capítulo 1", status: "todo", createdAt: new Date().toISOString() },
    { id: "2", title: "Revisar introdução", description: "Verificar citações e referências", status: "done", createdAt: new Date().toISOString() },
  ],
  a2: [
    { id: "3", title: "Enviar cronograma", description: "Montar e enviar cronograma de atividades", status: "today", createdAt: new Date().toISOString() },
  ],
  a3: [
    { id: "4", title: "Ajustar metodologia", description: "Reescrever a seção de metodologia", status: "inprogress", createdAt: new Date().toISOString() },
  ],
};

const columns = [
  { key: "todo", label: "To Do" },
  { key: "today", label: "Do Today" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function TarefasProfessor() {
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [menuTaskId, setMenuTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const handleSelecionarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
    setTasks(tarefasPorAlunoExemplo[aluno.id] || []);
    setShowNewTask(false);
    setMenuTaskId(null);
    setEditTaskId(null);
  };

  const handleVoltar = () => {
    setAlunoSelecionado(null);
    setTasks([]);
    setShowNewTask(false);
    setMenuTaskId(null);
    setEditTaskId(null);
  };

  // Drag and drop 100% funcional e fluido
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Tarefas da coluna de origem e destino na ordem global
    const sourceTasks = tasks.filter(t => t.status === source.droppableId)
      .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));
    const destTasks = tasks.filter(t => t.status === destination.droppableId)
      .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));

    if (source.droppableId === destination.droppableId) {
      // Reordena dentro da mesma coluna
      const newColumn = Array.from(sourceTasks);
      const [removed] = newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, removed);

      // Reconstrói o array global mantendo a ordem das outras colunas
      const newTasks = [];
      let i = 0;
      tasks.forEach(t => {
        if (t.status === source.droppableId) {
          newTasks.push(newColumn[i]);
          i++;
        } else {
          newTasks.push(t);
        }
      });
      setTasks(newTasks);
    } else {
      // Movendo entre colunas
      const newSource = Array.from(sourceTasks);
      const newDest = Array.from(destTasks);
      const [removed] = newSource.splice(source.index, 1);
      const newRemoved = { ...removed, status: destination.droppableId };
      newDest.splice(destination.index, 0, newRemoved);

      // Reconstrói o array global mantendo a ordem das outras colunas
      const newTasks = [];
      let i = 0, j = 0;
      tasks.forEach(t => {
        if (t.status === source.droppableId) {
          if (i < newSource.length) {
            newTasks.push(newSource[i]);
            i++;
          }
        } else if (t.status === destination.droppableId) {
          if (j < newDest.length) {
            newTasks.push(newDest[j]);
            j++;
          }
        } else {
          newTasks.push(t);
        }
      });
      // Se sobrou algum na nova coluna destino (caso de mover para coluna vazia)
      while (j < newDest.length) {
        newTasks.push(newDest[j]);
        j++;
      }
      setTasks(newTasks);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        id: (Math.random() * 100000).toFixed(0),
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskStatus("todo");
    setShowNewTask(false);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setMenuTaskId(null);
  };

  const handleEditTask = (id, title) => {
    setEditTaskId(id);
    setEditTaskTitle(title);
    setMenuTaskId(null);
  };

  const handleSaveEditTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title: editTaskTitle } : t)));
    setEditTaskId(null);
    setEditTaskTitle("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfessorMenu />
      <div className="flex-1 ml-64 px-4 py-8 overflow-x-auto">
        {!alunoSelecionado ? (
          <div>
            <h1 className="text-2xl font-bold text-[#2F9E41] mb-2 ml-5 text-left">
              Meus Orientandos
            </h1>
            <p className="mb-8 ml-5 text-left text-gray-600">Selecione um orientando</p>
            <div className="flex flex-col gap-6 w-full max-w-5xl items-start ml-20">
              {alunosExemplo.map((aluno) => (
                <button
                  key={aluno.id}
                  onClick={() => handleSelecionarAluno(aluno)}
                  className="bg-white rounded-lg shadow p-6 w-full flex flex-row items-center justify-between hover:bg-[#D3FFD2] transition"
                >
                  <div>
                    <span className="text-lg font-bold text-[#2F9E41]">{aluno.nome}</span>
                    <br />
                    <span className="text-gray-500 text-sm mt-2">Ver tarefas</span>
                  </div>
                  <FiChevronRight size={28} className="text-[#2F9E41]" />
                </button>
              ))}
            </div>
          </div>
        ) : (
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
              >
                + Nova Tarefa
              </button>
            </div>
            {showNewTask && (
              <form
                onSubmit={handleAddTask}
                className="bg-white rounded shadow p-4 mb-6 max-w-xl mx-auto"
              >
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
                              col.key === "todo"
                                ? "text-red-600"
                                : col.key === "today"
                                ? "text-yellow-600"
                                : col.key === "inprogress"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {col.label}
                          </div>
                          <div className="flex-1 p-2 space-y-3 min-h-[60px]">
                            {columnTasks.map((task, idx) => (
                              <Draggable draggableId={task.id} index={idx} key={task.id}>
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
                                          <span className="font-medium">{task.title}</span>
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
                                              onClick={() => handleEditTask(task.id, task.title)}
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
                                        Criada em: {dayjs(task.createdAt).format("DD/MM/YYYY HH:mm")}
                                      </span>
                                    </div>
                                    {/* Modalzinho embaixo do card para descrição */}
                                    {expandedTaskId === task.id && (
                                      <div className="bg-white border rounded shadow p-3 mt-2">
                                        <div className="font-semibold mb-1 text-[#2F9E41]">Descrição:</div>
                                        <div className="text-gray-700">{task.description || "Sem descrição"}</div>
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