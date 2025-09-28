const axios = require('axios');
const { URLSearchParams } = require('url');
const { v4: uuidv4 } = require('uuid');

// Fungsi helper ini bisa kita duplikat di sini agar setiap file mandiri
async function sendSingleNglMessage(username, message) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('question', message);
    params.append('deviceId', uuidv4());
    
    // Kirim request dan biarkan error dilempar jika gagal
    await axios.post('https://ngl.link/api/submit', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        }
    });
}


/**
 * Mengirim spam pesan ke username NGL.
 * @param {string} username - Username NGL tujuan.
 * @param {string} message - Pesan yang akan dikirim.
 * @param {string|number} amount - Jumlah pesan yang akan dikirim.
 * @returns {Promise<object>} Objek berisi hasil spam.
 */
async function spamNgl(username, message, amount) {
    // 1. Validasi Input
    if (!username || !message || !amount) {
        throw new Error('Parameter "username", "message", dan "amount" wajib diisi.');
    }

    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Parameter "amount" harus berupa angka yang valid dan lebih dari 0.');
    }

    const maxSpam = 100; // Batas maksimal untuk mencegah penyalahgunaan
    if (numAmount > maxSpam) {
        throw new Error(`Anda tidak bisa mengirim lebih dari ${maxSpam} pesan sekaligus.`);
    }

    // 2. Proses Spamming
    let successCount = 0;
    for (let i = 0; i < numAmount; i++) {
        try {
            await sendSingleNglMessage(username, message);
            successCount++;
            // Beri jeda 0.5 detik antar permintaan
            await new Promise(resolve => setTimeout(resolve, 500)); 
        } catch (e) {
            console.error(`Spam NGL Gagal pada iterasi ${i + 1}:`, e.message);
            // Jika username tidak ditemukan, hentikan proses
            if (e.message.includes('tidak ditemukan')) {
                throw new Error(`Username NGL "${username}" tidak ditemukan. Proses spam dihentikan.`);
            }
        }
    }

    // 3. Kembalikan hasil
    return {
        success: true,
        username: username,
        requested_amount: numAmount,
        successful_sends: successCount,
        message: `Proses selesai! Berhasil mengirim ${successCount} dari ${numAmount} pesan.`
    };
}

module.exports = spamNgl;