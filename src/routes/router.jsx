import { Route, Routes } from 'react-router-dom';
import TokenDebug from '../pages/auth/TokenDebug';
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
import AnexoArquivos from '../pages/admin/anexo-arquivos';
import MeuPerfilCoordenador from '../pages/coordenador/meu-perfil-coordenador';
import MeuPerfilProfessor from '../pages/professor/meu-perfil-professor';
import ProfessoresDepartamento from '../pages/coordenador/professores-departamento';
import OrientandosProfessor from '../pages/professor/orientados-professor';
import TarefasProfessor from '../pages/professor/tarefas-professor';
import TarefasAluno from '../pages/aluno/tarefas-aluno';
import ConvitesAluno from '../pages/aluno/convites-aluno';
import TodosProfessores from '../pages/aluno/professores-aluno';
import MainpageAlunoOrientando from '../pages/aluno/mainpage-aluno-orientando';
import MeuOrientador from '../pages/aluno/meu-orientador';
import Documentacao from '../pages/professor/documentacao-professor';
import DocumentacaoAluno from '../pages/aluno/documentacao-aluno';
import GerenciarAlunos from '../pages/admin/gerenciar-alunos';
import GerenciarProfessores from '../pages/admin/gerenciar-professores';
import GerenciarAlunosCoordenador from '../pages/coordenador/gerenciar-alunos';
import AlunosDepartamento from '../pages/coordenador/alunos-departamento';
import ProfessoresCadastrados from '../pages/coordenador/professores-cadastrados';
import TrabalhosCoordenador from '../pages/coordenador/trabalhos-coordenador';
import PerfilAdmin from '../pages/admin/perfil-admin';

// Adicione o import da página de convites recebidos do professor
import ConvitesRecebidosProfessor from '../pages/professor/convites-recebidos';
// Se você usa a versão "new" dos orientados, troque o import abaixo:
// import OrientandosProfessor from '../pages/professor/orientados-professor-new';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<SignUp />} />
      <Route path="/recupera-senha" element={<RecuperarSenha />} />
      <Route path="/codigo-de-recuperacao" element={<CodigoRecuperacao />} />
      <Route path="/nova-senha" element={<NovaSenha />} />
      <Route path="/aluno" element={<MainpageAluno />} />
      <Route path="/aluno/meu-perfil-aluno" element={<MeuPerfilAluno />} />
      <Route path="/professor" element={<MainpageProfessor />} />
      <Route path="/coordenador" element={<MainpageCoordenador />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/cursos-admin" element={<CursosAdmin />} />
      <Route path="/admin/anexo-arquivos" element={<AnexoArquivos />} />
      <Route path="/coordenador/meu-perfil-coordenador" element={<MeuPerfilCoordenador />} />
      <Route path="/professor/meu-perfil-professor" element={<MeuPerfilProfessor />} />
      <Route path="/coordenador/professores-departamento" element={<ProfessoresDepartamento />} />
      <Route path="/professor/orientados-professor" element={<OrientandosProfessor />} />
      <Route path="/professor/tarefas-professor" element={<TarefasProfessor />} />
      <Route path="/aluno/tarefas-aluno" element={<TarefasAluno />} />
      <Route path="/aluno/convites-aluno" element={<ConvitesAluno />} />
      <Route path="/aluno/professores-aluno" element={<TodosProfessores />} />
      <Route path="/aluno/orientador" element={<MeuOrientador />} />
      <Route path="/aluno/mainpage-aluno-orientando" element={<MainpageAlunoOrientando />} />
      <Route path="/admin/gerenciar-alunos" element={<GerenciarAlunos />} />
      <Route path="/admin/gerenciar-professores" element={<GerenciarProfessores />} />
      <Route path="/admin/perfil" element={<PerfilAdmin />} />
      <Route path="/coordenador/gerenciar-alunos" element={<GerenciarAlunosCoordenador />} />
      <Route path="/coordenador/alunos" element={<AlunosDepartamento />} />
      <Route path="/coordenador/professores" element={<ProfessoresCadastrados />} />
      <Route path="/coordenador/trabalhos" element={<TrabalhosCoordenador />} />
      <Route path="/professor/documentacao-professor" element={<Documentacao />} />
      <Route path="/aluno/documentacao-aluno" element={<DocumentacaoAluno />} />
      {/* Adicione a rota para convites recebidos do professor */}
      <Route path="/professor/convites-recebidos" element={<ConvitesRecebidosProfessor />} />
      {/* Rotas de fallback */}
    <Route path="/debug-token" element={<TokenDebug />} />
  <Route path="/debug-token" element={<TokenDebug />} />
    <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default Router;