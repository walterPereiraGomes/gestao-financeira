import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToHash(string: string) {
  return string.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
}

/**
 * Gera uma cor de background clara baseada no hash, garantindo boa legibilidade.
 * Mantém a saturação em 60% para evitar tons muito vibrantes e usa luminosidade alta (80%).
 * Motivo: Luminosidade alta garante fundo claro, facilitando contraste com texto escuro.
 */
export function hashToBGColor(hash: number) {
  const hue = hash % 360; // Hue entre 0 e 359
  const saturation = 60; // Saturação moderada para evitar cores muito "neon"
  const lightness = 80; // Luminosidade alta para fundo claro
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Gera uma cor de texto escura baseada no hash, mantendo o mesmo hue do background.
 * Usa saturação menor (40%) e baixa luminosidade (25%) para garantir contraste.
 * Motivo: Luminosidade baixa e saturação moderada garantem texto legível sobre fundo claro.
 */
export function hashToTextColor(hash: number) {
  const hue = hash % 360; // Mesmo hue do background
  const saturation = 40; // Saturação menor para texto mais "sóbrio"
  const lightness = 25; // Luminosidade baixa para texto escuro
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Gera as iniciais de um texto
 * @param text - Texto para extrair iniciais
 * @returns Até 2 caracteres com as iniciais em maiúsculas
 *
 * Regra: Usa a primeira letra do primeiro nome e a primeira letra do último nome.
 * Se houver apenas um nome, usa as duas primeiras letras desse nome.
 */
export function generateInitials(text: string): string {
  if (!text || text.trim().length === 0) {
    return 'MD'; // Default para "Módulo"
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return 'MD';
  }

  if (words.length === 1) {
    // Se há apenas uma palavra, pega os dois primeiros caracteres
    return words[0].substring(0, 2).toUpperCase();
  }

  // Se há múltiplas palavras, pega a primeira letra do primeiro e do último nome
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}
