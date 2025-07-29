import React, { useState } from "react";
import axios from "axios";

export default function FormFuncionario() {
  const [nome, setNome] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post("http://localhost:8000/funcionarios", {
        nome,
        data_admissao: dataAdmissao,
        cpf,
        email,
        endereco,
      });
      setMsg(res.data.mensagem || "Funcionário adicionado com sucesso!");
      setNome("");
      setDataAdmissao("");
      setCpf("");
      setEmail("");
      setEndereco("");
    } catch (error: any) {
      setMsg(
        "Erro ao adicionar funcionário: " +
          (error.response?.data?.erro || error.message)
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#081028] p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold text-white mb-2">
        Novo Funcionário
      </h2>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        value={dataAdmissao}
        onChange={(e) => setDataAdmissao(e.target.value)}
        required
        className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        required
        className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Endereço"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
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
