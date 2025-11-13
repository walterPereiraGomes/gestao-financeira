export default async function getData(endpoint: string) {
  const response = await fetch(`http://localhost:3001/${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados (${response.status})`);
  }

  const data = await response.json();
  return data;
}
