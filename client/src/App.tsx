import React, { useState } from "react";
import AlimentosFornecedor from "./components/AlimentosFornecedor";
import EmailsFuncionarios from "./components/EmailsFuncionarios";
import RankingCuidadores from "./components/RankingCuidadores";
import RankingFaxineiros from "./components/RankingFaxineiros";
import FormFuncionario from "./components/FormFuncionario";
import FormHabitat from "./components/FormHabitat";
import HabitatList from "./components/HabitatList";
import FuncionarioList from "./components/FuncionarioList";
import EmailsTardios from "./components/EmailsTardios";
import HabitatsMedicados from "./components/HabitatsMedicados";
import RankingAlimentosPorAnimal from "./components/RankingAlimentosPorAnimal";
import FornecedorPrincipalAnimal from "./components/FornecedorPrincipalAnimal";
import ProdutoList from "./components/ProdutoList";

const App: React.FC = () => {
  const [inputIdFornecedor, setInputIdFornecedor] = useState("");
  const [idFornecedor, setIdFornecedor] = useState<number | null>(null);
  const [inputIdAnimal, setInputIdAnimal] = useState("");
  const [idAnimal, setIdAnimal] = useState<number | null>(null);

  function handleBuscarFornecedorPrincipal() {
    const parsed = parseInt(inputIdAnimal);
    setIdAnimal(!isNaN(parsed) ? parsed : null);
  }

  function handlePesquisar() {
    const parsedId = parseInt(inputIdFornecedor);
    if (!isNaN(parsedId)) {
      setIdFornecedor(parsedId);
    } else {
      setIdFornecedor(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#081028] text-gray-100 font-sans p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-white tracking-tight select-none">
          🐾 Zoológico
        </h1>

        {/* Buscar alimentos por fornecedor */}
        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Alimentos por Fornecedor
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <input
              type="number"
              placeholder="ID do Fornecedor"
              className="bg-[#1a2b4f] text-white placeholder-gray-400 border border-gray-600 rounded-md p-1.5 px-3 w-48 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={inputIdFornecedor}
              onChange={(e) => setInputIdFornecedor(e.target.value)}
            />

            <button
              onClick={handlePesquisar}
              className={`px-3 py-1 pointer rounded border border-gray-600 bg-transparent hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Pesquisar alimentos por fornecedor"
            >
              Pesquisar
            </button>
          </div>

          {idFornecedor !== null && (
            <AlimentosFornecedor idFornecedor={idFornecedor} />
          )}
        </section>

        {/* Emails dos Funcionários */}
        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Emails dos Funcionários
          </h2>
          <EmailsFuncionarios />
        </section>

        {/* Ranking dos Cuidadores */}
        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Ranking dos Cuidadores
          </h2>
          <RankingCuidadores />
        </section>

        {/* Ranking dos Faxineiros */}
        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Ranking dos Faxineiros
          </h2>
          <RankingFaxineiros />
        </section>

        {/* Adicionar Funcionário */}
        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Adicionar Funcionário
          </h2>
          <FormFuncionario />
        </section>

        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Funcionários
          </h2>
          <FuncionarioList />
        </section>
        {/* Adicionar Habitat */}
        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Adicionar Habitat
          </h2>
          <FormHabitat />
        </section>

        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Habitats
          </h2>
          <HabitatList />
        </section>

        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Emails (Entrada Após 9h)
          </h2>
          <EmailsTardios />
        </section>

        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Habitats com Animais Medicados
          </h2>
          <HabitatsMedicados />
        </section>

        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Fornecedor Principal por Animal
          </h2>

          <div className="flex items-center gap-4 mb-4">
            <input
              type="number"
              placeholder="ID do Animal"
              className="bg-[#1a2b4f] text-white placeholder-gray-400 border border-gray-600 rounded-md p-1.5 px-3 w-48 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={inputIdAnimal}
              onChange={(e) => setInputIdAnimal(e.target.value)}
            />
            <button
              onClick={handleBuscarFornecedorPrincipal}
              className="px-3 py-1 pointer rounded border border-gray-600 bg-transparent hover:border-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pesquisar
            </button>
          </div>

          {idAnimal !== null && (
            <FornecedorPrincipalAnimal idAnimal={idAnimal} />
          )}
        </section>

        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Ranking de Alimentos por Animal
          </h2>
          <RankingAlimentosPorAnimal />
        </section>

        <section className="bg-[#101a34] p-6 rounded-xl shadow-md mb-10 border border-gray-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-white tracking-wide">
            Produtos
          </h2>
          <ProdutoList />
        </section>
      </div>
    </div>
  );
};

export default App;
