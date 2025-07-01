import { useState } from "react";
import ProfessorMenu from "./menu-professor";

export default function ContatosProfessor() {
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [salvo, setSalvo] = useState(false);

  function handleSalvar(e) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#e8fbe7] to-[#f8fff6]">
      <ProfessorMenu />
      <div className="flex-1 ml-64 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#2F9E41] rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5v-1A4.5 4.5 0 0 0 12 2.5h0A4.5 4.5 0 0 0 7.5 6.5v1m9 0A4.5 4.5 0 0 1 12 12.5h0A4.5 4.5 0 0 1 7.5 7.5m9 0v1A4.5 4.5 0 0 1 12 13.5h0A4.5 4.5 0 0 1 7.5 8.5v-1" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-[#2F9E41] mb-1 tracking-tight drop-shadow text-center">
              Meus Contatos
            </h1>
            <p className="text-gray-500 text-center text-sm">Mantenha seus dados de contato atualizados para facilitar a comunicação.</p>
          </div>
          <form
            onSubmit={handleSalvar}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6 border border-[#2F9E41]/30"
          >
            <div className="flex flex-col gap-1">
              <label className="block font-semibold text-[#2F9E41] text-base mb-1">
                Telefone
              </label>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#e8fbe7] text-[#2F9E41]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6.5 12 13l10-6.5" />
                  </svg>
                </span>
                <input
                  type="tel"
                  className="border-2 border-[#2F9E41] rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2F9E41] transition text-base"
                  placeholder="(99) 99999-9999"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="block font-semibold text-[#2F9E41] text-base mb-1">
                E-mail
              </label>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#e8fbe7] text-[#2F9E41]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6.5 12 13l10-6.5" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="border-2 border-[#2F9E41] rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2F9E41] transition text-base"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#2F9E41] to-[#4be067] hover:from-[#217a32] hover:to-[#38b44e] text-white px-8 py-2 rounded-lg font-bold text-base shadow-md transition self-end"
            >
              Salvar
            </button>
            {salvo && (
              <div className="flex items-center gap-2 text-green-600 font-semibold mt-2 animate-fade-in">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Contatos salvos!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}