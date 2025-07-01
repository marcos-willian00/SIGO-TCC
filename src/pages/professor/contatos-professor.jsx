import { useState } from "react";
import ProfessorMenu from "./menu-professor";

export default function ContatosProfessor() {
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [salvo, setSalvo] = useState(false);

  // Simula salvar os dados (substitua por chamada à API se necessário)
  function handleSalvar(e) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfessorMenu />
      <div className="flex-1 ml-64 p-10">
        <h1 className="text-2xl font-bold text-[#2F9E41] mb-6">Meus Contatos</h1>
        <form
          onSubmit={handleSalvar}
          className="bg-white rounded shadow p-8 max-w-lg flex flex-col gap-6"
        >
          <div>
            <label className="block font-semibold mb-2 text-[#2F9E41]">Telefone</label>
            <input
              type="tel"
              className="border rounded px-4 py-2 w-full"
              placeholder="(99) 99999-9999"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-[#2F9E41]">E-mail</label>
            <input
              type="email"
              className="border rounded px-4 py-2 w-full"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#2F9E41] text-white px-6 py-2 rounded hover:bg-[#217a32] transition self-end"
          >
            Salvar
          </button>
          {salvo && (
            <div className="text-green-600 font-semibold mt-2">Contatos salvos!</div>
          )}
        </form>
      </div>
 </div>
  );
}