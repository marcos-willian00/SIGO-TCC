import CoordenadorMenu from "./menu-coordenador";
import { useEffect, useState } from "react";

export default function MainpageCoordenador() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          // Atualizar o localStorage com o nome correto
          localStorage.setItem("nome", data.nome);
        } else {
          console.error("Erro ao carregar dados do perfil.");
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
      }
    }
    fetchPerfil();
  }, []);

  // Usar o nome do usuário da API se disponível, senão usar do localStorage, senão usar fallback
  const nome = user?.nome || localStorage.getItem("nome") || "Coordenador";

  return (
    <>
      <CoordenadorMenu />
      <div className="ml-64 bg-gray-100">
        <div className="px-6 py-2 bg-gray-100">
          <h1 className="text-2xl font-bold text-[#374957]">Início</h1>
        </div>
        <div className="w-[150vh] mx-auto my-8 px-8 py-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-[#2F9E41] mb-2">
            Bem Vindo(a), {nome}
          </h2>
          <p className="text-gray-700">
            Aqui você pode gerenciar alunos, professores, turmas e temas de TCC. Acompanhe o andamento dos trabalhos, distribua orientadores, envie comunicados e mantenha o controle das atividades do curso. Utilize as ferramentas disponíveis para facilitar a gestão acadêmica!
          </p>
        </div>
        {/* Imagem abaixo da div do bom dia coordenador */}
        <div className="px-8 py-8 bg-gray-100 flex flex-col items-center">
          <img
            src="/Asset 1 1.svg" // Altere para o caminho da imagem desejada
            alt="Imagem do coordenador"
            className="w-100 h-auto mx-auto"
          />
        </div>
        <h3 className="mt-6 px-8 py-8 text-2xl font-bold text-[#374957] text-center">
          Boa gestão!
        </h3>
      </div>
    </>
  );
}