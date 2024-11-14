import axios from "axios";
import React, { useState, useEffect } from "react";
import config from "./config";

const BeratBadan = () => {
    const [beratBadans, setBeratBadans] = useState([]);

    // Fungsi untuk mendapatkan data pengguna
    const handleGetBeratBadan = async () => {

        const token = localStorage.getItem("token"); // Pastikan token diambil saat fungsi dijalankan

        if (!token) {
            console.error("Token tidak ditemukan");
            // Arahkan ke halaman login jika token tidak ada
            window.location.href = "/";
            return;
        }

        try {
            const response = await axios.get(config.url + "/api/berat_badan", {
                headers: {
                    Authorization: `Bearer ${token}`, // Menyertakan token dalam header
                },
            });
            setBeratBadans(response.data);  // Mengupdate state users dengan data yang diterima
        } catch (e) {
            console.error("Error fetching users:", e);
        }
    };

    // Panggil handleGetUsers saat komponen pertama kali dirender
    useEffect(() => {
        handleGetBeratBadan(); // Memanggil API untuk mendapatkan data pengguna
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
                                    <th>Berat Badan</th>
                                    <th>Id Pengguna</th>
                                    <th>Dibuat pada</th>
                                    <th>Diubah pada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beratBadans.map((beratBadan) => (
                                    <tr key={beratBadan.id}>
                                        <td>{beratBadan.id}</td>
                                        <td>{beratBadan.beratBadan}</td>
                                        <td>{beratBadan.userId}</td>
                                        <td>{new Date(beratBadan.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</td>
                                        <td>{new Date(beratBadan.updatedAt).toISOString().slice(0, 19).replace('T', ' ')}</td>
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

export default BeratBadan;
