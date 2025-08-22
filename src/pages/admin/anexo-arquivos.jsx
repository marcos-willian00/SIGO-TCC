import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AdminMenu from "./admin-menu";
import httpClient from "../../services/api";
import { 
  FiUpload, 
  FiFile, 
  FiDownload, 
  FiTrash2, 
  FiPlus,
  FiFileText,
  FiFilePlus,
  FiX,
  FiFolder,
  FiCalendar
} from "react-icons/fi";

export default function AnexoArquivos() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Buscar arquivos existentes
  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    setLoading(true);
    try {
      // Endpoint fictício - será implementado no backend posteriormente
      const response = await httpClient.get("/admin/files");
      setFiles(response.data);
    } catch (error) {
      console.log("Endpoint não implementado ainda:", error);
      // Dados mockados para demonstração
      setFiles([
        {
          id: 1,
          nome: "Modelo_TCC_2024.pdf",
          tamanho: "2.4 MB",
          tipo: "application/pdf",
          uploadedAt: "2024-01-15T10:30:00Z",
          uploadedBy: "Admin"
        },
        {
          id: 2,
          nome: "Regulamento_TCC.docx",
          tamanho: "1.8 MB",
          tipo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          uploadedAt: "2024-01-10T14:20:00Z",
          uploadedBy: "Admin"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Manipular seleção de arquivos
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Upload de arquivos
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("Selecione pelo menos um arquivo para upload.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });

      // Endpoint fictício - será implementado no backend posteriormente
      await httpClient.post("/admin/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`${selectedFiles.length} arquivo(s) enviado(s) com sucesso!`);
      setSelectedFiles([]);
      setShowUploadModal(false);
      await fetchFiles();
    } catch (error) {
      console.log("Endpoint não implementado ainda:", error);
      // Simulação de sucesso para demonstração
      toast.success(`${selectedFiles.length} arquivo(s) enviado(s) com sucesso! (Simulado)`);
      setSelectedFiles([]);
      setShowUploadModal(false);
    } finally {
      setUploading(false);
    }
  };

  // Excluir arquivo
  const handleDeleteFile = async (fileId) => {
    if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

    try {
      // Endpoint fictício - será implementado no backend posteriormente
      await httpClient.delete(`/admin/files/${fileId}`);
      toast.success("Arquivo excluído com sucesso!");
      await fetchFiles();
    } catch (error) {
      console.log("Endpoint não implementado ainda:", error);
      // Simulação de sucesso para demonstração
      setFiles(files.filter(file => file.id !== fileId));
      toast.success("Arquivo excluído com sucesso! (Simulado)");
    }
  };

  // Download de arquivo
  const handleDownloadFile = async (fileId, fileName) => {
    try {
      // Endpoint fictício - será implementado no backend posteriormente
      const response = await httpClient.get(`/admin/files/${fileId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Endpoint não implementado ainda:", error);
      toast.info("Funcionalidade de download será implementada no backend.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenu />
      <div className="flex-1 ml-64">
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#2F9E41] bg-opacity-15 p-3 rounded-lg border border-[#2F9E41] border-opacity-20">
                    <FiFolder className="h-8 w-8 text-[#2F9E41]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Arquivos</h1>
                    <p className="text-gray-600">Gerencie documentos e anexos do sistema acadêmico</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 bg-[#2F9E41] text-white px-6 py-3 rounded-lg hover:bg-[#217a32] transition-colors font-medium shadow-sm"
                >
                  <FiPlus className="h-5 w-5" />
                  Adicionar Arquivo
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Arquivos</p>
                    <p className="text-2xl font-bold text-gray-900">{files.length}</p>
                    <p className="text-sm text-gray-500">Documentos</p>
                  </div>
                  <div className="bg-blue-50 rounded-full p-3">
                    <FiFile className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Espaço Utilizado</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {files.reduce((total, file) => {
                        const size = parseFloat(file.tamanho.replace(' MB', ''));
                        return total + size;
                      }, 0).toFixed(1)} MB
                    </p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                  <div className="bg-green-50 rounded-full p-3">
                    <FiUpload className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Arquivos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FiFileText className="h-5 w-5 text-[#2F9E41]" />
                  <h2 className="text-lg font-semibold text-gray-900">Arquivos do Sistema</h2>
                </div>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F9E41] mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando arquivos...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="p-8 text-center">
                  <FiFile className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Nenhum arquivo encontrado</p>
                  <p className="text-gray-600 mb-4">Comece adicionando seu primeiro arquivo ao sistema</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#217a32] transition-colors mx-auto"
                  >
                    <FiPlus className="h-4 w-4" />
                    Adicionar Primeiro Arquivo
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Arquivo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tamanho
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Upload
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {files.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-50 rounded-full p-2">
                                <FiFile className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{file.nome}</div>
                                <div className="text-sm text-gray-500">Enviado por: {file.uploadedBy}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 font-medium">{file.tamanho}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              file.tipo.includes('pdf') ? 'bg-red-100 text-red-800' :
                              file.tipo.includes('word') ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {file.tipo.includes('pdf') ? 'PDF' : 
                               file.tipo.includes('word') ? 'Word' : 
                               'Documento'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {new Date(file.uploadedAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDownloadFile(file.id, file.nome)}
                                className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                title="Download"
                              >
                                <FiDownload className="h-4 w-4" />
                                Download
                              </button>
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                title="Excluir"
                              >
                                <FiTrash2 className="h-4 w-4" />
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal de Upload */}
            {showUploadModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4">
                  {/* Header do Modal */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#2F9E41] bg-opacity-10 p-2 rounded-lg">
                        <FiUpload className="h-5 w-5 text-[#2F9E41]" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Upload de Arquivo</h2>
                    </div>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Conteúdo do Modal */}
                  <div className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selecionar Arquivos
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                        />
                        <div className="border-2 border-dashed border-[#2F9E41] border-opacity-50 rounded-lg p-8 text-center hover:border-[#2F9E41] transition-colors">
                          <FiFilePlus className="h-12 w-12 text-[#2F9E41] mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            Clique para selecionar arquivos
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            ou arraste e solte aqui
                          </p>
                          <p className="text-xs text-gray-500">
                            Formatos aceitos: PDF, Word, Excel, Texto
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                          Arquivos Selecionados ({selectedFiles.length})
                        </h3>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FiFile className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-900 truncate max-w-xs">{file.name}</span>
                              </div>
                              <span className="text-xs text-gray-500 font-medium">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer do Modal */}
                  <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      disabled={uploading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={selectedFiles.length === 0 || uploading}
                      className="flex items-center gap-2 px-6 py-2 bg-[#2F9E41] text-white rounded-lg hover:bg-[#217a32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <FiUpload className="h-4 w-4" />
                          Enviar Arquivos
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
