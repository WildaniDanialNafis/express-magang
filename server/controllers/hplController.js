const Hpl = require('../models/Hpl');

exports.getAllHpl = async (req, res) => {
    try {
        const allHpl = await Hpl.findAll(req.userId);
        res.status(200).json({
            message: 'Berhasil mendapat data Hpl',
            hpl: allHpl
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

exports.createHpl = async (req, res) => {
    const { minggu, hari } = req.body;

    // Validasi input
    if (!minggu || !hari || isNaN(minggu) || isNaN(hari)) {
        return res.status(400).json({ error: 'Usia kehamilan dalam minggu dan hari harus diisi dan berupa angka' });
    }

    // Validasi rentang minggu dan hari
    if (minggu < 1 || minggu > 42 || hari < 0 || hari > 6) {
        return res.status(400).json({ error: 'Minggu harus antara 1-42 dan hari antara 0-6' });
    }

    // Menghitung total hari kehamilan
    const totalHariKehamilan = (minggu * 7) + hari;  // Total hari kehamilan

    // Menghitung sisa hari untuk mencapai 280 hari
    const sisaHari = 280 - totalHariKehamilan;

    const sisaHariMinggu = Math.floor(sisaHari / 7);  // Sisa minggu
    const sisaHariHari = sisaHari % 7;  // Sisa hari

    // Menghitung tanggal HPL (280 hari dari sekarang - sisa hari)
    const hplDate = new Date();
    hplDate.setDate(hplDate.getDate() + sisaHari);

    try {

        const newHpl = await Hpl.create(hplDate, minggu, hari, sisaHariMinggu, sisaHariHari, req.userId);
        console.log(newHpl);
        res.status(201).json({
            message: 'Berhasil membuat data Hpl',
            hpl: newHpl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}