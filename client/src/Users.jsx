import axios from "axios";
import React, { useState, useEffect } from "react";
import config from "./config";
import useAuth from "./token";
import { useNavigate } from "react-router-dom";

const Users = () => {
  useAuth();

  const [users, setUsers] = useState([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userForm, setUserForm] = useState({ id: "", email: "", password: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const navigate = useNavigate();

  // Fungsi untuk mendapatkan data pengguna
  const handleGetUsers = async () => {

    const token = localStorage.getItem("token"); // Pastikan token diambil saat fungsi dijalankan
  
    if (!token) {
      console.error("Token tidak ditemukan");
      // Arahkan ke halaman login jika token tidak ada
      window.location.href = "/";
      return;
    }

    try {
      const response = await axios.get(config.url + "/api/mobile-users", {
        headers: {
          Authorization: `Bearer ${token}`, // Menyertakan token dalam header
        },
      });
      setUsers(response.data.mobileUsers);  // Mengupdate state users dengan data yang diterima
    } catch (e) {
      console.error("Error fetching users:", e);
    }
  };

  // Panggil handleGetUsers saat komponen pertama kali dirender
  useEffect(() => {
    handleGetUsers(); // Memanggil API untuk mendapatkan data pengguna
  }, []); // Dependency array kosong berarti hanya dipanggil sekali saat pertama kali render

  const handleAddEditModalShow = (user = null) => {
    if (user) {
      setIsEdit(true);
      setUserForm(user);
    } else {
      setIsEdit(false);
      setUserForm({ id: "", email: "", password: "" });
    }
    setShowAddEditModal(true);
  };

  const handleModalClose = () => {
    setShowAddEditModal(false);
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Fungsi untuk menyimpan pengguna (tambah/edit)
  const handleSaveUser = async (e) => {
    e.preventDefault(); // Jangan lupa preventDefault pada form submit
  
    const token = localStorage.getItem("token"); // Pastikan token diambil saat fungsi dijalankan
  
    if (!token) {
      console.error("Token tidak ditemukan");
      // Arahkan ke halaman login jika token tidak ada
      window.location.href = "/";
      return;
    }
  
    if (isEdit) {
      try {
        // Mengirim request PUT untuk mengedit pengguna
        const response = await axios.put(config.url + `/api/mobile-users/edit/${userForm.id}`, {
          email: userForm.email,
          password: userForm.password,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
  
        // Menambahkan update untuk `updatedAt`
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userForm.id
              ? { ...user, email: userForm.email, password: userForm.password, updatedAt: response.data.mobileUser.updatedAt }
              : user
          )
        );
      } catch (e) {
        console.error("Error updating user:", e);
      }
    } else {
      try {
        // Mengirim request POST untuk menambah pengguna
        const response = await axios.post(config.url + "/api/mobile-users/add", {
          email: userForm.email,
          password: userForm.password,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
  
        setUsers((prevUsers) => [
          ...prevUsers,
          {
            ...response.data.mobileUser, // Menggunakan response dari backend yang sudah lengkap
          },
        ]);
      } catch (e) {
        console.error("Error adding user:", e);
      }
    }
    handleModalClose();
  };
  
  
  const handleDeleteModalShow = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    const token = localStorage.getItem("token"); // Pastikan token diambil saat fungsi dijalankan
  
    if (!token) {
      console.error("Token tidak ditemukan");
      // Arahkan ke halaman login jika token tidak ada
      window.location.href = "/";
      return;
    }
    try {
      // Mengirim request DELETE untuk menghapus pengguna
      await axios.delete(config.url + `/api/mobile-users/delete/${deleteUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Setelah berhasil menghapus, update state users
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteUserId));
    } catch (e) {
      console.error("Error deleting user:", e);
    }
    setDeleteUserId(null);
    handleModalClose();
  };

  const logOut = () => {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="container-fluid vh-100 d-flex bg-body-tertiary">
      <div className="container mx-auto px-8">
        <div className="card border-light shadow-sm rounded mt-5">
          <div className="card-body">
            <p className="card-title text-dark mb-0">You're logged in!</p>
            <button className="btn btn-danger" type="button" onClick={() => logOut()}>Log Out</button>
          </div>
        </div>

        <div className="card border-light shadow-sm rounded mt-5">
          <div className="card-body">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleAddEditModalShow()}
            >
              &#43; Tambah Mobile User
            </button>

            {/* Modal Add/Edit */}
            <div className={`modal fade ${showAddEditModal ? "show d-block" : ""}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showAddEditModal}>
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <form onSubmit={handleSaveUser}>
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">{isEdit ? "Edit User" : "Tambah User"}</h1>
                      <button type="button" className="btn-close" onClick={handleModalClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <div className="my-3 mx-0 row">
                        <label htmlFor="email" className="col-sm-3 form-label">*Email</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="my-3 mx-0 row">
                        <label htmlFor="password" className="col-sm-3 form-label">*Password</label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            id="password"
                            name="password"
                            value={userForm.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Batal</button>
                      <button type="submit" className="btn btn-primary">Simpan</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className={`modal fade ${showDeleteModal ? "show d-block" : ""}`} id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden={!showDeleteModal}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="deleteModalLabel">Konfirmasi Hapus</h5>
                    <button type="button" className="btn-close" onClick={handleModalClose} aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    Apakah Anda yakin ingin menghapus pengguna ini?
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Batal</button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Hapus</button>
                  </div>
                </div>
              </div>
            </div>

            <table className="table mt-1">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Dibuat pada</th>
                  <th>Diubah pada</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleAddEditModalShow(user)}>Edit</button>
                      <button type="button" className="btn btn-danger" onClick={() => handleDeleteModalShow(user.id)}>Hapus</button>
                    </td>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>xxxxxxxxxxxxxx</td>
                    <td>{new Date(user.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</td>
                    <td>{new Date(user.updatedAt).toISOString().slice(0, 19).replace('T', ' ')}</td>
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

export default Users;
