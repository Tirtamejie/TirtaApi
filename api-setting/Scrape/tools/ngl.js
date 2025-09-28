const axios = require('axios');
const { URLSearchParams } = require('url');
const { v4: uuidv4 } = require('uuid');

/**
 * Mengirim satu pesan ke username NGL.
 * @param {string} username - Username NGL tujuan.
 * @param {string} message - Pesan yang akan dikirim.
 * @returns {Promise<object>} Objek konfirmasi.
 */
async function sendNgl(username, message) {
  // 1. Validasi Input
  if (!username || !message) {
    throw new Error('Parameter "username" dan "message" wajib diisi.');
  }

  // 2. Siapkan data untuk dikirim
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('question', message);
  params.append('deviceId', uuidv4());

  try {
    // 3. Kirim request menggunakan axios
    const response = await axios.post('https://ngl.link/api/submit', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
      }
    });

    // Cek jika respons tidak OK (axios akan throw error untuk status 4xx/5xx)
    // Namun kita tambahkan pengecekan manual untuk memastikan
    if (response.status !== 200) {
        throw new Error(`Server NGL merespons dengan status: ${response.status}`);
    }

    // 4. Kembalikan hasil sukses
    return {
        success: true,
        message: `Pesan berhasil dikirim secara anonim ke ${username}!`
    };

  } catch (error) {
    // 5. Tangani error
    if (error.response && error.response.data && typeof error.response.data === 'string' && error.response.data.includes('User not found')) {
        throw new Error(`Username NGL "${username}" tidak ditemukan.`);
    }
    throw new Error(error.message);
  }
}

module.exports = sendNgl;