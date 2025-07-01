import ProfessorMenu from "../../pages/professor/menu-professor";

const documentos = [
  {
    id: 1,
    titulo: "Termos de Uso",
    descricao: "Aqui estão os termos de uso da plataforma",
    url: "/docs/termos.pdf",
    destaque: true
  },
  {
    id: 2,
    titulo: "Modelo padrão",
    descricao: "Aqui está o modelo de TCC padrão da biblioteca do IFCE Campus Cedro.",
    url: "../public/docs/modelo.pdf",
    destaque: false
  },
  {
    id: 3,
    titulo: "TCC de Érica Costa",
    descricao:
      "Viés cognitivo de questões sociais e éticos no desenvolvimento de novas tecnologias",
    url: "/docs/tcc-erica.pdf",
    destaque: false
  }
];

export default function DocumentacaoAluno() {
  return (
    <>
    <ProfessorMenu />
    <div className="ml-64 w-full max-w-7xl mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-2">Documentação</h1>
      <p className="text-gray-500 mb-6">
        Aqui está nosso acervo e documentos importantes
      </p>

      <div className="grid md:grid-cols-2 gap-6 ">
        {documentos.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white ${
              doc.destaque ? "" : ""
            }`}
          >
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src="../public/pdf-icon.png"
                alt="PDF"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h2 className="text-md font-bold text-[#1C1C1C]">{doc.titulo}</h2>
              <p className="text-sm text-gray-600">{doc.descricao}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
    </>
  );
}
