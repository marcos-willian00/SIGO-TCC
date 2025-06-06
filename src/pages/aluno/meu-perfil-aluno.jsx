import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AlunoMenu from "../../pages/aluno/aluno-menu";

function MeuPerfilAluno() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/users/current_user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          toast.error('Não foi possível carregar os dados do perfil.');
        }
      } catch (error) {
        toast.error('Erro ao conectar com o servidor.');
      }
    }
    fetchPerfil();
  }, []);

  if (!user) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return (
  <div className="flex min-h-screen bg-gray-100">
    <AlunoMenu />
    <div className="flex-1">
      {/* Título "Meu Perfil" fora do card e da div flex-col */}
      <h1 className="text-2xl font-bold text-[#2F9E41] mt-10 ml-10 mb-4">Meu Perfil</h1>
      <div className="flex flex-col">
        <div className="flex-1 flex items-start justify-center">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-xl">
            {/* Título "Dados Pessoais" dentro do card */}
            <h3 className="text-xl font-semibold text-[#2F9E41] mb-6">Dados Pessoais</h3>
            <div className="space-y-4">
              <div><strong>Nome Completo:</strong> {user.full_name}</div>
              <div><strong>Usuário:</strong> {user.username}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Matrícula:</strong> {user.matricula}</div>
              <div><strong>Tipo de Usuário:</strong> {user.user_type}</div>
              {/* Adicione outros campos específicos do aluno, se houver */}
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default MeuPerfilAluno;