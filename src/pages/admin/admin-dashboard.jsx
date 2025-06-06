import AdminMenu from "./admin-menu";
import { ToastContainer } from "react-toastify";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenu />
      <div className="flex-1 ml-64 flex flex-col">
        <h1 className="text-3xl font-bold text-[#2F9E41] mt-10 ml-10 mb-6">
          Painel do Administrador
        </h1>
        <div className="flex-1 flex items-start justify-center">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-[#2F9E41] mb-6">
              Bem-vindo, Administrador!
            </h2>
            <p>
              Aqui você pode gerenciar usuários, visualizar estatísticas e acessar funcionalidades administrativas.
            </p>
            {/* Adicione mais cards, tabelas ou funcionalidades conforme necessário */}
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}