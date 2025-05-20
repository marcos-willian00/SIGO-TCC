import ProfessorMenu from "../../pages/professor/menu-professor";

export default function MainpageProfessor() {
  // Pegue o nome do professor do localStorage (ajuste a chave se necessário)
  const nome = localStorage.getItem("nome") || "Professor";

  return (
    <>
      <ProfessorMenu />
      <div className="ml-64 bg-gray-100">
        <div className="px-6 py-2 bg-gray-100">
          <h1 className="text-2xl font-bold text-[#374957]">Início</h1>
        </div>
        <div className="w-[150vh] mx-auto my-8 px-8 py-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-[#2F9E41] mb-2">
            Bem vindo(a), {nome}
          </h2>
          <p className="text-gray-700">
            Aqui você pode acompanhar e orientar seus alunos, visualizar atividades pendentes, enviar feedbacks e acessar documentos relacionados à orientação de TCC. Fique atento às notificações e prazos para garantir o melhor acompanhamento dos seus orientandos!
          </p>
        </div>
        {/* Imagem abaixo da div do bom dia professor */}
        <div className="px-8 py-8 bg-gray-100 flex flex-col items-center">
          <img
            src="/Asset 1 1.svg" // Altere para o caminho da imagem desejada
            alt="Imagem do professor"
            className="w-100 h-auto mx-auto"
          />
        </div>
        <h3 className="mt-6 px-8 py-8 text-2xl font-bold text-[#374957] text-center">
          Boas orientações!
        </h3>
      </div>
    </>
  );
}