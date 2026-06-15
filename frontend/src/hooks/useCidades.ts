import { useState, useEffect } from 'react'

export function useCidades(estado: string) {
  const [cidades, setCidades] = useState<string[]>([])
  const [loadingCidades, setLoadingCidades] = useState(false)

  useEffect(() => {
    if (!estado) { setCidades([]); return }
    setLoadingCidades(true)
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`)
      .then(r => r.json())
      .then((data: any[]) => setCidades(data.map(d => d.nome)))
      .catch(() => setCidades([]))
      .finally(() => setLoadingCidades(false))
  }, [estado])

  return { cidades, loadingCidades }
}
