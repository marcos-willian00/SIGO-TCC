import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlunoMenu from "./aluno-menu";

export default function MainpageAluno() {
  const navigate = useNavigate();
  const nome = localStorage.getItem("nome") || "Aluno";

  useEffect(() => {
    async function checkTcc() {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/students/me/tccs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const tccs = await response.json();
        if (tccs && tccs.length > 0) {
          navigate("/aluno/mainpage-aluno-orientando");
        }
      }
    }
    checkTcc();
  }, [navigate]);

  return (
    <>
      <AlunoMenu />
      <div className="ml-64 bg-gray-100 min-h-screen">
        <div className="px-6 py-1 bg-gray-100">
          <h1 className="text-2xl font-bold text-[#374957] ml-6 mt-8">
            Área do Aluno
          </h1>
        </div>
        <div className="w-full max-w-[1200px] mx-auto my-8 px-6 md:px-12 py-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-[#2F9E41] mb-2">
            Bem vindo(a), {nome}
          </h2>

          <p className="text-gray-700">
            Seu cadastro já foi realizado e você já está na lista de espera por
            orientação, seu cadastro foi concluído com sucesso e agora você está
            na lista de espera para receber o convite de um professor
            orientador. Aguarde o contato com informações sobre temas de
            pesquisa, prazos e orientadores disponíveis na sua área. Caso ainda
            não possua uma área, você receberá instruções e sugestões pelo seu
            coordenador de curso ou orientador assim que possível. A paciência é
            uma virtude!
          </p>

          <img
            src="./public/Asset 1 1.svg"
            alt="Imagem de orientação acadêmica"
            className="w-100 mx-auto mt-6 mb-6 max-w-full h-auto"
          />

          <p className="text-gray-700 text-center text-2xl font-bold">
            Aguarde Orientação!
          </p>
        </div>
      </div>
    </>
  );
}
