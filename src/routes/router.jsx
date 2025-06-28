import { Route, Routes } from 'react-router-dom';
import RecuperarSenha from '../components/RecuperarSenha';
import CodigoRecuperacao from '../components/CodigoRecuperacao';
import NovaSenha from '../components/NovaSenha';
import Login from '../pages/auth/Login';
import SignUp from '../pages/auth/SignUp';
import MainpageAluno from '../pages/aluno/MainpageAluno';
import MainpageProfessor from '../pages/professor/MainpageProfessor';
import MainpageCoordenador from '../pages/coordenador/MainpageCoordenador';
import MeuPerfilAluno from '../pages/aluno/meu-perfil-aluno';
import AdminDashboard from '../pages/admin/admin-dashboard';
import CursosAdmin from '../pages/admin/cursos-admin';
import MeuPerfilCoordenador from '../pages/coordenador/meu-perfil-coordenador';
import MeuPerfilProfessor from '../pages/professor/meu-perfil-professor';
import ProfessoresDepartamento from '../pages/coordenador/professores-departamento';
import OrientandosProfessor from '../pages/professor/orientados-professor';
import TarefasProfessor from '../pages/professor/tarefas-professor';
import TarefasAluno from '../pages/aluno/tarefas-aluno';
import ConvitesAluno from "../pages/aluno/convites-aluno";
import MainpageAlunoOrientando from "../pages/aluno/mainpage-aluno-orientando";





function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<SignUp />} />
      <Route path="/recupera-senha" element={<RecuperarSenha />} />
      <Route path="/codigo-de-recuperacao" element={<CodigoRecuperacao />} />
      <Route path="/nova-senha" element={<NovaSenha />} />
      <Route path="/aluno" element={<MainpageAluno />} />
      <Route path="/aluno/meu-perfil-aluno" element={<MeuPerfilAluno />} /> {/* adicione esta linha */}
      <Route path="/professor" element={<MainpageProfessor />} />
      <Route path="/coordenador" element={<MainpageCoordenador />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/cursos-admin" element={<CursosAdmin />} />
      <Route path="/coordenador/meu-perfil-coordenador" element={<MeuPerfilCoordenador />} />
      <Route path="/professor/meu-perfil-professor" element={<MeuPerfilProfessor />} />
      <Route path="/coordenador/professores-departamento" element={<ProfessoresDepartamento />} />
      <Route path="/professor/orientados-professor" element={<OrientandosProfessor />} />
      <Route path="/professor/tarefas-professor" element={<TarefasProfessor />} />
      <Route path="/aluno/tarefas-aluno" element={<TarefasAluno />} />
      <Route path="/aluno/convites-aluno" element={<ConvitesAluno />} />
      <Route path="/aluno/mainpage-aluno-orientando" element={<MainpageAlunoOrientando />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );  
}

export default Router;
