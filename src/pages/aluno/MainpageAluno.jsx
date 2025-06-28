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
        <div className="px-6 py-2 bg-gray-100">
          <h1 className="text-2xl font-bold text-[#374957]">Área do Aluno</h1>
        </div>
        <div className="w-[150vh] mx-auto my-8 px-8 py-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-[#2F9E41] mb-2">
            Bem vindo(a), {nome}
          </h2>
          <p className="text-gray-700">
            Você ainda não possui orientador. Aguarde um convite ou procure um professor para iniciar seu TCC.
          </p>
        </div>
      </div>
    </>
  );
}