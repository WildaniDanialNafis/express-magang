import axios from "axios";
import React, { useState, useEffect } from "react";
import config from "./config";

const Hpl = () => {
    const [hpls, setHpls] = useState([]);

    // Fungsi untuk mendapatkan data pengguna
    const handleGetHpl = async () => {

        const token = localStorage.getItem("token"); // Pastikan token diambil saat fungsi dijalankan

        if (!token) {
            console.error("Token tidak ditemukan");
            // Arahkan ke halaman login jika token tidak ada
            window.location.href = "/";
            return;
        }

        try {
            const response = await axios.get(config.url + "/api/hpl", {
                headers: {
                    Authorization: `Bearer ${token}`, // Menyertakan token dalam header
                },
            });
            setHpls(response.data);  // Mengupdate state users dengan data yang diterima
        } catch (e) {
            console.error("Error fetching users:", e);
        }
    };

    // Panggil handleGetUsers saat komponen pertama kali dirender
    useEffect(() => {
        handleGetHpl(); // Memanggil API untuk mendapatkan data pengguna
    }, []); // Dependency array kosong berarti hanya dipanggil sekali saat pertama kali render


    return (
        <div className="container-fluid vh-100 d-flex bg-body-tertiary">
            <div className="container mx-auto px-8">
                <div className="card border-light shadow-sm rounded mt-5">
                    <div className="card-body">
                        <p className="card-title text-dark mb-0">You're logged in!</p>
                    </div>
                </div>

                <div className="card border-light shadow-sm rounded mt-5">
                    <div className="card-body">
                        <table className="table mt-1">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>HPL</th>
                                    <th>Usia (Minggu)</th>
                                    <th>Usia (Hari)</th>
                                    <th>Sisa (Minggu)</th>
                                    <th>Sisa (Hari)</th>
                                    <th>Dibuat pada</th>
                                    <th>Diubah pada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hpls.map((hpl) => (
                                    <tr key={hpl.id}>
                                        <td>{hpl.id}</td>
                                        <td>{new Date(hpl.hpl).toISOString().slice(0, 10)}</td>
                                        <td>{hpl.usiaMinggu}</td>
                                        <td>{hpl.usiaHari}</td>
                                        <td>{hpl.sisaMinggu}</td>
                                        <td>{hpl.sisaHari}</td>
                                        <td>{new Date(hpl.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</td>
                                        <td>{new Date(hpl.updatedAt).toISOString().slice(0, 19).replace('T', ' ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hpl;
