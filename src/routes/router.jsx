import { Route, Routes } from 'react-router-dom';
import RecuperarSenha from '../components/RecuperarSenha';
import CodigoRecuperacao from '../components/CodigoRecuperacao';
import NovaSenha from '../components/NovaSenha';
import Login from '../pages/auth/Login';
import SignUp from '../pages/auth/SignUp';
import MainpageAluno from '../pages/aluno/MainpageAluno';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<SignUp />} />
      <Route path="/recupera-senha" element={<RecuperarSenha />} />
      <Route path="/codigo-de-recuperacao" element={<CodigoRecuperacao />} />
      <Route path="/nova-senha" element={<NovaSenha />} />
      <Route path="/aluno" element={<MainpageAluno />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default Router;
