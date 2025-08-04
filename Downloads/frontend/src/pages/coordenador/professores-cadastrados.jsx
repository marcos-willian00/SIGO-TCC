import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ProfessoresCadastrados = () => {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/coordenador/professores');
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
      toast.error('Erro ao carregar dados dos professores');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessores = professores.filter(professor => {
    const matchesSearch = 
      professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.siape.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (professor.departamento && professor.departamento.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || professor.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'coordenador':
        return 'bg-blue-100 text-blue-800';
      case 'professor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'coordenador':
        return 'Coordenador';
      case 'professor':
        return 'Professor';
      default:
        return role;
    }
  };

  const roleStats = {
    total: professores.length,
    admin: professores.filter(p => p.role === 'admin').length,
    coordenador: professores.filter(p => p.role === 'coordenador').length,
    professor: professores.filter(p => p.role === 'professor').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Professores Cadastrados
        </h1>
        <p className="text-gray-600">
          Visualize todos os professores cadastrados no sistema
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-500">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-700">{roleStats.total}</div>
              <div className="text-sm text-gray-600">Total de Professores</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-600">{roleStats.professor}</div>
              <div className="text-sm text-gray-600">Professores</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-blue-600">{roleStats.coordenador}</div>
              <div className="text-sm text-gray-600">Coordenadores</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-600">{roleStats.admin}</div>
              <div className="text-sm text-gray-600">Administradores</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de filtro */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Barra de busca */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nome, email, SIAPE ou departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por role */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por:</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os cargos</option>
              <option value="professor">Professores</option>
              <option value="coordenador">Coordenadores</option>
              <option value="admin">Administradores</option>
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>Mostrando {filteredProfessores.length} de {professores.length} professores</span>
          {searchTerm && (
            <span className="text-blue-600">
              Resultados para: "{searchTerm}"
            </span>
          )}
        </div>
      </div>

      {/* Lista de professores */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredProfessores.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg">Nenhum professor encontrado</p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-2">
                Tente ajustar os filtros de busca
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            {/* Header da tabela - apenas em telas grandes */}
            <div className="hidden lg:grid lg:grid-cols-7 bg-gray-50 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div>Professor</div>
              <div>SIAPE</div>
              <div>Departamento</div>
              <div>Titulação</div>
              <div>Cargo</div>
              <div>Contato</div>
              <div>Ações</div>
            </div>
            
            {/* Lista de professores */}
            <div className="divide-y divide-gray-200">
              {filteredProfessores.map((professor) => (
                <div key={professor.id} className="p-6 hover:bg-gray-50 transition-colors">
                  {/* Layout mobile */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-lg font-bold text-white">
                          {professor.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{professor.nome}</h3>
                        <p className="text-sm text-gray-600">{professor.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">SIAPE:</span>
                        <p className="text-gray-600">{professor.siape}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Cargo:</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(professor.role)}`}>
                            {getRoleDisplayName(professor.role)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Departamento:</span>
                        <p className="text-gray-600">{professor.departamento || 'Não informado'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Titulação:</span>
                        <p className="text-gray-600">{professor.titulacao || 'Não informado'}</p>
                      </div>
                    </div>
                    
                    {(professor.telefone || professor.google_agenda_url) && (
                      <div className="flex flex-wrap gap-2">
                        {professor.telefone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {professor.telefone}
                          </div>
                        )}
                        {professor.google_agenda_url && (
                          <a 
                            href={professor.google_agenda_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Ver Agenda
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Layout desktop */}
                  <div className="hidden lg:grid lg:grid-cols-7 lg:gap-4 lg:items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">
                          {professor.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{professor.nome}</div>
                        <div className="text-sm text-gray-500">{professor.email}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-900">{professor.siape}</div>
                    
                    <div className="text-sm text-gray-900">{professor.departamento || 'Não informado'}</div>
                    
                    <div className="text-sm text-gray-900">{professor.titulacao || 'Não informado'}</div>
                    
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(professor.role)}`}>
                        {getRoleDisplayName(professor.role)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {professor.telefone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {professor.telefone}
                        </div>
                      )}
                      {professor.google_agenda_url && (
                        <a 
                          href={professor.google_agenda_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Agenda
                        </a>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <a 
                        href={`mailto:${professor.email}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessoresCadastrados;
