const axios = require('axios');

/**
 * Mencari artikel di Wikipedia Indonesia berdasarkan kata kunci.
 * @param {string} query Kata kunci yang ingin dicari.
 * @returns {Promise<object>} Objek berisi hasil pencarian dari Wikipedia.
 */
async function wikipediaSearch(query) {
  // 1. Validasi Input
  if (!query) {
    throw new Error('Parameter "query" wajib diisi.');
  }

  try {
    // 2. Memanggil API Wikipedia menggunakan axios
    const apiUrl = `https://id.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages|extracts&pithumbsize=500&exintro=true&explaintext=true&redirects=1`;
    
    const response = await axios.get(apiUrl);
    const data = response.data; // Di axios, data respons ada di dalam properti .data

    // 3. Memeriksa dan Memproses Hasil
    if (!data.query || !data.query.pages) {
      throw new Error(`Artikel untuk "${query}" tidak ditemukan. Coba kata kunci lain.`);
    }

    const pageId = Object.keys(data.query.pages)[0];
    const page = data.query.pages[pageId];

    if (pageId === '-1' || !page.extract) {
      throw new Error(`Artikel untuk "${query}" tidak ditemukan. Coba kata kunci yang lebih spesifik.`);
    }
    
    // 4. Memformat Hasil untuk dikembalikan
    const title = page.title;
    const extract = page.extract;
    const imageUrl = page.thumbnail ? page.thumbnail.source : null;
    const pageUrl = `https://id.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

    // 5. Mengembalikan hasil dalam bentuk objek
    return {
      title: title,
      thumbnail: imageUrl,
      summary: extract,
      url: pageUrl
    };

  } catch (error) {
    // Melempar error agar bisa ditangkap oleh handler utama di index.js
    // Jika error dari axios, ambil pesan yang lebih relevan
    const errorMessage = error.response ? error.response.data.error : error.message;
    throw new Error(errorMessage);
  }
}

module.exports = wikipediaSearch;