const axios = require('axios');
const { URLSearchParams } = require('url');

/**
 * Mencari video TikTok berdasarkan kata kunci menggunakan API tikwm.com.
 * @param {string} query Kata kunci pencarian.
 * @returns {Promise<object>} Data hasil pencarian TikTok, termasuk array video.
 */
async function tiktokSearch(query) {
    if (!query) {
        throw new Error('Parameter query wajib diisi.');
    }

    const body = new URLSearchParams();
    body.append('keywords', query);
    body.append('count', 15); // Batas hasil
    body.append('cursor', 0);
    body.append('web', 1);
    body.append('hd', 1);

    try {
        const response = await axios.post('https://tikwm.com/api/feed/search', body.toString(), {
            headers: {
                // Gunakan content-type yang sesuai untuk URLSearchParams
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'cookie': 'current_language=en',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            }
        });

        const json = response.data;

        if (!json.data || !json.data.videos || json.data.videos.length === 0) {
            throw new Error(`Tidak ada video yang ditemukan untuk pencarian "${query}".`);
        }
        
        // Mengembalikan seluruh objek data, yang berisi array 'videos'
        return json.data;

    } catch (error) {
        const errorMessage = error.response ? error.response.data.msg || `Request failed with status ${error.response.status}` : error.message;
        throw new Error(`Gagal melakukan pencarian TikTok: ${errorMessage}`);
    }
}

module.exports = tiktokSearch;
