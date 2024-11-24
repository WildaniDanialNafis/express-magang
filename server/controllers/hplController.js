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

exports.createHplByUsia = async (req, res) => {
    const { minggu, hari } = req.body;

    const { hplDate, sisaMinggu, sisaHari } = calculateHpl(minggu, hari);

    try {
        const newHpl = await Hpl.create(hplDate, minggu, hari, sisaMinggu, sisaHari, req.userId);
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

exports.createHplByDate = async (req, res) => {
    const { hpl } = req.body;

    const hplDate = new Date(hpl);

    const { usiaMinggu, usiaHari, sisaMinggu, sisaHari } = calculateUsiaKehamilan(hplDate);

    try {
        const newHpl = await Hpl.create(hplDate, usiaMinggu, usiaHari, sisaMinggu, sisaHari, req.userId);
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

exports.updateHplByUsia = async (req, res) => {
    const { id } = req.params;

    const { minggu, hari } = req.body;

    const { hplDate, sisaMinggu, sisaHari } = calculateHpl(minggu, hari);

    try {
        const hpl = await Hpl.findById(id, req.userId);
        if (!hpl) return res.status(404).json({ message: 'Hpl Not Found' });

        const updatedHpl = await Hpl.update(id, hplDate, minggu, hari, sisaMinggu, sisaHari, req.userId, hpl.createdAt);
        console.log(updatedHpl);
        return res.status(200).json({
            message: 'Berhasil mengubah data Hpl',
            hpl: updatedHpl
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }


}

exports.updateHplByDate = async (req, res) => {
    const { id } = req.params;

    const { hpl } = req.body;
    console.log(`Tanggal HPL yang diberikan: ${hpl}`);

    const hplDate = new Date(hpl);

    const { usiaMinggu, usiaHari, sisaMinggu, sisaHari } = calculateUsiaKehamilan(hplDate);

    try {
        const hpl = await Hpl.findById(id, req.userId);
        if (!hpl) return res.status(404).json({ message: 'Hpl Not Found' });

        const updatedHpl = await Hpl.update(id, hplDate.toISOString().split('T')[0], usiaMinggu, usiaHari, sisaMinggu, sisaHari, req.userId, hpl.createdAt);
        console.log(updatedHpl);
        return res.status(200).json({
            message: 'Berhasil mengubah data Hpl',
            hpl: updatedHpl
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

exports.deleteHpl = async (req, res) => {
    const { id } = req.params;

    try {
        const oldHpl = await Hpl.findById(id, req.userId);
        if (!oldHpl) return res.status(404).json({ message: 'Hpl Not Found' });

        await Hpl.delete(id, req.userId);
        return res.status(200).json({ message: 'Berhasil menghapus data Hpl' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

function calculateHpl(minggu, hari) {
    // Menghitung total hari kehamilan
    const totalHariKehamilan = (minggu * 7) + hari;  // Total hari kehamilan

    // Menghitung sisa hari untuk mencapai 280 hari
    const sisaHari = 280 - totalHariKehamilan;

    const sisaHariMinggu = Math.floor(sisaHari / 7);  // Sisa minggu
    const sisaHariHari = sisaHari % 7;  // Sisa hari

    // Menghitung tanggal HPL (280 hari dari sekarang - sisa hari)
    const hplDate = new Date();
    hplDate.setDate(hplDate.getDate() + sisaHari);

    return {
        'hplDate': hplDate,
        'sisaMinggu': sisaHariMinggu,
        'sisaHari': sisaHariHari
    };
}

function calculateUsiaKehamilan(hplDate) {
    // Mendapatkan tanggal saat ini
    const currentDate = new Date();

    // Menghitung jumlah hari antara tanggal HPL dan tanggal saat ini
    const differenceInTime = hplDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Menghitung selisih hari

    // Menghitung usia kehamilan dalam hari
    const usiaKehamilanHari = 280 - differenceInDays; // 280 hari adalah durasi rata-rata kehamilan

    // Menghitung usia kehamilan dalam minggu dan hari
    const usiaKehamilanMinggu = Math.floor(usiaKehamilanHari / 7);
    const usiaKehamilanSisaHari = usiaKehamilanHari % 7;

    console.log(usiaKehamilanHari);
    console.log(usiaKehamilanMinggu);
    console.log(usiaKehamilanSisaHari);

    // Menghitung sisa hari menuju HPL
    const sisaHari = differenceInDays;

    const sisaMinggu = Math.floor(sisaHari / 7);

    const sisaHariHari = sisaHari % 7;

    return {
        'usiaMinggu': usiaKehamilanMinggu,
        'usiaHari': usiaKehamilanSisaHari,
        'sisaMinggu': sisaMinggu,
        'sisaHari': sisaHariHari,
    }
}