const axios = require('axios');
const FormData = require('form-data');

/**
 * Mencari sumber anime dari URL gambar menggunakan trace.moe.
 * @param {string} url - URL gambar yang akan dianalisis.
 * @returns {Promise<object>} Objek berisi hasil pencarian anime.
 */
async function whatAnime(url) {
  // 1. Validasi Input
  if (!url) {
    throw new Error("Parameter 'url' wajib diisi.");
  }

  try {
    // 2. Unduh gambar dari URL
    const imageResponse = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');
    const mimeType = imageResponse.headers['content-type'] || 'image/jpeg';

    // 3. Kirim gambar ke API trace.moe
    const form = new FormData();
    form.append('image', imageBuffer, {
      filename: 'image.jpg',
      contentType: mimeType
    });

    const { data } = await axios.post('https://api.trace.moe/search', form, {
      headers: { ...form.getHeaders() },
    });

    if (data.error) throw new Error(data.error);
    if (!data.result || data.result.length === 0) {
      throw new Error('Maaf, tidak ada hasil yang cocok ditemukan untuk gambar ini.');
    }

    // 4. Format hasil yang rapi
    const result = data.result[0];
    const { filename, episode, from, to, similarity, video, anilist } = result;

    return {
      title: {
        romaji: anilist.title.romaji || 'Tidak tersedia',
        english: anilist.title.english || 'Tidak tersedia',
        native: anilist.title.native || 'Tidak tersedia',
      },
      isAdult: anilist.isAdult,
      episode: episode || 'Tidak diketahui',
      similarity: parseFloat((similarity * 100).toFixed(2)),
      scene: {
        from: from,
        to: to,
        video: video
      },
      sourceFileName: filename
    };

  } catch (error) {
    const errorMessage = error.response ? `Gagal menghubungi server trace.moe (Status: ${error.response.status})` : error.message;
    throw new Error(errorMessage);
  }
}

module.exports = whatAnime;