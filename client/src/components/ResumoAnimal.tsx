import { useEffect, useState } from "react";
import axios from "axios";

interface Resumo {
  id_animal: number;
  nome_animal: string;
  especie: string;
  habitat: string;
  tipo: string;
  qtd_produtos_consumidos: number;
  total_consumido: number;
}

export default function ResumoAnimal() {
  const [dados, setDados] = useState<Resumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/animais/resumo")
      .then((res) => setDados(res.data))
      .catch(() => setDados([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#081028] text-gray-100 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold mb-3">Resumo dos Animais</h3>
      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : dados.length === 0 ? (
        <p className="text-red-400">Nenhum dado encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-600 text-sm">
            <thead className="bg-[#1c2a40] text-gray-300">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Espécie</th>
                <th className="px-4 py-2">Habitat</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Produtos</th>
                <th className="px-4 py-2">Total (kg)</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((animal) => (
                <tr key={animal.id_animal} className="hover:bg-[#1a243f]">
                  <td className="px-4 py-2 border-t border-gray-700">
                    {animal.id_animal}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {animal.nome_animal}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {animal.especie}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {animal.habitat}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {animal.tipo}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {animal.qtd_produtos_consumidos}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {animal.total_consumido.toFixed(2)} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
