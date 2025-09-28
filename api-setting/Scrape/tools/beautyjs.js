const { format } = require('prettier');

/**
 * Merapikan (memformat) kode JavaScript menggunakan Prettier.
 * @param {string} code Kode JavaScript yang akan dirapikan.
 * @returns {Promise<string>} Kode JavaScript yang sudah diformat.
 */
async function beautyjs(code) {
  if (!code || typeof code !== 'string' || code.trim() === '') {
      throw new Error("Parameter 'code' tidak boleh kosong.");
  }

  try {
    // Langsung format kode input tanpa mengubahnya terlebih dahulu.
    // Prettier dirancang untuk menangani kode mentah.
    const formatted = await format(code, {
      parser: 'babel', // Parser yang kuat untuk JavaScript modern
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
      printWidth: 80,
      tabWidth: 2,
      bracketSpacing: true,
      arrowParens: 'avoid'
    });
    
    return formatted;

  } catch (error) {
    // Jika Prettier gagal (misalnya karena syntax error), lempar error yang jelas.
    console.error('Prettier formatting error:', error.message);
    throw new Error(`Gagal memformat kode. Pastikan kode JavaScript Anda valid. Pesan error: ${error.message}`);
  }
}

module.exports = beautyjs;