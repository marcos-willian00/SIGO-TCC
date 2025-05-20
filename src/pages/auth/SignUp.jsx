import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    nomeSocial: '',
    email: '',
    telefone: '',
    matricula: '',
    senha: '',
    confirmaSenha: '',
    tipoUsuario: 'Professor Orientador',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmaSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    // Aqui você pode fazer a requisição para o backend
    // Exemplo:
    // const response = await cadastroService(form);
    // if (response.ok) navigate('/login');

    toast.success('Cadastro realizado com sucesso!');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-center text-[#2F9E41]">Cadastro</h2>
        <div className="h-1 bg-[#2F9E41] w-24 mx-auto my-1 rounded-full"></div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Coluna Esquerda */}
          <div>
            <label className="block font-bold mb-1">Nome Completo</label>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <label className="block font-bold mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <label className="block font-bold mb-1">Matrícula</label>
            <input
              type="text"
              name="matricula"
              placeholder="Matrícula"
              value={form.matricula}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <label className="block font-bold mb-1">Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <ul className="text-xs text-gray-600 grid grid-cols-2 gap-x-4 ml-5 list-disc">
              <li>Mínimo de 8 caracteres</li>
              <li>Uma letra minúscula</li>
              <li>Um número</li>
              <li>Um caractere especial</li>
              </ul>
          </div>

          {/* Coluna Direita */}
          <div>
            <label className="block font-bold mb-1">Nome Social (Opcional)</label>
            <input
              type="text"
              name="nomeSocial"
              placeholder="Nome Social"
              value={form.nomeSocial}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
            />

            <label className="block font-bold mb-1">Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
            />

            <label className="block font-bold mb-1">Tipo de usuário</label>
            <select
              name="tipoUsuario"
              value={form.tipoUsuario}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            >
              <option>Professor Orientador</option>
              <option>Aluno</option>
              <option>Coordenador</option>
            </select>

            <label className="block font-bold mb-1">Confirme a senha</label>
            <input
              type="password"
              name="confirmaSenha"
              placeholder="Senha"
              value={form.confirmaSenha}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <p className="text-sm text-center">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-[#2F9E41] hover:underline">
                Faça o login.
              </Link>
            </p>
          </div>

          {/* Botão de cadastro */}
          <div className="md:col-span-2 text-right mt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-[#2F9E41] text-white font-semibold rounded-md hover:bg-[#217a32]"
            >
              Próximo
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Cadastro;
