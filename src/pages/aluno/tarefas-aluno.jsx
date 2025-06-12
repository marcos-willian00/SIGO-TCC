import AlunoMenu from "./aluno-menu";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";

const tarefasExemplo = [
  {
    id: "1",
    title: "Corrigir capítulo 1",
    description: "Revisar o texto do capítulo 1",
    status: "todo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Revisar introdução",
    description: "Verificar citações e referências",
    status: "done",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Enviar cronograma",
    description: "Montar e enviar cronograma de atividades",
    status: "today",
    createdAt: new Date().toISOString(),
  },
];

const columns = [
  { key: "todo", label: "To Do" },
  { key: "today", label: "Do Today" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function TarefasAluno() {
  const [tasks, setTasks] = useState(tarefasExemplo);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const updatedTasks = [...tasks];
    const [moved] = updatedTasks.splice(source.index, 1);
    moved.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, moved);
    setTasks(updatedTasks);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
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
  };

  const handleEditTask = (id, title) => {
    setEditTaskId(id);
    setEditTaskTitle(title);
  };

  const handleSaveEditTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title: editTaskTitle } : t)));
    setEditTaskId(null);
    setEditTaskTitle("");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AlunoMenu />
      <main className="flex-1 ml-64 px-6 py-8">
        <h2 className="text-3xl font-bold text-[#2F9E41] mb-6 text-center">
          Minhas Tarefas
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
            className="bg-white shadow-md rounded p-4 mb-6 max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <input
                type="text"
                placeholder="Título"
                className="border rounded px-3 py-2 flex-1"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Descrição"
                className="border rounded px-3 py-2 flex-1"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
              <select
                className="border rounded px-3 py-2 flex-1"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
              >
                {columns.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-[#2F9E41] text-white px-4 py-2 rounded hover:bg-[#217a32]"
              >
                Adicionar
              </button>
            </div>
          </form>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {columns.map((column) => (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white rounded-lg shadow p-4 min-h-[300px]"
                  >
                    <h3 className="text-lg font-bold mb-3 text-[#2F9E41]">
                      {column.label}
                    </h3>
                    {tasks
                      .filter((task) => task.status === column.key)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-100 rounded p-3 mb-3 shadow-sm"
                            >
                              <div className="flex justify-between items-center mb-1">
                                {editTaskId === task.id ? (
                                  <>
                                    <input
                                      value={editTaskTitle}
                                      onChange={(e) => setEditTaskTitle(e.target.value)}
                                      className="border rounded px-2 py-1 w-full"
                                    />
                                    <button
                                      onClick={() => handleSaveEditTask(task.id)}
                                      className="text-sm text-[#2F9E41] ml-2"
                                    >
                                      Salvar
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-semibold text-sm">{task.title}</span>
                                    <div className="flex gap-2">
                                      <FiEdit2
                                        className="text-gray-500 hover:text-[#2F9E41] cursor-pointer"
                                        onClick={() => handleEditTask(task.id, task.title)}
                                      />
                                      <FiTrash2
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        onClick={() => handleDeleteTask(task.id)}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Criado em: {dayjs(task.createdAt).format("DD/MM/YYYY")}
                              </p>
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
      </main>
    </div>
  );
}
