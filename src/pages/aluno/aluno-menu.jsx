import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaUserTie, FaUser, FaTasks } from "react-icons/fa";

export default function AlunoMenu() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <aside className="h-screen w-64 bg-[#FFFFFF] text-[#444444] font-bold flex flex-col fixed left-0 top-0 shadow-lg">
      <div className="p-6 flex justify-center">
        <img
          src="/logoSigoTCC.svg"
          alt="Logo SIGO TCC"
          className="h-30 w-auto"
        />
      </div>
      <nav className="flex-1 flex flex-col gap-2 p-4">
        <Link to="/aluno" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaHome /> Início
        </Link>
        <Link to="/aluno/atividades" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaFileAlt /> Documentação
        </Link>
        <Link to="/aluno/professores-aluno" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaUserTie /> Professores
        </Link>
        <Link to="/aluno/convites-aluno" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
  <FaUserTie /> Convites de Orientação
        </Link>
        <Link to="/aluno/tarefas-aluno" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
          <FaTasks /> Tarefas
        </Link>
        <button
          className="flex items-center gap-2 w-full text-left py-2 px-4 hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold rounded transition"
          onClick={() => navigate('/aluno/meu-perfil-aluno')}
        >
          <FaUser /> Meu Perfil
        </button>
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