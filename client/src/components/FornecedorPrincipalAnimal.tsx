import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  idAnimal: number;
}

export default function FornecedorPrincipalAnimal({ idAnimal }: Props) {
  const [telefone, setTelefone] = useState<string | null>(null);
  const [erro, setErro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/animal/${idAnimal}/fornecedor-principal`)
      .then((res) => setTelefone(res.data.telefone))
      .catch(() => {
        setTelefone(null);
        setErro(true);
      })
      .finally(() => setLoading(false));
  }, [idAnimal]);

  if (loading) return <p className="text-gray-300">Carregando fornecedor...</p>;

  return telefone ? (
    <p className="text-green-300">
      Telefone do fornecedor principal: <strong>{telefone}</strong>
    </p>
  ) : erro ? (
    <p className="text-red-400">Fornecedor não encontrado para este animal.</p>
  ) : null;
}
