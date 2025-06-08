import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Cadastro() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = dados básicos, 2 = etapa específica
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    matricula: "",
    telefone: "",
    user_type: "",
    password: "",

    // campos extras para professor
    departamento: "",
    titulacao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.user_type) {
      toast.error("Selecione o tipo de usuário.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = "http://localhost:8000/register/";
    if (form.user_type === "aluno") {
      url += "student";
    } else if (form.user_type === "professor") {
      url += "professor";
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
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success("Cadastro realizado com sucesso!");
        if (form.user_type === "aluno") {
          navigate("/aluno");
        } else if (form.user_type === "professor") {
          navigate("/professor");
        } else {
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

  // Etapa 2: campos específicos por tipo de usuário
  // function renderStep2() {
  //   if (form.user_type === "aluno") {
  //     return (
  //       <div>
  //         <div className="mb-3">
  //           <label className="block text-base font-bold text-gray-900">
  //             Já concluiu a carga horária padrão e falta apenas o TCC?
  //           </label>
  //           <label className="inline-flex items-center space-x-2">
  //             <input
  //               type="checkbox"
  //               name="concluiu"
  //               checked={form.concluiu || false}
  //               onChange={handleChange}
  //               className="w-4 h-4 border-[#2F9E41] accent-[#2F9E41] border-gray-300 rounded focus:ring-[#2F9E41]"
  //             />
  //             <span className="text-gray-700">Sim, já concluí!</span>
  //           </label>
  //         </div>

  //         <div className="mb-3">
  //           <label className="block text-base font-bold text-gray-900">
  //             Área de pesquisa
  //           </label>
  //           <input
  //             type="text"
  //             name="areaPesquisa"
  //             placeholder="Em qual área seu projeto de pesquisa se enquadra?"
  //             value={form.areaPesquisa || ""}
  //             onChange={handleChange}
  //             className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
  //           />
  //           <label className="inline-flex items-center space-x-2">
  //             <input
  //               type="checkbox"
  //               name="semAreaPesquisa"
  //               checked={form.semAreaPesquisa || false}
  //               onChange={handleChange}
  //               className="w-4 h-4 border-[#2F9E41] accent-[#2F9E41] border-gray-300 rounded focus:ring-[#2F9E41]"
  //             />
  //             <span className="text-gray-700">Não possuo</span>
  //           </label>
  //         </div>

  //         <div className="mb-3">
  //           <label className="block font-bold text-gray-900">Tema</label>
  //           <input
  //             type="text"
  //             name="tema"
  //             placeholder="Qual tema você já pensou"
  //             value={form.tema || ""}
  //             onChange={handleChange}
  //             className="w-full p-3 border rounded-md mb-1 focus:border-[#2F9E41] border-gray-300 focus:outline-none text-base"
  //           />
  //           <label className="inline-flex items-center space-x-2">
  //             <input
  //               type="checkbox"
  //               name="semTema"
  //               checked={form.semTema || false}
  //               onChange={handleChange}
  //               className="w-4 h-4 border-[#2F9E41] accent-[#2F9E41] border-gray-300 rounded focus:ring-[#2F9E41]"
  //             />
  //             <span className="text-gray-700">Não possuo</span>
  //           </label>
  //         </div>

  //         <div className="mb-3">
  //           <label className="block text-base font-bold text-gray-900 mb-1">
  //             Visão geral
  //           </label>
  //           <textarea
  //             name="visaoGeral"
  //             placeholder="Discorra aqui sobre o que se trata seu TCC, caso já tenha dado início, caso contrário, desconsidere"
  //             value={form.visaoGeral || ""}
  //             onChange={handleChange}
  //             rows={3}
  //             className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-[#2F9E41] placeholder-gray-400"
  //           />
  //         </div>
  //       </div>
  //     );
  //   }
  //   if (form.user_type === "professor") {
  //     return (
  //       <div>
  //         <div className="mb-3">
  //           <label className="block text-base font-bold text-gray-900">
  //             Área de Formação
  //           </label>
  //           <input
  //             type="text"
  //             name="areaPesquisa"
  //             placeholder="Fale uma breve descrição sobre sua área de formação"
  //             value={form.areaPesquisa || ""}
  //             onChange={handleChange}
  //             className="w-full p-3 border rounded-md mb-2 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
  //           />
  //         </div>

  //         <div className="mb-3">
  //           <label className="block font-bold text-gray-900">
  //             Área de Pesquisa e Interesse
  //           </label>
  //           <input
  //             type="text"
  //             name="tema"
  //             placeholder="Em quais áreas de pesquisa orienta?"
  //             value={form.tema || ""}
  //             onChange={handleChange}
  //             className="w-full p-3 border rounded-md mb-1 focus:border-[#2F9E41] border-gray-300 focus:outline-none text-base"
  //           />
  //         </div>

  //         <div className="mb-3">
  //           <label className="block font-bold text-gray-900">
  //             Currículo Lattes
  //           </label>
  //           <input
  //             type="text"
  //             name="tema"
  //             placeholder="Coloque aqui o link do seu currículo Lattes (Opcional)"
  //             value={form.tema || ""}
  //             onChange={handleChange}
  //             className="w-full p-3 border rounded-md mb-1 focus:border-[#2F9E41] border-gray-300 focus:outline-none text-base"
  //           />
  //         </div>

  //         <div className="mb-3">
  //           <label className="block font-bold text-gray-900">
  //             Disciplinas Atuais
  //           </label>
  //           <input
  //             type="text"
  //             name="tema"
  //             placeholder="Liste aqui quais disciplinas leciona atualmente no campus sem abreviações, separados por ;"
  //             value={form.tema || ""}
  //             onChange={handleChange}
  //             className="w-full p-3 border rounded-md mb-1 focus:border-[#2F9E41] border-gray-300 focus:outline-none text-base"
  //           />
  //         </div>
  //       </div>
  //     );
  //   }
  //   // Adicione outros tipos se necessário
  //   return null;
  // }

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
      <h2 className="text-2xl font-bold text-center text-[#2F9E41]">
        Cadastro
      </h2>
      <div className="h-1 bg-[#2F9E41] w-24 mx-auto my-1 rounded-full"></div>
      <form
        onSubmit={step === 1 ? handleNext : handleSubmit}
        className="grid md:grid-cols-2 gap-6 mt-6"
      >
        {step === 1 && (
          <>
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
          </>

          )}
          {/* {step === 2 && (
            <>
              <div className="md:col-span-2">
                {renderStep2()}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#2F9E41] text-white font-semibold rounded-md hover:bg-[#217a32]"
                  >
                    Finalizar Cadastro
                  </button>
                </div>
              </div>
            </>
          )} */}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Cadastro;
