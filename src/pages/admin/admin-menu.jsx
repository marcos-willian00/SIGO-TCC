import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaUser, FaUserShield, FaChalkboardTeacher, FaBook } from "react-icons/fa";

export default function AdminMenu() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <aside className="h-screen w-64 bg-[#FFFFFF] text-[#444444] font-bold flex flex-col fixed left-0 top-0 shadow-lg justify-between">
      <div>
        <div className="p-6 flex justify-center">
          <img
            src="/logoSigoTCC.svg"
            alt="Logo SIGO TCC"
            className="h-30 w-auto"
          />
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link to="/admin" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
            <FaHome /> Início
          </Link>
          <Link to="/admin/usuarios-admin" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
            <FaUsers /> Gerenciar Usuários
          </Link>
          <Link to="/admin/cursos-admin" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
            <FaBook /> Cursos
          </Link>
          <Link to="/admin/perfil" className="flex items-center gap-2 py-2 px-4 rounded hover:bg-[#D3FFD2] hover:text-[#2F9E41] hover:font-bold transition">
            <FaUser /> Meu Perfil
          </Link>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="m-4 py-2 px-4 bg-white text-[#2F9E41] rounded hover:bg-gray-100 transition flex items-center gap-2"
      >
        <FaUserShield /> Sair
      </button>
    </aside>
  );
}