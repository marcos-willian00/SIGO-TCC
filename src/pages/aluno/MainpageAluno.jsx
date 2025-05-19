import AlunoMenu from "../../pages/aluno/aluno-menu";

export default function MainpageAluno() {
  // Pegue o nome do aluno do localStorage (ajuste a chave se necessário)
const nome = localStorage.getItem("nome") || "Aluno";

  return (
    <>
      <AlunoMenu />
      <div className="ml-64 bg-gray-100">
        <div className="px-6 py-2 bg-gray-100">
          <h1 className="text-2xl font-bold text-[#374957]">Início</h1>
        </div>
        <div className="w-[150vh] mx-auto my-8 px-8 py-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-[#2F9E41] mb-2">
            Bom dia, {nome}
          </h2>
          <p className="text-gray-700">
            Seu cadastro já foi realizado e você já está na lista de espera por orientação, aguarde novas informações sobre pesquisa, temas, desenvolvimento, prazos e professores orientadores disponíveis na sua área de pesquisa. Caso ainda não possua uma área, você receberá instruções e sugestões pelo coordenador do curso ou algum professor disponível assim que possível. A paciência é uma virtude!
          </p>
        </div>
        {/* Imagem abaixo da div do bom dia aluno */}
        <div className="px-8 py-8 bg-gray-100 flex flex-col items-center">
          <img
            src="/Asset 1 1.svg" // Altere para o caminho da imagem desejada
            alt="Imagem do aluno"
            className="w-100 h-auto mx-auto"
          />
          
        </div>
        <h3 className="mt-6 px-8 py-8 text-2xl font-bold text-[#374957] text-center">
          Aguarde Orientação!
        </h3>
      </div>
    </>
  );
}