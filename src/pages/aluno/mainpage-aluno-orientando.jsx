import AlunoMenu from './aluno-menu';
import { Link } from 'react-router-dom';

export default function MainpageAlunoOrientando() {
  const nome = localStorage.getItem('nome') || 'Professor';

  return (
    <>
      <AlunoMenu />
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
                  a organizar cada etapa, acompanhar seu progresso e manter a
                  comunicação com seu orientador de forma simples e eficiente.
                </p>
                <Link
                  to="/aluno/tarefas-aluno"
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
                  'O professor postou uma nova tarefa',
                  'O professor alterou uma data de uma tarefa',
                  'O professor marcou como concluído uma tarefa',
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
                Aqui estão os meios de contato com seu orientador
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
                      EmanuelPereira04@professor.ifce.edu.br
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
            <div className="w-100 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  O que é o TCC?
                </p>
                <p className="text-1xl text-gray-600">
                  É um trabalho de pesquisa que desenvolve sua autonomia,
                  pensamento crítico e domínio do curso.
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
            <div className="w-100 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  Rotina de sucesso
                </p>
                <p className="text-1xl text-gray-600">
                  Avance um pouco todo dia. Progresso constante é melhor que
                  perfeição repentina.
                </p>
              </div>
              <img
                src="./public/Asset 1.svg"
                alt="Entregas realizadas"
                className="w-30"
              />
            </div>

            {/* Card: Entregas Atrasadas */}
            <div className="w-100 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-green-600">Você sabia?</p>
                <p className="text-1xl text-gray-600">
                  A maioria dos alunos conclui o TCC com mais de 80% das tarefas
                  feitas no prazo.
                </p>
              </div>
              <img
                src="./public/Asset 1a.svg"
                alt="Entregas atrasadas"
                className="w-30"
              />
            </div>

            {/* Card: Meses para Conclusão */}
            <div className="w-100 bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  Organize seu tempo
                </p>
                <p className="text-1xl text-gray-600">
                  Reserve pelo menos 4h por semana só para revisar e ajustar seu
                  projeto.
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
