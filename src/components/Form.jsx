function Form() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl flex flex-col md:flex-row">
      {/* Div da imagem */}
      <div className="flex-shrink-0 flex items-start justify-center mr-4">
        <img
          src="../public/logoSigoTCC.svg" // Substitua pelo link da sua imagem
          alt="Login Illustration"
          className="w-80 h-auto" // Ajuste o tamanho da imagem aqui
        />
      </div>

      {/* Div do formulário */}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold mb-2 text-center text-[#2F9E41]">Login</h2>
        <div className="h-1 bg-[#2F9E41] w-24 mx-auto mb-6 rounded-full"></div>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold text-black-600 mb-3">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu email"
              className="w-full p-3 border border-[#2F9E41] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="senha" className="block font-bold text-black-600 mb-3">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              className="w-full p-3 border border-[#2F9E41] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F9E41]"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
          {/* Lembre-se de mim */}
          <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="mr-2 bg-white border-[#2F9E41] text-[#2F9E41] focus:ring-[#2F9E41] focus:ring-2 rounded"
          />
          <label htmlFor="remember" className="text-gray-600 text-sm">Lembre-se de mim</label>
        </div>
          {/* Esqueceu a senha */}
          <a href="/esqueceu-senha" className="text-blue-500 text-sm hover:underline">Esqueceu a senha?</a>
        </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Entrar
          </button>
          {/* Links adicionais */}
  
          <div className="mt-2 text-center">
            <span className="text-gray-600">Não tem conta? </span>
            <a href="/cadastro" className="text-blue-500 hover:underline">Crie agora</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;