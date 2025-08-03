let cachedCountries = null;

export async function getCountries() {
  if (cachedCountries) {
    console.log('Returning cached countries (memory)');
    return cachedCountries;
  }

  const stored = localStorage.getItem('countries');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        console.log('Returning cached countries (localStorage)');
        cachedCountries = parsed;
        return cachedCountries;
      }
    } catch (e) {
      console.warn("Invalid countries in localStorage:", e);
      localStorage.removeItem('countries');
    }
  }

  try {
    const res = await fetch('https://curamed-auth-api-973580931654.europe-north1.run.app/countries');
    const data = await res.json();
    console.log('Fetched country data:', data);

    if (data.countries && Array.isArray(data.countries)) {
      cachedCountries = data.countries;
      localStorage.setItem('countries', JSON.stringify(cachedCountries));
      return cachedCountries;
    } else {
      throw new Error("Invalid countries response format");
    }
  } catch (err) {
    console.error("Error fetching countries:", err);
    throw err;
  }
}
