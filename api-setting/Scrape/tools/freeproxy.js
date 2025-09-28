const axios = require('axios');
const cheerio = require('cheerio');

const FREE_PROXY_LIST_URL = 'https://free-proxy-list.net/';

/**
 * Mengambil daftar proxy gratis (HTTPS) dari free-proxy-list.net.
 * @param {string|number} limit - Jumlah maksimum proxy yang ingin diambil.
 * @returns {Promise<Array<object>>} Array berisi objek proxy.
 */
async function fetchFreeProxies(limit = 10) {
  const numLimit = parseInt(limit);
  if (isNaN(numLimit) || numLimit <= 0) {
      throw new Error("Parameter 'limit' harus berupa angka yang valid dan lebih dari 0.");
  }
  
  if (numLimit > 50) { // Batasi maksimal 50 untuk menjaga performa
      throw new Error("Jumlah maksimal proxy yang bisa diminta adalah 50.");
  }

  try {
    const { data: html } = await axios.get(FREE_PROXY_LIST_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
      },
      timeout: 20000
    });

    const $ = cheerio.load(html);
    const proxies = [];

    $('table.table-striped tbody tr').each((i, row) => {
      if (proxies.length >= numLimit) return false;

      const columns = $(row).find('td');
      if (columns.length >= 7) {
        const ipAddress = $(columns[0]).text().trim();
        const port = $(columns[1]).text().trim();
        const countryName = $(columns[3]).text().trim();
        const anonymity = $(columns[4]).text().trim();
        const https = $(columns[6]).text().trim();
        const lastChecked = $(columns[7]) ? $(columns[7]).text().trim() : 'N/A';

        if (ipAddress && port && https && https.toLowerCase() === 'yes') {
          proxies.push({
            proxy: `${ipAddress}:${port}`,
            country: countryName,
            anonymity: anonymity,
            lastChecked: lastChecked,
          });
        }
      }
    });

    if (proxies.length === 0) {
        throw new Error("Tidak dapat menemukan proxy HTTPS saat ini. Situs sumber mungkin mengubah strukturnya.");
    }

    return proxies;

  } catch (error) {
    throw new Error(`Gagal mengambil daftar proxy: ${error.message}`);
  }
}

module.exports = fetchFreeProxies;