import { useEffect, useState } from "react";
import axios from "axios";

interface Funcionario {
  id_funcionario: number;
  nome: string;
  data_admissao: string;
  cpf: string;
  email: string;
  endereco: string;
}

const PAGE_SIZE = 6;

export default function FuncionarioList() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const carregarFuncionarios = () => {
    setLoading(true);
    setTimeout(() => {
      axios
        .get("http://localhost:8000/funcionarios")
        .then((response) => {
          setFuncionarios(response.data);
          setCurrentPage(1);
        })
        .catch((error) => {
          console.error("Erro ao buscar funcionários:", error);
          setFuncionarios([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 800);
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const totalPages = Math.ceil(funcionarios.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentFuncionarios = funcionarios.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div className="bg-[#081028] p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">
          Lista de Funcionários
        </h3>
        <button
          onClick={carregarFuncionarios}
          className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Recarregar"}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 italic font-medium select-none">
          Carregando funcionários...
        </p>
      ) : funcionarios.length === 0 ? (
        <p className="text-red-400 font-semibold select-none">
          Nenhum funcionário encontrado.
        </p>
      ) : (
        <>
          <div className="rounded overflow-x-auto border border-gray-700 mb-4">
            <table className="min-w-full text-gray-200 text-sm">
              <thead className="bg-[#1c2a40] text-left tracking-wider text-gray-300">
                <tr>
                  <th className="py-2 px-4 border-b border-gray-700">ID</th>
                  <th className="py-2 px-4 border-b border-gray-700">Nome</th>
                  <th className="py-2 px-4 border-b border-gray-700">
                    Admissão
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700">CPF</th>
                  <th className="py-2 px-4 border-b border-gray-700">Email</th>
                  <th className="py-2 px-4 border-b border-gray-700">
                    Endereço
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentFuncionarios.map((func) => (
                  <tr
                    key={func.id_funcionario}
                    className="hover:bg-[#162138] transition"
                  >
                    <td className="py-2 px-4 border-b border-gray-700 font-mono">
                      {func.id_funcionario}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {func.nome}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {func.data_admissao}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {func.cpf}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {func.email}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {func.endereco}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
