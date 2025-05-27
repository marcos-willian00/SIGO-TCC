import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    matricula: '',
    user_type: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // user_type já está em MAIÚSCULO pelo select
    console.log("Dados do cadastro:", {
      email: form.email,
      username: form.username,
      full_name: form.full_name,
      matricula: form.matricula,
      user_type: form.user_type,
      password: form.password,
    });

    try {
      const response = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          full_name: form.full_name,
          matricula: form.matricula,
          user_type: form.user_type,
          password: form.password,
        }),
      });

      if (response.ok) {
        toast.success('Cadastro realizado com sucesso!');
        if (form.user_type === 'ALUNO') {
          navigate('/aluno');
        } else if (form.user_type === 'PROFESSOR') {
          navigate('/professor');
        } else if (form.user_type === 'COORDENADOR') {
          navigate('/coordenador');
        } else {
          navigate('/login');
        }
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-[#2F9E41]">Cadastro</h2>
        <div className="h-1 bg-[#2F9E41] w-24 mx-auto my-1 rounded-full"></div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Coluna Esquerda */}
          <div>
            <label className="block font-bold mb-1">Nome Completo</label>
            <input
              type="text"
              name="full_name"
              placeholder="Nome Completo"
              value={form.full_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            />

            <label className="block font-bold mb-1">Usuário</label>
            <input
              type="text"
              name="username"
              placeholder="Usuário"
              value={form.username}
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
          </div>

          {/* Coluna Direita */}
          <div>
            <label className="block font-bold mb-1">Tipo de usuário</label>
            <select
              name="user_type"
              value={form.user_type}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4 focus:border-[#2F9E41] border-gray-300 focus:outline-none"
              required
            >
              <option value="" disabled>Selecione o tipo de usuário</option>
              <option value="professor">Professor Orientador</option>
              <option value="aluno">Aluno</option>
              <option value="coordenador">Coordenador</option>
            </select>

            <label className="block font-bold mb-1">Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={form.password}
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