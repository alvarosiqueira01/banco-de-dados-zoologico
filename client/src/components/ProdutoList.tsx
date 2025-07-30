import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

interface Produto {
  id_produto: number;
  nome: string;
  quantidade: number;
}

interface ModalProps {
  produto: Produto;
  onClose: () => void;
  onAtualizar: (produtoAtualizado: Produto) => void;
}

function EditModal({ produto, onClose, onAtualizar }: ModalProps) {
  const [quantidade, setQuantidade] = useState(produto?.quantidade || 0);
  const [msg, setMsg] = useState("");

  if (!produto) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.put("http://localhost:8000/produto/", {
        id_produto: produto.id_produto,
        nova_quantidade: quantidade,
      });
      setMsg(res.data.msg || "Atualizado com sucesso!");
      onAtualizar({ ...produto, quantidade });
      setTimeout(() => {
        setMsg("");
        onClose();
      }, 1500);
    } catch (error: any) {
      setMsg("Erro: " + (error.response?.data?.detail || error.message));
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#081028] p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Editar Produto: {produto.nome}
        </h2>
        <label className="block mb-2 text-gray-300">Quantidade</label>
        <input
          type="number"
          value={quantidade}
          min={0}
          onChange={(e) => setQuantidade(parseInt(e.target.value))}
          className="w-full bg-[#0f1a3a] text-gray-200 border border-gray-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />
        {msg && (
          <p
            className={`mb-4 text-sm ${
              msg.toLowerCase().includes("sucesso")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {msg}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 transition duration-200 bg-transparent"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded border border-blue-600 text-blue-400 hover:bg-blue-700 transition duration-200 bg-transparent"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProdutoList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [msg, setMsg] = useState("");

  const carregarProdutos = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/produtos")
      .then((res) => setProdutos(res.data))
      .catch(() => setProdutos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  function handleAtualizarProduto(produtoAtualizado: Produto) {
    setProdutos((old) =>
      old.map((p) =>
        p.id_produto === produtoAtualizado.id_produto ? produtoAtualizado : p
      )
    );
  }

  return (
    <div className="bg-[#081028] p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Lista de Produtos</h2>
        <button
          onClick={carregarProdutos}
          className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Recarregar"}
        </button>
      </div>
      {msg && (
        <p
          className={`mb-4 text-sm ${
            msg.toLowerCase().includes("sucesso")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {msg}
        </p>
      )}
      {loading ? (
        <p className="text-gray-400 italic select-none">
          Carregando produtos...
        </p>
      ) : produtos.length === 0 ? (
        <p className="text-red-400 font-semibold select-none">
          Nenhum produto encontrado.
        </p>
      ) : (
        <table className="min-w-full text-gray-200 text-sm rounded border border-gray-700 overflow-hidden">
          <thead className="bg-[#1c2a40] text-left text-gray-300">
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">ID</th>
              <th className="py-2 px-4 border-b border-gray-700">Nome</th>
              <th className="py-2 px-4 border-b border-gray-700">Quantidade</th>
              <th className="py-2 px-4 border-b border-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr
                key={produto.id_produto}
                className="hover:bg-[#162138] transition"
              >
                <td className="py-2 px-4 border-b border-gray-700 font-mono">
                  {produto.id_produto}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {produto.nome}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {produto.quantidade}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setEditProduto(produto)}
                      className="hover:text-blue-400"
                      aria-label={`Editar produto ${produto.nome}`}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editProduto && (
        <EditModal
          produto={editProduto}
          onClose={() => setEditProduto(null)}
          onAtualizar={handleAtualizarProduto}
        />
      )}
    </div>
  );
}
