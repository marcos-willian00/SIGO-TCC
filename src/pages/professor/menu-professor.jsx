import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaEnvelope, FaUsers, FaCog, FaUser, FaTasks } from "react-icons/fa";

export default function ProfessorMenu() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <aside className="h-screen w-64 bg-[#FFFFFF] text-[#444444] font-bold flex flex-col fixed left-0 top-0 shadow-lg z-30">
      <div className="p-6 flex justify-center">
        <img
          src="/logoSigoTCC.svg"
          alt="Logo SIGO TCC"
          className="h-30 w-auto"
        />
      </div>
      <nav className="flex-1 flex flex-col gap-2 p-4">
        <Link to="/professor" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaHome /> Início
        </Link>
        <Link to="/professor/documentacao" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaFileAlt /> Documentação
        </Link>
        <Link to="/professor/mensagens" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaEnvelope /> Mensagens
        </Link>
        <Link to="/professor/orientados-professor" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaUsers /> Orientandos
        </Link>
        <Link to="/professor/tarefas-professor" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaTasks /> Tarefas
        </Link>
        <Link to="/professor/configuracoes" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaCog /> Configurações
        </Link>
        <Link to="/professor/meu-perfil-professor" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaUser /> Meu Perfil
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        className="m-4 py-2 px-4 bg-white text-[#2F9E41] rounded hover:bg-gray-100 transition"
      >
        Sair
      </button>
    </aside>
  );
}