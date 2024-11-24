const BeratBadan = require('../models/BeratBadan');

exports.getAllBeratBadan = async (req, res) => {
    try {
        const allBeratBadan = await BeratBadan.findAll(req.userId);
        res.status(200).json({
            status: "success",
            message: 'Berhasil mendapatkan data berat badan',
            beratBadan: allBeratBadan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "error",
            message: 'Terjadi kesalahan pada server', error: error.message 
        });
    }
}

exports.createBeratBadan = async (req, res) => {
    const { beratBadan } = req.body;

    // Validasi input
    if (typeof beratBadan !== 'number' || isNaN(beratBadan)) {
        return res.status(400).json({ 
            status: "error",
            message: 'Berat badan harus berupa angka.' 
        });
    }

    // if (!tanggal || isNaN(new Date(tanggal).getTime())) {
    //     return res.status(400).json({ message: 'Tanggal tidak valid.' });
    // }

    try {
        const newBeratBadan = await BeratBadan.create(beratBadan, req.userId);
        res.status(201).json({
            status: "success",
            message: 'Berhasil membuat data berat badan',
            beratBadan: newBeratBadan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "error",
            message: 'Terjadi kesalahan pada server', error: error.message 
        });
    }
}

exports.updateBeratBadan = async (req, res) => {
    const { id } = req.params;
    const { beratBadan } = req.body;

    // Validasi input
    if (typeof beratBadan !== 'number' || isNaN(beratBadan)) {
        return res.status(400).json({ 
            status: "error",
            message: 'Berat badan harus berupa angka.'
        });
    }

    // if (!tanggal || isNaN(new Date(tanggal).getTime())) {
    //     return res.status(400).json({ message: 'Tanggal tidak valid.' });
    // }

    try {
        const oldBeratBadan = await BeratBadan.findById(id, req.userId);
        if (!oldBeratBadan) return res.status(404).json({ message: 'Berat badan not found' });

        const updatedBeratBadan = await BeratBadan.update(id, beratBadan, req.userId, oldBeratBadan.createdAt);
        res.status(200).json({
            status: "success",
            message: 'Berhasil mengubah data berat badan',
            beratBadan: updatedBeratBadan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "error",
            message: 'Terjadi kesalahan pada server', error: error.message 
        });
    }
}

exports.deleteBeratBadan = async (req, res) => {
    const { id } = req.params;

    try {
        const oldBeratBadan = await BeratBadan.findById(id, req.userId);
        if (!oldBeratBadan) return res.status(404).json({ message: 'Berat badan not found' });

        await BeratBadan.delete(id, req.userId);
        res.status(200).json({
            status: "success",
            message: 'Berhasil menghapus data berat badan'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "error",
            message: 'Terjadi kesalahan pada server', error: error.message 
        });
    }
}