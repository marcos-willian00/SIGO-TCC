import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import AdminMenu from "./admin-menu";
import { FiUser, FiMail, FiPhone, FiEdit, FiSave, FiX, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function PerfilAdmin() {
  const [admin, setAdmin] = useState({
    id: null,
    nome: "",
    email: "",
    telefone: "",
    role: "admin"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [editedAdmin, setEditedAdmin] = useState({
    nome: "",
    telefone: ""
  });

  // Buscar dados do admin
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
        setEditedAdmin({
          nome: data.nome,
          telefone: data.telefone || ""
        });
      } else {
        toast.error("Erro ao carregar dados do perfil.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Salvar alterações do perfil
  const handleSaveProfile = async () => {
    if (!editedAdmin.nome.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: editedAdmin.nome.trim(),
          telefone: editedAdmin.telefone.trim() || null
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAdmin(updatedData);
        setIsEditing(false);
        toast.success("Perfil atualizado com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Erro ao atualizar perfil.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  // Alterar senha
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Senha atual é obrigatória.");
      return;
    }
    if (!passwordData.newPassword) {
      toast.error("Nova senha é obrigatória.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Nova senha e confirmação não coincidem.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        toast.success("Senha alterada com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Erro ao alterar senha.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedAdmin({
      nome: admin.nome,
      telefone: admin.telefone || ""
    });
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminMenu />
        <div className="flex-1 ml-64 p-10">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F9E41] mx-auto mb-4"></div>
            <p>Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminMenu />
      <div className="flex-1 ml-64 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2F9E41]">Meu Perfil</h1>
          <div className="flex gap-2">
            {!isEditing && !isChangingPassword && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#25803A] transition"
                >
                  <FiEdit /> Editar Perfil
                </button>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  <FiLock /> Alterar Senha
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Perfil */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
            
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiUser className="inline mr-2" />
                  Nome
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedAdmin.nome}
                    onChange={(e) => setEditedAdmin({ ...editedAdmin, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F9E41] focus:border-transparent"
                    placeholder="Digite seu nome"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{admin.nome}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiMail className="inline mr-2" />
                  Email
                </label>
                <p className="text-gray-900 font-medium">{admin.email}</p>
                <p className="text-xs text-gray-500">O email não pode ser alterado</p>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiPhone className="inline mr-2" />
                  Telefone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedAdmin.telefone}
                    onChange={(e) => setEditedAdmin({ ...editedAdmin, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F9E41] focus:border-transparent"
                    placeholder="Digite seu telefone (opcional)"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{admin.telefone || "Não informado"}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Administrador
                </span>
              </div>
            </div>

            {/* Botões de ação para edição */}
            {isEditing && (
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#2F9E41] text-white px-4 py-2 rounded-lg hover:bg-[#25803A] transition disabled:opacity-50"
                >
                  <FiSave /> {saving ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                >
                  <FiX /> Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Alterar Senha */}
          {isChangingPassword && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Alterar Senha</h2>
              
              <div className="space-y-4">
                {/* Senha Atual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F9E41] focus:border-transparent"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Nova Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F9E41] focus:border-transparent"
                      placeholder="Digite a nova senha (min. 6 caracteres)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Nova Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F9E41] focus:border-transparent"
                      placeholder="Confirme a nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botões de ação para senha */}
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  <FiLock /> {saving ? "Alterando..." : "Alterar Senha"}
                </button>
                <button
                  onClick={handleCancelPassword}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                >
                  <FiX /> Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Informações da Conta (quando não está alterando senha) */}
          {!isChangingPassword && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações da Conta</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Nível de Acesso</h3>
                    <p className="text-sm text-gray-600">Administrador do Sistema</p>
                  </div>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Admin
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Permissões</h3>
                    <p className="text-sm text-gray-600">Acesso completo ao sistema</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Total
                  </span>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Funcionalidades Disponíveis</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Gerenciar todos os usuários</li>
                    <li>• Gerenciar cursos</li>
                    <li>• Arquivar/desarquivar alunos</li>
                    <li>• Gerenciar arquivos do sistema</li>
                    <li>• Acesso a relatórios e estatísticas</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
