import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginService } from '../../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function onSubmitLogin() {
    const loginResponse = await loginService(email, senha);

    if (!loginResponse) {
      toast('Erro ao fazer login. Verifique suas credenciais.', {
        type: 'error',
      });
      return;
    }
    toast('Login realizado com sucesso!', {
      type: 'success',
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl flex flex-col md:flex-row">
        {/* Div da imagem */}
        <div className="flex-shrink-0 flex items-start justify-center mr-6 mt-15">
          <img
            src="../public/logoSigoTCC.svg"
            alt="Login Illustration"
            className="w-80 h-auto"
          />
        </div>

        {/* Div do formulário */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold mb-2 text-center text-[#2F9E41]">
            Login
          </h2>
          <div className="h-1 bg-[#2F9E41] w-24 mx-auto mb-6 rounded-full"></div>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block font-bold text-black-600 mb-3"
              >
                Login
              </label>
              <input
                type="text"
                id="email"
                placeholder="Digite seu login ou e-mail"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full p-3 border border-[#2F9E41] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="senha"
                className="block font-bold text-black-600 mb-3"
              >
                Senha
              </label>
              <input
                type="password"
                id="senha"
                placeholder="Digite sua senha"
                onChange={(e) => setSenha(e.target.value)}
                value={senha}
                className="w-full p-3 border border-[#2F9E41] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              {/* Lembre-se de mim */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2 bg-white border-2 border-[#2F9E41] accent-[#2F9E41] rounded focus:ring-[#2F9E41] focus:ring-2"
                />
                <label htmlFor="remember" className="text-gray-600 text-sm">
                  Lembre-se de mim
                </label>
              </div>
              {/* Esqueceu a senha */}
              <Link
                to="/RecuperarSenha"
                className="text-[#2F9E41] text-sm hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <button
              className="w-full py-3 bg-[#2F9E41] text-white rounded-md hover:bg-[#217a32] focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                onSubmitLogin();
              }}
            >
              Entrar
            </button>
            {/* Links adicionais */}
            <div className="mt-2 text-center">
              <span className="text-gray-600">Não tem conta? </span>
              <a href="/cadastro" className="text-[#2F9E41] hover:underline">
                Crie agora
              </a>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
