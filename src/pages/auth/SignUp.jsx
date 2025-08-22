import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginService } from "../../services/AuthService";

function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    matricula: "",
    telefone: "",
    user_type: "",
    password: "",
    departamento: "",
    titulacao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = "http://localhost:8000/auth/register/";
    let payload = {};

    if (form.user_type === "aluno") {
      url += "student";
      payload = {
        nome: form.full_name,
        email: form.email,
        matricula: form.matricula,
        telefone: form.telefone,
        password: form.password,
        // curso_id: form.curso_id, // se necessário
      };
    } else if (form.user_type === "professor") {
      url += "professor";
      payload = {
        nome: form.full_name,
        email: form.email,
        siape: form.matricula,
        telefone: form.telefone,
        password: form.password,
        departamento: form.departamento,
        titulacao: form.titulacao,
        role: "professor", // use minúsculo conforme enum backend
      };
    } else {
      toast.error("Tipo de usuário inválido.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Cadastro realizado com sucesso!");
        
        // Fazer login automático após cadastro bem-sucedido
        console.log("Fazendo login automático após cadastro...");
        const loginResponse = await loginService(form.email, form.password);
        
        if (loginResponse.success) {
          const user = loginResponse.user;
          console.log("Login automático bem-sucedido:", user);
          
          // Redirecionar baseado no tipo de usuário
          if (user.user_type === "estudante") {
            navigate("/aluno");
          } else if (user.user_type === "professor") {
            navigate("/professor");
          } else if (user.user_type === "coordenador") {
            navigate("/coordenador");
          } else if (user.user_type === "admin") {
            navigate("/admin");
          } else {
            navigate("/login");
          }
        } else {
          console.error("Erro no login automático:", loginResponse.error);
          toast.info("Cadastro realizado! Faça login para acessar o sistema.");
          navigate("/login");
        }
      } else {
        const data = await response.json();
        toast.error(data.detail || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-[#2F9E41]">
          Cadastro
        </h2>
        <div className="h-1 bg-[#2F9E41] w-24 mx-auto my-1 rounded-full"></div>
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6 mt-6"
        >
          {/* Coluna Esquerda */}
          <div>
            <label className="block font-bold mb-1">Nome Completo</label>
            <input
              type="text"
              name="full_name"
              placeholder="Nome Completo"
              value={form.full_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <label className="block font-bold mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <label className="block font-bold mb-1">Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />
            {/* Campos extras para professor - só aparecem se for professor */}
            {form.user_type === "professor" && (
              <>
                <label className="block font-bold mb-1">Titulação</label>
                <input
                  type="text"
                  name="titulacao"
                  placeholder="Titulação"
                  value={form.titulacao}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
                  required
                />
              </>
            )}
          </div>
          {/* Coluna Direita */}
          <div>
            <label className="block font-bold mb-1">Matrícula/SIAPE</label>
            <input
              type="text"
              name="matricula"
              placeholder={
                form.user_type === "professor"
                  ? "Siape"
                  : "Matrícula"
              }
              value={form.matricula}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <label className="block font-bold mb-1">Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <label className="block font-bold mb-1">Tipo de usuário</label>
            <select
              name="user_type"
              value={form.user_type}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            >
              <option value="" disabled>
                Selecione o tipo de usuário
              </option>
              <option value="professor">Professor</option>
              <option value="aluno">Aluno</option>
            </select>

            {/* Campos extras para professor - só aparecem se for professor */}
            {form.user_type === "professor" && (
              <>
                <label className="block font-bold mb-1">Departamento</label>
                <input
                  type="text"
                  name="departamento"
                  placeholder="Departamento"
                  value={form.departamento}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
                  required
                />
              </>
            )}

            <p className="text-sm text-center mt-2">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-[#2F9E41] hover:underline">
                Faça o login.
              </Link>
            </p>
          </div>
          {/* Botão de cadastro */}
          <div className="md:col-span-2 text-right mt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#2F9E41] text-white font-semibold rounded-md hover:bg-[#217a32]"
            >
              Finalizar Cadastro
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Cadastro;