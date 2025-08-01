import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import axios from "axios";
import AlunoMenu from "./aluno-menu";

const getCorPorOrientandos = (orientandos) => {
  if (orientandos >= 6) {
    return "text-red-600";
  }
  if (orientandos >= 3) {
    return "text-yellow-500";
  }
  return "text-green-600";
};

export default function TodosProfessores() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProfessores = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado.");
      }

      const response = await axios.get("http://localhost:8000/students/professors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const listaCompleta = response.data;
      const listaFiltrada = listaCompleta.filter(
        (usuario) => usuario.role !== 'admin'
      );

      setProfessores(listaFiltrada);

    } catch (err) {
      setError("Falha ao carregar os professores. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfessores();
}, []);

  return (
  <>
    <AlunoMenu />
    <div className="min-h-screen bg-gray-100 md:ml-64">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-green-600 sm:text-3xl mb-8">
          Professores
        </h1>

        {loading && <p className="text-center text-gray-600">Carregando professores...</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {professores.map((prof) => (
              <div
                key={prof.id}
                className="w-full rounded-lg border border-green-600 bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    {prof.nome}
                  </h2>
                  <Eye className="h-5 w-5 text-gray-500" />
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>Curso:</strong> {prof.departamento}
                  </p>
                  <p className="text-gray-700">
                    <strong>Área:</strong> {prof.departamento || "Não especificada"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Nº de Orientandos:</strong>{" "}
                    <span
                      className={`font-bold ${getCorPorOrientandos(
                        prof.orientandos_count
                      )}`}
                    >
                      {prof.orientandos_count}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </>
);
}