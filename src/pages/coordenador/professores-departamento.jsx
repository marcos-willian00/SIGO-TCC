import { useEffect, useState } from "react";
import CoordenadorMenu from "./menu-coordenador";
import { ToastContainer, toast } from "react-toastify";

export default function ProfessoresDepartamento() {
  const [professores, setProfessores] = useState([]);

  useEffect(() => {
    async function fetchProfessores() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/professors/departamento", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfessores(data);
        } else {
          toast.error("Não foi possível carregar os professores.");
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor.");
      }
    }
    fetchProfessores();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CoordenadorMenu />
      <div className="flex-1 flex items-start justify-center p-10">
        <div className="bg-white rounded shadow p-6 w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-[#2F9E41] mb-6">Professores do Meu Departamento</h1>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b font-semibold">Nome</th>
                <th className="py-2 px-4 border-b font-semibold">Email</th>
                <th className="py-2 px-4 border-b font-semibold">SIAPE</th>
                <th className="py-2 px-4 border-b font-semibold">Titulação</th>
                <th className="py-2 px-4 border-b font-semibold">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {professores.map((prof) => (
                <tr key={prof.id}>
                  <td className="py-2 px-4">{prof.nome}</td>
                  <td className="py-2 px-4">{prof.email}</td>
                  <td className="py-2 px-4">{prof.siape}</td>
                  <td className="py-2 px-4">{prof.titulacao}</td>
                  <td className="py-2 px-4">{prof.telefone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}