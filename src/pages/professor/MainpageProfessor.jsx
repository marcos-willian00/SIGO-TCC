import ProfessorMenu from "../../pages/professor/menu-professor";
import { Link } from "react-router-dom";

export default function MainpageProfessor() {
  const nome = localStorage.getItem("nome") || "Professor";

  return (
    <>
      <ProfessorMenu />
      <div className="ml-64 bg-gray-100 min-h-screen p-6">
        <h1 className="text-2xl font-bold text-[#374957] mb-4">Início</h1>

        <div className="grid grid-cols-[2fr_1fr] gap-10">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Saudação + botão */}
            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#2F9E41] mb-2">
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
                  className="w-full"
                />
              </div>
            </div>

            {/* Avisos Recentes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-[#374957] mb-4">
                Avisos recentes
              </h3>
              <ul className="space-y-3">
                {[
                  "O professor postou uma nova tarefa",
                  "O professor alterou uma data de uma tarefa",
                  "O professor marcou como concluído uma tarefa",
                ].map((aviso, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                      <span>{aviso}</span>
                    </div>
                    <Link
                      to="/professor/tarefas-professor"
                      className="text-green-600 font-semibold hover:underline mr-4"
                    >
                      Ver
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Meus Contatos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-[#374957] mb-4">
                Meus Contatos
              </h3>
              <p className="text-gray-600 mb-4">
                Aqui estão os seus contatos que você definiu, você pode alterar
                em Meu perfil!
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-semibold">Whatsapp</p>
                    <p className="text-sm text-gray-600">(88) 9 9999-9999</p>
                  </div>
                  <button className="text-green-600 font-semibold hover:underline mr-4">
                    Ir
                  </button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-gray-600">
                      hudsonjosino@professor.ifce.edu.br
                    </p>
                  </div>
                  <button className="text-green-600 font-semibold hover:underline mr-4">
                    Ir
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Card: Entregas Marcadas */}
            <div className="w-75 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-4xl font-bold text-green-600">1</p>
                <p className="text-gray-600">Entregas marcadas</p>
              </div>
              {/* Imagem ilustrativa */}
              <img
                src="./public/Asset 1e.svg"
                alt="Entregas marcadas"
                className="w-30"
              />
            </div>

            {/* Card: Entregas Realizadas */}
            <div className="w-75 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-4xl font-bold text-green-600">7</p>
                <p className="text-gray-600">Entregas realizadas</p>
              </div>
              <img
                src="./public/Asset 1.svg"
                alt="Entregas realizadas"
                className="w-30"
              />
            </div>

            {/* Card: Entregas Atrasadas */}
            <div className="w-75 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-4xl font-bold text-green-600">2</p>
                <p className="text-gray-600">Entregas atrasadas</p>
              </div>
              <img
                src="./public/Asset 1a.svg"
                alt="Entregas atrasadas"
                className="w-30"
              />
            </div>

            {/* Card: Meses para Conclusão */}
            <div className="w-75 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-4xl font-bold text-green-600">5</p>
                <p className="text-gray-600">Meses para conclusão</p>
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
