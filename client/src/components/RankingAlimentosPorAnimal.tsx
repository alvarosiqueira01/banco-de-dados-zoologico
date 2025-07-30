import { useEffect, useState } from "react";
import axios from "axios";

interface RankingItem {
  nome_animal: string;
  especie: string;
  alimento: string;
  fornecedor: string;
  quantidade_consumida: number;
  ranking_consumo: number;
}

const PAGE_SIZE = 8;

export default function RankingAlimentosPorAnimal() {
  const [dados, setDados] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchRanking() {
    setLoading(true);
    try {
      const res = await axios.get<RankingItem[]>(
        "http://localhost:8000/animais/ranking-alimentos"
      );
      await new Promise((resolve) => setTimeout(resolve, 800));
      setDados(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
      setDados([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRanking();
  }, []);

  const totalPages = Math.ceil(dados.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentItems = dados.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="bg-[#081028] p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">
          Ranking de Alimentos por Animal
        </h3>
        <button
          onClick={fetchRanking}
          disabled={loading}
          className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
        >
          {loading ? "Recarregando..." : "Recarregar"}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 italic font-medium select-none">
          Carregando...
        </p>
      ) : dados.length === 0 ? (
        <p className="text-red-400 font-semibold select-none">
          Nenhum dado encontrado.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-600 text-sm">
              <thead className="bg-[#1c2a40] text-gray-300 text-left">
                <tr>
                  <th className="px-4 py-2">Animal</th>
                  <th className="px-4 py-2">Espécie</th>
                  <th className="px-4 py-2">Alimento</th>
                  <th className="px-4 py-2">Fornecedor</th>
                  <th className="px-4 py-2">Qtd. (kg)</th>
                  <th className="px-4 py-2">Ranking</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, i) => (
                  <tr key={i} className="hover:bg-[#1a243f] transition">
                    <td className="px-4 py-2 border-t border-gray-700">
                      {item.nome_animal}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-700">
                      {item.especie}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-700">
                      {item.alimento}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-700">
                      {item.fornecedor}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-700">
                      {item.quantidade_consumida.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-700">
                      #{item.ranking_consumo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-center gap-3 text-gray-300 select-none">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-600 bg-transparent hover:border-blue-500 hover:text-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt; Anterior
            </button>
            <span className="px-3 py-1 text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-600 bg-transparent hover:border-blue-500 hover:text-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
