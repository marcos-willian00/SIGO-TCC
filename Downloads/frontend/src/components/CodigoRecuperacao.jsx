import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function CodigoRecuperacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "seuemail@exemplo.com";
  const [codigo, setCodigo] = useState(["", "", "", ""]);
  const inputsRef = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const novoCodigo = [...codigo];
    novoCodigo[idx] = value;
    setCodigo(novoCodigo);

    // Move para o próximo input automaticamente
    if (value && idx < 3) {
      inputsRef[idx + 1].current.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !codigo[idx] && idx > 0) {
      inputsRef[idx - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode validar o código
    const codigoFinal = codigo.join("");
    // Se o código estiver correto:
    navigate("/NovaSenha");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col">
        
        <img
    src="../public/envelope-dot 1.svg"
    alt="Logo"
    className="w-15 h-auto mx-auto mb-4"
  />
  <h2 className="text-2xl font-bold mb-2 text-center text-[#2F9E41]">Verificar endereço de e-mail</h2>
  <div className="h-1 bg-[#2F9E41] w-85 mx-auto mb-6 rounded-full"></div>
  <p className="text-center text-gray-700 mb-4">
    Enviamos um código de 4 dígitos para <span className="font-semibold">{email}</span>
  </p>
        <form onSubmit={handleSubmit}>
  <div className="mb-6 flex justify-center gap-2">
    {[0, 1, 2, 3].map((idx) => (
      <input
        key={idx}
        ref={inputsRef[idx]}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={codigo[idx]}
        onChange={(e) => handleChange(e, idx)}
        onKeyDown={(e) => handleKeyDown(e, idx)}
        className="w-12 h-12 text-center text-2xl border border-[#2F9E41] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
      />
    ))}
  </div>
  <button
    type="submit"
    className="w-full font-bold py-3 bg-[#2F9E41] text-white rounded-md hover:bg-[#217a32] focus:outline-none"
  >
    Verificar
  </button>
  <div className="mt-4 text-center">
    <span className="text-gray-700">Não recebeu nenhum código? </span>
    <button
      type="button"
      className="text-[#2F9E41] hover:underline ml-1"
      onClick={() => {/* lógica para reenviar o email */}}
    >
      Envie um novo.
    </button>
  </div>
</form>
      </div>
    </div>
  );
}

export default CodigoRecuperacao;