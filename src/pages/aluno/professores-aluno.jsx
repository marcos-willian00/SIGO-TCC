import { Eye } from "lucide-react";
import AlunoMenu from "./aluno-menu";

const professores = [
  {
    nome: "José Emerson Costa",
    curso: "Sistemas de Informação",
    area: "Programação",
    orientandos: 3,
    cor: "text-yellow-500",
  },
  {
    nome: "José Olinda Pereira",
    curso: "Sistemas de Informação",
    area: "Lógica",
    orientandos: 6,
    cor: "text-red-600",
  },
  {
    nome: "Antonio Pereira da Costa",
    curso: "Sistemas de Informação",
    area: "LLPD",
    orientandos: 1,
    cor: "text-green-600",
  },
];

export default function TodosProfessores() {
  return (
    <>
      <AlunoMenu />
      <div className="ml-64 bg-gray-100 min-h-screen">
        <div className="px-6 py-2 bg-gray-100">
          <h1 className="text-2xl font-bold text-[#374957] ml-6 mt-8">
            Professores
          </h1>
        </div>

        <div className="w-full max-w-[1200px] mx-auto my-8 px-6 md:px-12 py-6 bg-white rounded-lg shadow min-h-64">
          <div className="ml-6 mt-8 flex flex-wrap gap-6">
            {professores.map((prof, idx) => (
              <div
                key={idx}
                className="flex-1 min-w-[300px] max-w-sm border border-green-600 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-[#1C1C1C]">
                    {prof.nome}
                  </h2>
                  <Eye className="w-5 h-5 text-gray-700" />
                </div>

                <p className="text-sm text-gray-800 mb-1">
                  <strong>Curso:</strong> {prof.curso}
                </p>
                <p className="text-sm text-gray-800 mb-1">
                  <strong>Área:</strong> {prof.area}
                </p>
                <p className="text-sm text-gray-800">
                  <strong>Nº de Orientandos:</strong>{" "}
                  <span className={prof.cor}>{prof.orientandos}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
