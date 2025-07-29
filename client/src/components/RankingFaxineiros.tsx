import React, { useEffect, useState } from "react";
import axios from "axios";

type RankingFaxineiro = {
  nome: string;
  habitats_higienizados: number;
};

export default function RankingFaxineiros() {
  const [ranking, setRanking] = useState<RankingFaxineiro[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchRanking() {
    setLoading(true);
    try {
      const res = await axios.get<RankingFaxineiro[]>(
        `http://localhost:8000/faxineiros/ranking`
      );
      await new Promise((r) => setTimeout(r, 800));
      setRanking(res.data);
    } catch (error) {
      console.error(error);
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRanking();
  }, []);

  return (
    <div className="bg-[#081028] p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">
          Faxineiros em Destaque
        </h3>
        <button
          onClick={fetchRanking}
          className={`px-3 py-1 rounded border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent`}
          disabled={loading}
        >
          {loading ? "Recarregando..." : "Recarregar"}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 italic font-medium select-none">
          Carregando...
        </p>
      ) : ranking.length === 0 ? (
        <p className="text-red-400 font-semibold select-none">
          Nenhum faxineiro encontrado.
        </p>
      ) : (
        <ol className="divide-y divide-gray-700 rounded overflow-hidden">
          {ranking.map((item, i) => (
            <li
              key={i}
              className="py-3 px-4 hover:bg-[#0f1a3a] transition cursor-default"
            >
              <span className="text-blue-300 font-medium">{item.nome}</span>{" "}
              <span className="text-gray-300 text-sm">
                — {item.habitats_higienizados} habitats higienizados
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
