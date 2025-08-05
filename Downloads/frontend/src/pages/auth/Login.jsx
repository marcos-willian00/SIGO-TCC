import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../services/AuthService";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function onSubmitLogin() {
    const loginResponse = await loginService(email, senha);

    if (!loginResponse.success) {
      // Mensagens específicas baseadas no tipo de erro
      let errorMessage = "";
      switch (loginResponse.error) {
        case "INVALID_CREDENTIALS":
          errorMessage =
            "Email ou senha incorretos. Verifique suas credenciais.";
          break;
        case "USER_NOT_FOUND":
          errorMessage = "Usuário não encontrado. Verifique seu email.";
          break;
        case "USER_DATA_INVALID":
          errorMessage =
            "Dados do usuário inválidos. Entre em contato com o suporte.";
          break;
        case "VALIDATION_ERROR":
          errorMessage =
            "Dados de login inválidos. Verifique os campos preenchidos.";
          break;
        case "SERVER_ERROR":
          errorMessage =
            "Erro interno do servidor. Tente novamente mais tarde.";
          break;
        case "NETWORK_ERROR":
          errorMessage =
            "Erro de conexão. Verifique sua internet e tente novamente.";
          break;
        default:
          errorMessage =
            "Erro inesperado. Tente novamente ou entre em contato com o suporte.";
      }

      toast(errorMessage, { type: "error" });
      return;
    }

    const user = loginResponse.user;
    const tipo = user?.user_type;
    const role = user?.role;

    if (!user || !user.id || !user.nome || !tipo) {
      toast("Dados do usuário incompletos.", { type: "error" });
      return;
    }

    if (tipo === "estudante") {
      navigate("/aluno");
    } else if (tipo === "professor") {
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "coordenador") {
        navigate("/coordenador");
      } else {
        navigate("/professor");
      }
    } else {
      toast("Tipo de usuário desconhecido.", { type: "error" });
      return;
    }

    toast("Login realizado com sucesso!", {
      type: "success",
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
            <div className="flex items-center justify-start mb-6">
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
    </div>
  );
}

export default Login;
