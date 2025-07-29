import React, { useEffect, useState } from "react";
import axios from "axios";

type Alimento = {
  nome_alimento: string;
  quantidade_kg: number;
};

type Fornecedor = {
  nome: string;
  email: string;
  telefone: string;
};

interface Props {
  idFornecedor: number;
}

const PAGE_SIZE = 7;

export default function AlimentosFornecedor({ idFornecedor }: Props) {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      try {
        const [alimentosRes, fornecedorRes] = await Promise.all([
          axios.get<Alimento[]>(
            `http://localhost:8000/fornecedor/${idFornecedor}/alimentos`
          ),
          axios.get<Fornecedor>(
            `http://localhost:8000/fornecedor/${idFornecedor}/info`
          ),
        ]);
        setAlimentos(alimentosRes.data);
        setFornecedor(fornecedorRes.data);
        setCurrentPage(1);
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setAlimentos([]);
        setFornecedor(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDados();
  }, [idFornecedor]);

  const totalPages = Math.ceil(alimentos.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentAlimentos = alimentos.slice(startIndex, startIndex + PAGE_SIZE);

  if (loading) {
    return <p className="text-gray-300">Carregando...</p>;
  }

  return (
    <div className="bg-[#081028] text-gray-100 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      {fornecedor ? (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Fornecedor</h2>
          <p>
            <span className="font-semibold">Nome:</span> {fornecedor.nome}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {fornecedor.email}
          </p>
          <p>
            <span className="font-semibold">Telefone:</span>{" "}
            {fornecedor.telefone}
          </p>
        </div>
      ) : (
        <div className="p-4 border border-red-500 bg-[#1c1a2e] rounded-lg shadow text-red-300">
          <h2 className="text-lg font-bold mb-2">Fornecedor não encontrado</h2>
          <p className="text-sm">
            Nenhuma informação foi localizada para o fornecedor com ID{" "}
            <strong>{idFornecedor}</strong>. Verifique se o ID é válido ou tente
            novamente mais tarde.
          </p>
        </div>
      )}

      {fornecedor && (
        <h3 className="text-xl font-bold mb-3">Alimentos Fornecidos</h3>
      )}

      {fornecedor &&
        (alimentos.length === 0 ? (
          <p className="text-gray-400">
            Nenhum alimento encontrado para este fornecedor.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-600 rounded-lg">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Alimento</th>
                    <th className="py-3 px-4 text-left">Quantidade (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAlimentos.map((item, index) => (
                    <tr
                      key={startIndex + index}
                      className={`${
                        index % 2 === 0 ? "bg-[#0f1a3a]" : "bg-[#0c152f]"
                      } hover:bg-[#1d2b50] transition`}
                    >
                      <td className="py-2 px-4 border-t border-gray-700 font-medium">
                        {item.nome_alimento}
                      </td>
                      <td className="py-2 px-4 border-t border-gray-700">
                        {item.quantidade_kg.toFixed(2)} kg
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
                className={`px-3 py-1 rounded border border-gray-600 bg-transparent hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                &lt; Anterior
              </button>

              <span className="px-3 py-1 text-sm">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border border-gray-600 bg-transparent hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Próximo &gt;
              </button>
            </div>
          </>
        ))}
    </div>
  );
}
