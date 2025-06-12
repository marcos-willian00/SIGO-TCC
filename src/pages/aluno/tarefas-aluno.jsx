import AlunoMenu from "./aluno-menu";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiMoreVertical, FiEdit2, FiTrash2, FiChevronRight } from "react-icons/fi";
import dayjs from "dayjs";

const tarefasDoAluno = [
  { id: "1", title: "Corrigir capítulo 1", description: "Revisar o texto do capítulo 1", status: "todo", createdAt: new Date().toISOString() },
  { id: "2", title: "Revisar introdução", description: "Verificar citações e referências", status: "done", createdAt: new Date().toISOString() },
  { id: "3", title: "Enviar cronograma", description: "Montar e enviar cronograma de atividades", status: "today", createdAt: new Date().toISOString() },
];

const columns = [
  { key: "todo", label: "To Do" },
  { key: "today", label: "Do Today" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function KanbanAluno() {
  const [tasks, setTasks] = useState(tarefasDoAluno);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [menuTaskId, setMenuTaskId] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const sourceTasks = tasks.filter(t => t.status === source.droppableId)
      .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));
    const destTasks = tasks.filter(t => t.status === destination.droppableId)
      .sort((a, b) => tasks.indexOf(a) - tasks.indexOf(b));

    if (source.droppableId === destination.droppableId) {
      const newColumn = Array.from(sourceTasks);
      const [removed] = newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, removed);

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
      const newSource = Array.from(sourceTasks);
      const newDest = Array.from(destTasks);
      const [removed] = newSource.splice(source.index, 1);
      const newRemoved = { ...removed, status: destination.droppableId };
      newDest.splice(destination.index, 0, newRemoved);

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
      <AlunoMenu />
      <div className="flex-1 ml-64 px-4 py-8 overflow-x-auto">
        <h2 className="text-xl font-bold text-[#2F9E41] mb-6 text-center">
          Meu Kanban de Tarefas
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
                        <Draggable draggableId={task.id} index={index} key={task.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 rounded p-3 mb-3 shadow relative"
                            >
                              <div className="flex justify-between items-center">
                                {editTaskId === task.id ? (
                                  <input
                                    value={editTaskTitle}
                                    onChange={(e) => setEditTaskTitle(e.target.value)}
                                    onBlur={() => handleSaveEditTask(task.id)}
                                    className="border rounded px-2 py-1 flex-1"
                                  />
                                ) : (
                                  <h4 className="font-semibold text-[#2F9E41]">{task.title}</h4>
                                )}
                                <div className="relative">
                                  <button
                                    onClick={() => setMenuTaskId(task.id === menuTaskId ? null : task.id)}
                                  >
                                    <FiMoreVertical />
                                  </button>
                                  {menuTaskId === task.id && (
                                    <div className="absolute right-0 bg-white shadow rounded p-2 z-10">
                                      <button
                                        onClick={() => handleEditTask(task.id, task.title)}
                                        className="flex items-center gap-1 hover:underline mb-1"
                                      >
                                        <FiEdit2 /> Editar
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="flex items-center gap-1 text-red-500 hover:underline"
                                      >
                                        <FiTrash2 /> Excluir
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              <p className="text-xs text-gray-400 mt-2">Criado em {dayjs(task.createdAt).format('DD/MM/YYYY')}</p>
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