import { useEffect, useState } from "react";
import ProfessorMenu from "./menu-professor";
import { Link, useNavigate } from "react-router-dom";

export default function MainpageProfessor() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Token não encontrado, aguardando um momento...");
          // Aguardar um pouco para o token ser salvo após cadastro/login
          setTimeout(() => {
            const tokenAfterDelay = localStorage.getItem("token");
            if (!tokenAfterDelay) {
              console.log("Token ainda não encontrado, redirecionando para login");
              navigate("/login");
            } else {
              // Tentar novamente após encontrar o token
              fetchPerfil();
            }
          }, 500);
          return;
        }

        const response = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          // Atualizar o localStorage com o nome correto
          localStorage.setItem("nome", data.nome);
        } else if (response.status === 401) {
          console.log("Token expirado ou inválido, redirecionando para login");
          localStorage.removeItem("token");
          localStorage.removeItem("nome");
          localStorage.removeItem("userType");
          navigate("/login");
        } else {
          console.error("Erro ao carregar dados do perfil:", response.status);
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
        // Em caso de erro de conexão, também redirecionar para login
        localStorage.removeItem("token");
        localStorage.removeItem("nome");
        localStorage.removeItem("userType");
        navigate("/login");
      }
    }
    fetchPerfil();
  }, [navigate]);

  // Usar o nome do usuário da API se disponível, senão usar do localStorage, senão usar fallback
  const nome = user?.nome || localStorage.getItem("nome") || "Professor";

  return (
    <>
      <ProfessorMenu />
      <div className="ml-64 bg-gray-100 min-h-screen p-6">
        <h1 className="text-3xl font-bold text-[#2F9E41] mb-4">Início</h1>

        <div className="grid grid-cols-[2fr_1fr] gap-10">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Saudação + botão */}
            <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition">
              <div>
                <h2 className="text-2xl font-bold text-[#374957] mb-2">
                  Bom dia Prof. {nome}
                </h2>
                <p className="text-gray-700 max-w-md">
                  Que bom ter você aqui! O SIGO-TCC é seu novo aliado na jornada
                  do Trabalho de Conclusão de Curso. Estamos aqui para te ajudar
                  a acompanhar o progresso dos seus orientandos, organizar as
                  tarefas, fornecer feedback e manter a comunicação de forma
                  simples e eficiente.
                </p>
                <Link
                  to="/professor/tarefas-professor"
                  className="inline-block mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Acompanhe suas tarefas aqui
                </Link>
              </div>
              <div className="w-48">
                {/* Imagem ilustrativa */}
                <img
                  src="./public/Asset 1 1.svg"
                  alt="Boas-vindas"
                  className="w-full -ml-9"
                />
              </div>
            </div>

            {/* Avisos Recentes */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-[#374957] mb-4">
                Dicas para orientar com mais eficiência:
              </h3>
              <ul className="space-y-3">
                {[
                  "Incentive o aluno a revisar o projeto semanalmente, mesmo sem entregas previstas.",
                  "Mantenha uma comunicação ativa. Orientações regulares evitam retrabalho.",
                  "Estimule a escrita por etapas. Isso reduz a pressão e melhora o resultado final.",
                ].map((aviso, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                      <span>{aviso}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-[#374957] mb-4">
                Meus Contatos
              </h3>
              <p className="text-gray-600 mb-4">
                Aqui estão os seus contatos que você definiu. Você pode alterar
                em "Meu perfil".
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-semibold">Whatsapp</p>
                    <p className="text-sm text-gray-600">
                      {user?.telefone || "(não informado)"}
                    </p>
                  </div>
                  <Link
                    to={`https://wa.me/55${user?.telefone?.replace(/\D/g, "")}`}
                    className="bg-transparent border-1 border-green-600 text-green-600 font-regular px-7 -py-1 rounded-full hover:bg-green-600 hover:text-white transition-colors mr-4"
                  >
                    Ir
                  </Link>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-gray-600">
                      {user?.email || "(não informado)"}
                    </p>
                  </div>
                  <Link
                    to={`https://mail.google.com/mail/?view=cm&fs=1&to=${user?.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent border-1 border-green-600 text-green-600 font-regular px-7 -py-1 rounded-full hover:bg-green-600 hover:text-white transition-colors mr-4"
                  >
                    Ir
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Card: Entregas Marcadas */}
            <div className="w-100 bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-[#374957]">Sobre o TCC</p>
                <p className="text-1xl text-gray-600">
                  Oriente o aluno na pesquisa, análise crítica e aplicação
                  prática do que aprendeu.
                </p>
              </div>
              {/* Imagem ilustrativa */}
              <img
                src="./public/Asset 1e.svg"
                alt="Entregas marcadas"
                className="w-30"
              />
            </div>

            {/* Card: Entregas Realizadas */}
            <div className="w-100 bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-[#374957]">
                  Orientação contínua
                </p>
                <p className="text-1xl text-gray-600">
                  Pequenos avanços semanais mantêm o aluno no ritmo e elevam a
                  qualidade do trabalho.
                </p>
              </div>
              <img
                src="./public/Asset 1.svg"
                alt="Entregas realizadas"
                className="w-30"
              />
            </div>

            {/* Card: Entregas Atrasadas */}
            <div className="w-100 bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-[#374957]">Você sabia?</p>
                <p className="text-1xl text-gray-600">
                  Orientações frequentes aumentam as chances de entrega no prazo
                  com bom desempenho.
                </p>
              </div>
              <img
                src="./public/Asset 1a.svg"
                alt="Entregas atrasadas"
                className="w-30"
              />
            </div>

            {/* Card: Meses para Conclusão */}
            <div className="w-100 bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-[#374957]">
                  Organize seu tempo
                </p>
                <p className="text-1xl text-gray-600">
                  Defina horários fixos de orientação. Isso agiliza o processo e
                  fortalece o acompanhamento.
                </p>
              </div>
              <img
                src="./public/Asset 1gg.svg"
                alt="Meses para conclusão"
                className="w-30"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
