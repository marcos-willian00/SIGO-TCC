// @ts-nocheck
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import AlunoMenu from "./aluno-menu";

const MeuOrientador = () => {
  const [orientador, setOrientador] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchOrientadorData();
  }, []);
  const fetchOrientadorData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/students/me/meu-orientador",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrientador(data);
      } else if (response.status === 404) {
        setOrientador(null);
      } else {
        toast.error("Erro ao carregar dados do orientador");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };
  const handleOpenCalendar = () => {
    if (orientador?.google_agenda_url) {
      window.open(orientador.google_agenda_url, "_blank");
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AlunoMenu />
        <div className="flex-1 ml-64 px-4 py-8">
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F9E41]"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AlunoMenu />
      <div className="flex-1 ml-64 px-4 py-8">
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
        <h2 className="text-xl font-bold text-[#2F9E41] mb-6 text-center">
          Meu Orientador
        </h2>
        {orientador ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            {" "}
            <div className="flex items-start space-x-6 mb-6">
              {" "}
              <div className="flex-shrink-0">
                {" "}
                <div className="w-20 h-20 bg-[#2F9E41] rounded-full flex items-center justify-center">
                  {" "}
                  <span className="text-2xl font-bold text-white">
                    {" "}
                    {orientador.nome.charAt(0).toUpperCase()}{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex-1">
                {" "}
                <h3 className="text-2xl font-bold text-[#374957] mb-2">
                  {" "}
                  {orientador.nome}{" "}
                </h3>{" "}
                <div className="space-y-2 text-gray-600">
                  {" "}
                  <p>
                    {" "}
                    <strong>Email:</strong> {orientador.email}{" "}
                  </p>{" "}
                  {orientador.siape && (
                    <p>
                      {" "}
                      <strong>SIAPE:</strong> {orientador.siape}{" "}
                    </p>
                  )}{" "}
                  {orientador.departamento && (
                    <p>
                      {" "}
                      <strong>Departamento:</strong> {orientador.departamento}{" "}
                    </p>
                  )}{" "}
                  {orientador.titulacao && (
                    <p>
                      {" "}
                      <strong>Titulação:</strong> {orientador.titulacao}{" "}
                    </p>
                  )}{" "}
                  {orientador.telefone && (
                    <p>
                      {" "}
                      <strong>Telefone:</strong> {orientador.telefone}{" "}
                    </p>
                  )}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Seção do Google Agenda */}{" "}
            <div className="mb-6 p-4 bg-[#D3FFD2] rounded-lg border border-[#2F9E41]">
              {" "}
              <h4 className="text-lg font-semibold text-[#2F9E41] mb-2 flex items-center">
                {" "}
                📅 Agenda de Atendimentos{" "}
              </h4>{" "}
              {orientador.google_agenda_url ? (
                <div>
                  {" "}
                  <p className="text-[#374957] mb-3">
                    {" "}
                    Acesse a agenda do seu orientador para verificar horários
                    disponíveis e agendar reuniões.{" "}
                  </p>{" "}
                  <button
                    onClick={handleOpenCalendar}
                    className="bg-[#2F9E41] hover:bg-[#248532] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    {" "}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />{" "}
                    </svg>{" "}
                    <span>Ver Agenda no Google Calendar</span>{" "}
                  </button>{" "}
                </div>
              ) : (
                <p className="text-[#374957]">
                  {" "}
                  Seu orientador ainda não configurou a agenda online. Entre em
                  contato diretamente para agendar reuniões.{" "}
                </p>
              )}{" "}
            </div>{" "}
            {/* Informações do TCC */}{" "}
            {orientador.tcc && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                {" "}
                <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                  {" "}
                  📋 Seu TCC{" "}
                </h4>{" "}
                <div className="text-blue-700">
                  {" "}
                  <p>
                    {" "}
                    <strong>Título:</strong> {orientador.tcc.titulo}{" "}
                  </p>{" "}
                  {orientador.tcc.descricao && (
                    <p className="mt-1">
                      {" "}
                      <strong>Descrição:</strong> {orientador.tcc.descricao}{" "}
                    </p>
                  )}{" "}
                  <p className="mt-1">
                    {" "}
                    <strong>Status:</strong> {orientador.tcc.status}{" "}
                  </p>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            {" "}
            <div className="mb-4">
              {" "}
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />{" "}
              </svg>{" "}
            </div>{" "}
            <h3 className="text-lg font-medium text-[#374957] mb-2">
              {" "}
              Nenhum orientador definido{" "}
            </h3>{" "}
            <p className="text-gray-600 mb-4">
              {" "}
              Você ainda não possui um orientador. Acesse a seção de convites
              para aceitar convites de professores ou entre em contato com um
              professor de sua escolha.{" "}
            </p>{" "}
            <button
              onClick={() => (window.location.href = "/aluno/convites-aluno")}
              className="bg-[#2F9E41] hover:bg-[#248532] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {" "}
              Ver Convites{" "}
            </button>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default MeuOrientador;
