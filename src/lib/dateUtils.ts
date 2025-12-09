// Utilitários de data para manter o sistema sempre atualizado

const mesesPT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function getMesAtual(): string {
  const hoje = new Date();
  return `${mesesPT[hoje.getMonth()]} ${hoje.getFullYear()}`;
}

export function getMesAnterior(mesesAtras: number = 1): string {
  const hoje = new Date();
  hoje.setMonth(hoje.getMonth() - mesesAtras);
  return `${mesesPT[hoje.getMonth()]} ${hoje.getFullYear()}`;
}

export function getDiasRestantesMes(): number {
  const hoje = new Date();
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  return Math.max(0, ultimoDia.getDate() - hoje.getDate());
}

export function getDataFormatada(): string {
  const hoje = new Date();
  return hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getUltimoDiaMes(): Date {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
}
