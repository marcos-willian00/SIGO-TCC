// @ts-nocheck
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import AlunoMenu from "./aluno-menu";

export default function TodosProfessores() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/students/professors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfessores(data);
      } else {
        toast.error("Erro ao carregar lista de professores");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <AlunoMenu />
        <div className="ml-64 bg-gray-100 min-h-screen">
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastClassName={(context) => {
              // context.type pode ser: "default", "success", "info", "warning", "error"
              const base =
                "!rounded-l !shadow-lg !font-semibold !text-base !px-6 !py-4 !text-white";
              switch (context?.type) {
                case "success":
                  return `${base} !bg-[#2F9E41]`; // verde
                case "error":
                  return `${base} !bg-red-600`;
                case "info":
                  return `${base} !bg-blue-600`;
                case "warning":
                  return `${base} !bg-yellow-600 !text-black`;
                default:
                  return `${base} !bg-[#2F9E41]`;
              }
            }}
            bodyClassName="!text-white"
          />
          <div className="px-6 py-2 bg-gray-100">
            <h1 className="text-2xl font-bold text-[#374957] ml-6 mt-8">
              Professores
            </h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F9E41]"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AlunoMenu />
      <div className="ml-64 bg-gray-100 min-h-screen">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="!rounded-xl !shadow-lg !font-semibold !text-base !px-6 !py-4 !bg-[#2F9E41] !text-white"
          bodyClassName="!text-white"
        />
        <div className="px-6 py-2 bg-gray-100">
          <h1 className="text-2xl font-bold text-[#374957] ml-6 mt-8">
            Professores
          </h1>
        </div>

        <div className="w-full max-w-[1200px] mx-auto my-8 px-6 md:px-12 py-6 bg-white rounded-lg shadow min-h-64">
          {professores.length > 0 ? (
            <div className="ml-6 mt-8 flex flex-wrap gap-6">
              {professores.map((prof) => (
                <div
                  key={prof.id}
                  className="flex-1 min-w-[300px] max-w-sm border border-green-600 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-[#1C1C1C]">
                      {prof.nome}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-800 mb-1">
                    <strong>Email:</strong> {prof.email}
                  </p>
                  {prof.departamento && (
                    <p className="text-sm text-gray-800 mb-1">
                      <strong>Departamento:</strong> {prof.departamento}
                    </p>
                  )}
                  {prof.titulacao && (
                    <p className="text-sm text-gray-800 mb-1">
                      <strong>Titulação:</strong> {prof.titulacao}
                    </p>
                  )}
                  {prof.siape && (
                    <p className="text-sm text-gray-800 mb-1">
                      <strong>SIAPE:</strong> {prof.siape}
                    </p>
                  )}
                  {prof.telefone && (
                    <p className="text-sm text-gray-800">
                      <strong>Telefone:</strong> {prof.telefone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Nenhum professor encontrado.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
