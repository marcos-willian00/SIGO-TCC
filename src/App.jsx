import { Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import RecuperarSenha from "./components/RecuperarSenha";
import CodigoRecuperacao from "./components/CodigoRecuperacao";
import NovaSenha from "./components/NovaSenha";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/RecuperarSenha" element={<RecuperarSenha />} />
      <Route path="/CodigoRecuperacao" element={<CodigoRecuperacao />} />
      <Route path="/NovaSenha" element={<NovaSenha />} />
      <Route path="*" element={<Form />} />
    </Routes>
  );
}

export default App;