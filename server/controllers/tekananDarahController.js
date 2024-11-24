const TekananDarah = require('../models/TekananDarah');

exports.getAllTekananDarah = async (req, res) => {
    try {
        const allTekananDarah = await TekananDarah.findAll(req.userId);
        res.status(200).json({
            status: "success",
            message: 'Berhasil mendapatkan data tekanan darah',
            tekananDarah: allTekananDarah
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: 'Terjadi kesalahan pada server', error: error.message
        });
    }
}

exports.createTekananDarah = async (req, res) => {
    const { sistolik, diastolik } = req.body;

    try {
        const newTekananDarah = await TekananDarah.create(sistolik, diastolik, req.userId);
        res.status(201).json({
            status: "success",
            message: 'Berhasil membuat data tekanan darah',
            tekananDarah: newTekananDarah
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", 
            message: 'Terjadi kesalahan pada server', error: error.message });
    }
}

exports.updateTekananDarah = async (req, res) => {
    const { id } = req.params;
    const { sistolik, diastolik } = req.body;

    try {
        const oldTekananDarah = await TekananDarah.findById(id, req.userId);
        if (!oldTekananDarah) return res.status(404).json({ message: 'Tekanan Darah not found' });

        const updatedTekananDarah = await TekananDarah.update(id, sistolik, diastolik, req.userId, oldTekananDarah.createdAt);
        res.status(200).json({
            status: "success",
            message: 'Berhasil mengubah data tekanan darah',
            tekananDarah: updatedTekananDarah
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", 
            message: 'Terjadi kesalahan pada server', error: error.message });
    }
}

exports.deleteTekananDarah = async (req, res) => {
    const { id } = req.params;

    try {
        const oldTekananDarah = await TekananDarah.findById(id, req.userId);
        if (!oldTekananDarah) return res.status(404).json({ message: 'Tekanan Darah not found' });

        await TekananDarah.delete(id, req.userId);
        res.status(200).json({
            status: "success",
            message: 'Berhasil menghapus data tekanan darah'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: 'Terjadi kesalahan pada server', error: error.message });
    }
}