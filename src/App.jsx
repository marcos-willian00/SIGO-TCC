import { Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import RecuperarSenha from "./components/RecuperarSenha";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/RecuperarSenha" element={<RecuperarSenha />} />
      <Route path="*" element={<Form />} />
    </Routes>
  );
}

export default App;