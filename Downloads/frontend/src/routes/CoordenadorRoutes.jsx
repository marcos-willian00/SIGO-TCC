import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayoutCoordenador from '../layout/LayoutCoordenador';
import CoordenadorMenu from '../pages/coordenador/coordenador-menu';
import AlunosDepartamento from '../pages/coordenador/alunos-departamento';
import ProfessoresCadastrados from '../pages/coordenador/professores-cadastrados';
import ProfessoresDepartamento from '../pages/coordenador/professores-departamento';

const CoordenadorRoutes = () => {
  return (
    <LayoutCoordenador>
      <Routes>
        <Route path="/menu" element={<CoordenadorMenu />} />
        <Route path="/alunos" element={<AlunosDepartamento />} />
        <Route path="/professores" element={<ProfessoresCadastrados />} />
        <Route path="/professores-departamento" element={<ProfessoresDepartamento />} />
        <Route path="/" element={<CoordenadorMenu />} />
      </Routes>
    </LayoutCoordenador>
  );
};

export default CoordenadorRoutes;
