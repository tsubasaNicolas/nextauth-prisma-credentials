export const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error al cargar los datos");
  }
  return res.json();
};
