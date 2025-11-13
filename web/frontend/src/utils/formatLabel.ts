export default function formatLabelName(name: string): string {
  const match = name.match(/^[^:]+:(.+)$/);
  const raw = match ? match[1] : name;

  const clean = raw.trim().toLowerCase();

  // Mapa de palavras conhecidas (acentuação, nomes específicos, etc.)
  const exceptions: Record<string, string> = {
    cidadao: "Cidadão",
    relatorio: "Relatório",
    unidade1: "Unidade 1",
    cdi: "CDI",
  };

  // Retorna com exceção (se houver) ou capitaliza a primeira letra
  return exceptions[clean] || clean.charAt(0).toUpperCase() + clean.slice(1);
}
