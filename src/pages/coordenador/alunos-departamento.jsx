import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AlunosDepartamento = () => {
  const [alunos, setAlunos] = useState([]);
  const [alunosAtivos, setAlunosAtivos] = useState([]);
  const [cursoInfo, setCursoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      setLoading(true);
      
      // Buscar informações do curso
      const cursoResponse = await api.get('/coordenador/curso/info');
      setCursoInfo(cursoResponse.data);
      
      // Buscar todos os alunos
      const todosAlunosResponse = await api.get('/coordenador/alunos');
      setAlunos(todosAlunosResponse.data);
      
      // Buscar apenas alunos ativos
      const alunosAtivosResponse = await api.get('/coordenador/alunos/ativos');
      setAlunosAtivos(alunosAtivosResponse.data);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados dos alunos');
    } finally {
      setLoading(false);
    }
  };

  const handleArquivar = async (estudanteId, nome) => {
    try {
      await api.put(`/coordenador/alunos/${estudanteId}/arquivar`);
      toast.success(`Aluno ${nome} foi arquivado com sucesso`);
      fetchDados(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao arquivar aluno:', error);
      toast.error('Erro ao arquivar aluno');
    }
  };

  const handleDesarquivar = async (estudanteId, nome) => {
    try {
      await api.put(`/coordenador/alunos/${estudanteId}/desarquivar`);
      toast.success(`Aluno ${nome} foi desarquivado com sucesso`);
      fetchDados(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao desarquivar aluno:', error);
      toast.error('Erro ao desarquivar aluno');
    }
  };

  const filteredAlunos = (showAll ? alunos : alunosAtivos).filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header com informações do curso */}
      {cursoInfo && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Alunos do Curso: {cursoInfo.nome_curso}
          </h1>
          <p className="text-gray-600">
            Coordenador: {cursoInfo.coordenador?.nome || 'Não definido'}
          </p>
        </div>
      )}

      {/* Controles */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Barra de busca */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por nome, matrícula ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Toggle para mostrar todos ou apenas ativos */}
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                className="mr-2"
              />
              Mostrar alunos arquivados
            </label>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span>Total: {alunos.length}</span>
          <span>Ativos: {alunosAtivos.length}</span>
          <span>Arquivados: {alunos.length - alunosAtivos.length}</span>
        </div>
      </div>

      {/* Lista de alunos */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredAlunos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhum aluno encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matrícula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlunos.map((aluno) => (
                  <tr key={aluno.id} className={aluno.arquivado ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {aluno.nome}
                          </div>
                          {aluno.telefone && (
                            <div className="text-sm text-gray-500">
                              {aluno.telefone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aluno.matricula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aluno.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aluno.turma || 'Não definida'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        aluno.arquivado 
                          ? 'bg-gray-200 text-gray-800' 
                          : aluno.status === 'ativo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {aluno.arquivado ? 'Arquivado' : aluno.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {aluno.arquivado ? (
                        <button
                          onClick={() => handleDesarquivar(aluno.id, aluno.nome)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Desarquivar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArquivar(aluno.id, aluno.nome)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Arquivar
                        </button>
                      )}
                      <button
                        onClick={() => {
                          // Aqui você pode adicionar funcionalidade para ver detalhes do aluno
                          console.log('Ver detalhes do aluno:', aluno);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlunosDepartamento;
