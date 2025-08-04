import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AdminMenu from "./admin-menu";
import httpClient from "../../services/api";

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
      <div className="flex-1 ml-64 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2F9E41]">Anexo de Arquivos</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#2F9E41] text-white px-6 py-2 rounded-lg hover:bg-[#217a32] transition font-semibold shadow flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Arquivo
          </button>
        </div>

        {/* Lista de Arquivos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#2F9E41]">Arquivos do Sistema</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Carregando arquivos...</div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">Nenhum arquivo encontrado</div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#217a32] transition"
              >
                Adicionar Primeiro Arquivo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-semibold">Nome do Arquivo</th>
                    <th className="py-3 px-4 font-semibold">Tamanho</th>
                    <th className="py-3 px-4 font-semibold">Tipo</th>
                    <th className="py-3 px-4 font-semibold">Data Upload</th>
                    <th className="py-3 px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {file.nome}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{file.tamanho}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {file.tipo.includes('pdf') ? 'PDF' : 
                           file.tipo.includes('word') ? 'Word' : 
                           'Documento'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(file.uploadedAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadFile(file.id, file.nome)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                            title="Download"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                            title="Excluir"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#2F9E41]">Upload de Arquivo</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Selecionar Arquivos
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="w-full border-2 border-dashed border-[#2F9E41] rounded-lg p-4 text-center cursor-pointer hover:border-[#217a32] transition"
                  accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Formatos aceitos: PDF, Word, Excel, Texto
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Arquivos Selecionados:</h3>
                  <div className="max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className="px-6 py-2 bg-[#2F9E41] text-white rounded-lg hover:bg-[#217a32] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
