import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar lógica para enviar o email
    navigate("/CodigoRecuperacao", { state: { email } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col h-[60vh]">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold mb-2 text-center text-[#2F9E41]">Recuperação de Conta</h2>
          <div className="h-1 bg-[#2F9E41] w-24 mx-auto mb-6 rounded-full"></div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block font-bold text-black-600 mb-3 mt-15">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Digite seu email para recuperar a senha"
                className="w-full p-3 border border-[#2F9E41] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#2F9E41] mt-5 text-white rounded-md hover:bg-[#217a32] focus:outline-none"
            >
              Enviar link de recuperação
            </button>
            <div className="mt-4 text-center">
              <a href="/login" className="text-[#2F9E41] hover:underline">Voltar para o login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenha;