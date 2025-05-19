import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NovaSenha() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar a nova senha
    setSucesso(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col">
        <img
          src="../public/lock 1.svg"
          alt="Logo"
          className="w-16 h-auto mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold mb-2 text-center text-[#2F9E41]">Alteração de Senha</h2>
        <div className="h-1 bg-[#2F9E41] w-60 mx-auto mb-6 rounded-full"></div>
        {!sucesso ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="senha" className="block font-bold text-black text-left mb-3">Nova senha</label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Digite a nova senha"
                className="w-full p-3 border border-[#2F9E41] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmarSenha" className="block font-bold text-black text-left mb-3">Confirmar nova senha</label>
              <input
                type="password"
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="Confirme a nova senha"
                className="w-full p-3 border border-[#2F9E41] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#2F9E41] text-white rounded-md hover:bg-[#217a32] focus:outline-none"
            >
              Alterar Senha
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-green-600 text-lg font-semibold mb-6 text-center">
              Senha alterada com sucesso!
            </p>
            <button
              className="w-full py-3 bg-[#2F9E41] text-white rounded-md hover:bg-[#217a32] focus:outline-none"
              onClick={() => navigate("/")}
            >
              Ir para o login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NovaSenha;