import { useEffect, useState } from "react";
import axios from "axios";

interface Habitat {
  id_habitat: number;
  nome: string;
  tipo: string;
  localizacao: string;
  temp_media: number;
}

const PAGE_SIZE = 6;

export default function HabitatList() {
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const carregarHabitats = () => {
    setLoading(true);
    setTimeout(() => {
      axios
        .get("http://localhost:8000/habitats")
        .then((response) => {
          setHabitats(response.data);
          setCurrentPage(1);
        })
        .catch((error) => {
          console.error("Erro ao buscar habitats:", error);
          setHabitats([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 800);
  };

  useEffect(() => {
    carregarHabitats();
  }, []);

  const totalPages = Math.ceil(habitats.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentHabitats = habitats.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="bg-[#081028] p-6 rounded-lg shadow-md max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Lista de Habitats</h3>
        <button
          onClick={carregarHabitats}
          className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Recarregar"}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 italic font-medium select-none">
          Carregando habitats...
        </p>
      ) : habitats.length === 0 ? (
        <p className="text-red-400 font-semibold select-none">
          Nenhum habitat encontrado.
        </p>
      ) : (
        <>
          <div className="rounded overflow-hidden border border-gray-700 mb-4">
            <table className="min-w-full text-gray-200 text-sm">
              <thead className="bg-[#1c2a40] text-left tracking-wider text-gray-300">
                <tr>
                  <th className="py-2 px-4 border-b border-gray-700">ID</th>
                  <th className="py-2 px-4 border-b border-gray-700">Nome</th>
                  <th className="py-2 px-4 border-b border-gray-700">Tipo</th>
                  <th className="py-2 px-4 border-b border-gray-700">
                    Localização
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700">
                    Temp. Média
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentHabitats.map((habitat) => (
                  <tr
                    key={habitat.id_habitat}
                    className="hover:bg-[#162138] transition"
                  >
                    <td className="py-2 px-4 border-b border-gray-700 font-mono">
                      {habitat.id_habitat}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {habitat.nome}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {habitat.tipo}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {habitat.localizacao}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {habitat.temp_media}°C
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Controles de paginação */}
          <div className="flex justify-center gap-3 text-gray-300 select-none">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-600 bg-transparent hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt; Anterior
            </button>

            <span className="px-3 py-1 text-sm">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-600 bg-transparent hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
