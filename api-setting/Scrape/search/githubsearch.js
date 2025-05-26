const axios = require('axios'); // Menggunakan 'require' (CommonJS)

/**
 * Mencari repositori di GitHub.
 * @param {string} query - Kata kunci pencarian.
 * @returns {Promise<object>} - Data hasil pencarian dari GitHub.
 */
async function githubSearch(query) {
  try {
    const GITHUB_API_URL = 'https://api.github.com';
    // Membuat URL pencarian dengan query, 5 hasil teratas, diurutkan berdasarkan bintang
    const searchUrl = `${GITHUB_API_URL}/search/repositories?q=${encodeURIComponent(query)}&per_page=5&sort=stars&order=desc`;

    // Melakukan permintaan GET menggunakan axios
    const res = await axios.get(searchUrl, {
      headers: {
        // Menggunakan header yang mirip dengan contoh sfilm Anda, disesuaikan untuk GitHub
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://github.com/',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    // Mengembalikan data yang diterima dari API GitHub
    return res.data;

  } catch (er) {
    // Menangani error jika terjadi
    const errorMessage = er.response 
        ? `${er.response.status} - ${JSON.stringify(er.response.data?.message