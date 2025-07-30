import { useEffect, useState } from "react";
import axios from "axios";

interface Habitat {
  nome: string;
}

const PAGE_SIZE = 7;

export default function HabitatsMedicados() {
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchHabitats() {
    setLoading(true);
    try {
      const res = await axios.get<Habitat[]>(
        "http://localhost:8000/habitats/medicados"
      );
      await new Promise((resolve) => setTimeout(resolve, 800));
      setHabitats(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao buscar habitats:", error);
      setHabitats([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHabitats();
  }, []);

  const totalPages = Math.ceil(habitats.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentHabitats = habitats.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="bg-[#081028] p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">
          Habitats com Animais Medicados
        </h3>
        <button
          onClick={fetchHabitats}
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
      ) : habitats.length === 0 ? (
        <p className="text-red-400 font-semibold select-none">
          Nenhum habitat encontrado.
        </p>
      ) : (
        <>
          <ul
            className="divide-y divide-gray-700 mb-4 rounded"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            {currentHabitats.map((item, i) => (
              <li
                key={i}
                className="py-3 px-4 hover:bg-[#0f1a3a] cursor-default rounded transition"
              >
                <span className="text-gray-200 select-text">{item.nome}</span>
              </li>
            ))}
          </ul>

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
