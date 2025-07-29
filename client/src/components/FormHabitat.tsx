import React, { useState } from "react";
import axios from "axios";

export default function FormHabitat() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [tempMedia, setTempMedia] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post("http://localhost:8000/habitats", {
        nome,
        tipo,
        localizacao,
        temp_media: parseFloat(tempMedia),
      });
      setMsg(res.data.mensagem || "Habitat adicionado com sucesso!");
      setNome("");
      setTipo("");
      setLocalizacao("");
      setTempMedia("");
    } catch (error: any) {
      setMsg(
        "Erro ao adicionar habitat: " +
          (error.response?.data?.erro || error.message)
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#081028] p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold text-white mb-2">Novo Habitat</h2>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        required
        className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Localização"
        value={localizacao}
        onChange={(e) => setLocalizacao(e.target.value)}
        required
        className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="number"
        step="0.1"
        placeholder="Temperatura média"
        value={tempMedia}
        onChange={(e) => setTempMedia(e.target.value)}
        required
        className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className={`px-3 py-1 rounded border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent`}
      >
        Adicionar
      </button>

      {msg && (
        <p
          className={`mt-2 text-sm ${
            msg.toLowerCase().includes("sucesso") ||
            msg.toLowerCase().includes("adicionado")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
