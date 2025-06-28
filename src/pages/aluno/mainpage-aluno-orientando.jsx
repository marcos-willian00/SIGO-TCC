import AlunoMenuOrientando from "./aluno-menu-orientando";

export default function MainpageAlunoOrientando() {
  const nome = localStorage.getItem("nome") || "Aluno";

  return (
    <>
      <AlunoMenuOrientando />
      <div className="ml-64 bg-gray-100 min-h-screen">
        <div className="px-6 py-2 bg-gray-100">
          <h1 className="text-2xl font-bold text-[#374957]">Área do Orientando</h1>
        </div>
        <div className="w-[150vh] mx-auto my-8 px-8 py-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-[#2F9E41] mb-2">
            Bem vindo(a), {nome}
          </h2>
          <p className="text-gray-700">
            Agora você é orientando! Aqui você pode acompanhar suas tarefas, enviar arquivos, conversar com seu orientador e acompanhar o progresso do seu TCC.
          </p>
        </div>
        {/* Outras opções específicas para orientando */}
      </div>
    </>
  );
}