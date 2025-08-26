import React, { useEffect, useState } from "react";

export default function TokenDebug() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t || "(nenhum token encontrado)");
    if (t) {
      fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${t}` },
      })
        .then((res) => res.json())
        .then((data) => setUserInfo(data))
        .catch((err) => setError("Erro ao buscar informações do usuário."));
    }
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Token Debug</h2>
      <div><strong>Token salvo no localStorage:</strong></div>
      <pre style={{ background: "#eee", padding: 8 }}>{token}</pre>
      <div><strong>Informações do usuário (endpoint /auth/me):</strong></div>
      <pre style={{ background: "#eee", padding: 8 }}>{userInfo ? JSON.stringify(userInfo, null, 2) : error || "Carregando..."}</pre>
    </div>
  );
}
