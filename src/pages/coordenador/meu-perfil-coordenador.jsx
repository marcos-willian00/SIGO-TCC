import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CoordenadorMenu from "../../pages/coordenador/menu-coordenador";

function MeuPerfilCoordenador() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/auth/me', {
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
      <CoordenadorMenu />
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-[#2F9E41] mt-10 ml-10 mb-4">Meu Perfil</h1>
        <div className="flex flex-col">
          <div className="flex-1 flex items-start justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-xl">
              <h3 className="text-xl font-semibold text-[#2F9E41] mb-6">Dados Pessoais</h3>
              <div className="space-y-4">
                <div><strong>Nome Completo:</strong> {user.nome}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>SIAPE:</strong> {user.siape}</div>
                <div><strong>Departamento:</strong> {user.departamento}</div>
                <div><strong>Titulação:</strong> {user.titulacao}</div>
                <div><strong>Telefone:</strong> {user.telefone}</div>
                <div><strong>Tipo de Usuário:</strong> {user.user_type || user.role}</div>
              </div>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeuPerfilCoordenador;