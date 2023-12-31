import React, { Component, useEffect, useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { Input, Textarea, Button } from "@material-tailwind/react";
import Image from "next/image";
import axios from "axios";
import moment from "moment"
import Link from "next/link";

export default function Profile({ userData, setuserData }: any) {

    const [tab, setTab] = useState(1);

    const convertFileToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'change_user') {
            try {
                await axios({
                    method: "PUT",
                    url: "/api/user",
                    data: data,
                    timeout: 5000,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    if (!Array.isArray(res.data.data.permission.data)) {
                        res.data.data.permission.data = JSON.parse(res.data.data.permission.data);
                    } else {
                        res.data.data.permission = null;
                    }
                    toast.success(res.data.massage);
                    setuserData(res.data.data);
                    localStorage.setItem('token', res.data.token);
                    ($('.btn-close') as any).trigger("click");
                }).catch(error => {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Maaf database sedang mengalami gagal koneksi, harap kembali lagi nanti');
                    } else {
                        if (error?.response?.data?.massage) {
                            toast.error(error.response.data.massage);
                        } else {
                            toast.error(error.message);
                        }
                    }
                });
            } catch (error: any) {
                // toast.error(error.response.data.massage);
                console.log(error)
            }
        } else if (url === 'change_pass') {
            try {
                await axios({
                    method: "PUT",
                    url: "/api/user",
                    data: data,
                    timeout: 5000,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    toast.success(res.data.massage);
                    (document.getElementById("profileOldPassword") as HTMLInputElement).value = '';
                    (document.getElementById("profileConfirmPassword") as HTMLInputElement).value = '';
                    (document.getElementById("profileNewPassword") as HTMLInputElement).value = '';
                }).catch(error => {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Maaf database sedang mengalami gagal koneksi, harap kembali lagi nanti');
                    } else {
                        if (error?.response?.data?.massage) {
                            toast.error(error.response.data.massage);
                        } else {
                            toast.error(error.message);
                        }
                    }
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (url === 'avatar') {
            try {
                const file = await convertFileToBase64(data);
                await axios({
                    method: "PUT",
                    url: "/api/user",
                    data: { files: file },
                    timeout: 5000,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    if (!Array.isArray(res.data.data.permission.data)) {
                        res.data.data.permission.data = JSON.parse(res.data.data.permission.data);
                    } else {
                        res.data.data.permission = null;
                    }
                    toast.success(res.data.massage);
                    setuserData(res.data.data);
                }).catch(error => {
                    if (error.code === 'ECONNABORTED') {
                        toast.error('Maaf database sedang mengalami gagal koneksi, harap kembali lagi nanti');
                    } else {
                        if (error?.response?.data?.massage) {
                            toast.error(error.response.data.massage);
                        } else {
                            toast.error(error.message);
                        }
                    }
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
    }

    const submitProfile = (event: any) => {
        event.preventDefault();
        let data = {
            username: event.target.username.value,
            email: event.target.email.value,
            namaLengkap: event.target.namaLengkap.value,
            noHp: event.target.noHp.value,
            alamat: event.target.alamat.value,
            tanggalLahir: event.target.tanggalLahir.value,
        };
        handleApi('change_user', data);

    };

    const submitPassword = (event: any) => {
        event.preventDefault();

        if (event.target.old_password.value.length < 1 || event.target.password.value.length < 1 || event.target.confirm_password.value.length < 1) {
            toast.error('Password required');
            return false;
        }

        if (event.target.old_password.value.length < 8 || event.target.password.value.length < 8 || event.target.confirm_password.value.length < 8) {
            toast.error('Password min 8 char');
            return false;
        }

        if (event.target.password.value !== event.target.confirm_password.value) {
            toast.error('Password not match');
            return false;
        }

        let data = {
            old_password: event.target.old_password.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
        };
        handleApi('change_pass', data);

    };

    const uploadAvatar = (event: any) => {
        let files = event.target.files[0];
        if (files) {
            let extension = files.type;
            let size = files.size;
            if (extension === 'image/jpeg' || extension === 'image/png') {
                if (size > 5000000) {
                    toast.error("Ukuran img hanya < 5000kb");
                    (document.getElementById("file") as HTMLInputElement).value = "";
                } else {
                    handleApi('avatar', event.target.files[0]);
                }
            } else {
                toast.error("Extension img tidak valid, hanya jpeg/png");
                (document.getElementById("file") as HTMLInputElement).value = "";
            }
        } else {
            (document.getElementById("file") as HTMLInputElement).value = "";
        }
    }

    return (
        <>
            <div className="row mb-32 gy-32">
                <div className="col-12">
                    <div className="row justify-content-between gy-32">
                        <div className="col hp-flex-none w-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        Profile
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="row hp-profile-mobile-menu-btn bg-black-0 hp-bg-color-dark-100 rounded py-12 px-8 px-sm-12 mb-16 mx-0">
                        <div className="d-inline-block" data-bs-toggle="offcanvas" data-bs-target="#profileMobileMenu" aria-controls="profileMobileMenu">
                            <button type="button" className="btn btn-text btn-icon-only">
                                <i className="ri-menu-fill hp-text-color-black-80 hp-text-color-dark-30 lh-1" style={{ fontSize: "24px" }}></i>
                            </button>
                        </div>
                    </div>

                    <div className="row bg-black-0 hp-bg-color-dark-100 rounded pe-16 pe-sm-32 mx-0">
                        <div className="col hp-profile-menu py-24" style={{ flex: "0 0 240px" }}>
                            <div className="w-100">
                                <div className="hp-profile-menu-header mt-16 mt-lg-0 text-center">
                                    <div className="hp-menu-header-btn mb-12 text-end">
                                        <div className="d-inline-block" id="profile-menu-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            <button type="button" className="btn btn-text btn-icon-only">
                                                <i className="ri-more-2-line text-black-100 hp-text-color-dark-30 lh-1" style={{ fontSize: "24px" }}></i>
                                            </button>
                                        </div>

                                        <ul className="dropdown-menu" aria-labelledby="profile-menu-dropdown">
                                            <li>
                                                <label htmlFor="file">
                                                    <span className="dropdown-item" aria-hidden="true">Ubah Avatar</span>
                                                    <input type="file" id="file" name="file" accept="image/*" style={{ display: "none" }} onChange={(val: any) => uploadAvatar(val)} />
                                                </label>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="d-flex justify-content-center">
                                        <div className="d-inline-block position-relative">
                                            {userData.img ?
                                                <div className="avatar-item d-flex align-items-center justify-content-center rounded-circle" style={{ width: "80px", height: "80px" }}>
                                                    <Image width={100} height={100} alt='' src={userData.img} className="object-cover rounded-full w-20 h-20" />
                                                </div> :
                                                <div className="avatar-item d-flex align-items-center justify-content-center rounded-circle" style={{ width: "80px", height: "80px" }}>
                                                    <Image width={100} height={100} alt='' src="/app-assets/img/memoji/memoji-1.png" />
                                                </div>}

                                            <span className="position-absolute translate-middle badge rounded-pill bg-primary text-white border-none">
                                                Online
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="mt-24 mb-4">{userData.fullName ?? userData.username}</h3>
                                    <a href={`mailto:${userData.email}`} className="hp-p1-body">{userData.email}</a>
                                </div>
                            </div>

                            <div className="hp-profile-menu-body w-100 text-start mt-48 mt-lg-0">
                                <ul className="me-n1 mx-lg-n12">
                                    <li className="mt-4 mb-16">
                                        <a onClick={() => {
                                            setTab(1)
                                        }} className={tab === 1 ? "cursor-pointer active position-relative text-black-80 hp-text-color-dark-30 hp-hover-text-color-primary-1 hp-hover-text-color-dark-0 py-12 px-24 d-flex align-items-center" : "position-relative text-black-80 hp-text-color-dark-30 hp-hover-text-color-primary-1 hp-hover-text-color-dark-0 py-12 px-24 d-flex align-items-center cursor-pointer "} >
                                            <i className="iconly-Curved-User me-16"></i>
                                            <span>Data Personal</span>
                                            <span className="hp-menu-item-line position-absolute opacity-0 h-100 top-0 end-0 bg-primary hp-bg-dark-0" style={{ width: "2px" }}></span>
                                        </a>
                                    </li>

                                    <li className="mt-4 mb-16">
                                        <a onClick={() => {
                                            setTab(2)
                                        }} className={tab === 2 ? "cursor-pointer active position-relative text-black-80 hp-text-color-dark-30 hp-hover-text-color-primary-1 hp-hover-text-color-dark-0 py-12 px-24 d-flex align-items-center" : "position-relative text-black-80 hp-text-color-dark-30 hp-hover-text-color-primary-1 hp-hover-text-color-dark-0 py-12 px-24 d-flex align-items-center cursor-pointer "} >
                                            <i className="iconly-Curved-Password me-16"></i>
                                            <span>Ubah Password</span>

                                            <span className="hp-menu-item-line position-absolute opacity-0 h-100 top-0 end-0 bg-primary hp-bg-dark-0" style={{ width: "2px" }}></span>
                                        </a>
                                    </li>

                                </ul>
                            </div>

                            <div className="hp-profile-menu-footer">
                                <Image width={200} height={200} src="/app-assets/img/pages/profile/menu-img.svg" alt="Profile Image" />
                            </div>
                        </div>

                        <div className="hp-profile-mobile-menu offcanvas offcanvas-start" tabIndex={-1} id="profileMobileMenu" aria-labelledby="profileMobileMenuLabel">
                            <div className="offcanvas-header">
                                <div className="hp-menu-header-btn text-end">
                                    <div className="d-inline-block" id="profile-menu-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <button type="button" className="btn btn-text btn-icon-only">
                                            <i className="ri-more-2-line text-black-100 hp-text-color-dark-30 lh-1" style={{ fontSize: "24px" }}></i>
                                        </button>
                                    </div>

                                    <ul className="dropdown-menu" aria-labelledby="profile-menu-dropdown">
                                        <li>
                                            <label htmlFor="file">
                                                <span className="dropdown-item" aria-hidden="true">Ubah Avatar</span>
                                                <input type="file" id="file" name="file" accept="image/*" style={{ display: "none" }} onChange={(val: any) => uploadAvatar(val)} />
                                            </label>
                                        </li>
                                    </ul>
                                </div>

                                <div className="d-inline-block" id="profile-menu-dropdown" data-bs-dismiss="offcanvas" aria-label="Close">
                                    <button id="profileClose" type="button" className="btn btn-text btn-icon-only">
                                        <i className="ri-close-fill text-black-80 lh-1" style={{ fontSize: "24px" }}></i>
                                    </button>
                                </div>
                            </div>

                            <div className="offcanvas-body p-0">
                                <div className="col hp-profile-menu py-24" style={{ flex: "0 0 240px" }}>
                                    <div className="w-100">
                                        <div className="hp-profile-menu-header mt-16 mt-lg-0 text-center">
                                            <div className="hp-menu-header-btn mb-12 text-end">
                                                <div className="d-inline-block" id="profile-menu-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <button type="button" className="btn btn-text btn-icon-only">
                                                        <i className="ri-more-2-line text-black-100 hp-text-color-dark-30 lh-1" style={{ fontSize: "24px" }}></i>
                                                    </button>
                                                </div>

                                                <ul className="dropdown-menu" aria-labelledby="profile-menu-dropdown">
                                                    <li>
                                                        <label htmlFor="file">
                                                            <span className="dropdown-item" aria-hidden="true">Change Avatar</span>
                                                            <input type="file" id="file" name="file" accept="image/*" style={{ display: "none" }} onChange={(val: any) => uploadAvatar(val)} />
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="d-flex justify-content-center">
                                                <div className="d-inline-block position-relative">
                                                    {userData.img ?
                                                        <div className="avatar-item d-flex align-items-center justify-content-center rounded-circle" style={{ width: "80px", height: "80px" }}>
                                                            <Image width={100} height={100} alt='' src={userData.img} />
                                                        </div> :
                                                        <div className="avatar-item d-flex align-items-center justify-content-center rounded-circle" style={{ width: "80px", height: "80px" }}>
                                                            <Image width={100} height={100} alt='' src="/app-assets/img/memoji/memoji-1.png" />
                                                        </div>}

                                                    <span className="position-absolute translate-middle badge rounded-pill bg-primary text-white border-none">
                                                        Online
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="mt-24 mb-4">{userData.fullName ?? userData.username}</h3>
                                            <a href={`mailto:${userData.email}`} className="hp-p1-body">{userData.email}</a>
                                        </div>
                                    </div>

                                    <div className="hp-profile-menu-body w-100 text-start mt-48 mt-lg-0">
                                        <ul className="me-n1 mx-lg-n12">
                                            <li className="mt-4 mb-16">
                                                <a onClick={() => {
                                                    setTab(1);
                                                    ($('#profileClose') as any).trigger("click");
                                                }} className={tab === 1 ? "cursor-pointer active position-relative text-black-80 hp-text-color-dark-30 hp-hover-text-color-primary-1 hp-hover-text-color-dark-0 py-12 px-24 d-flex align-items-center" : "position-relative text-black-80 hp-text-color-dark-30 hp-hover-text-color-primary-1 hp-hover-text-color-dark-0 py-12 px-24 d-flex align-items-center cursor-pointer "} >
                                                    <i className="iconly-Curved-User me-16"></i>
                                                    <span>Data Personal</span>
                                                    <span className="hp-menu-item-line position-absolute opacity-0 h-100 top-0 end-0 bg-primary hp-bg-dark-0" style={{ width: "2px" }}></span>
                                                </a>
                                            </li>

                                            <li className="mt-4 mb-16">
                                                <a onClick={() => {
                                                    setTab(2);
                                                    ($('#profileClose') as any).trigger("click");
                                                }} className={tab === 2 ? "cursor-pointer active position-relative text-black-80 hp-text-color-dark-30 hp-hover-text-color-primary-1 hp-hover-text-color-dark-0 py-12 px-24 d-flex align-items-center" : "position-relative text-black-80 hp-text-color-dark-30 hp-hover-text-color-primary-1 hp-hover-text-color-dark-0 py-12 px-24 d-flex align-items-center cursor-pointer "} >
                                                    <i className="iconly-Curved-Password me-16"></i>
                                                    <span>Ubah Password</span>

                                                    <span className="hp-menu-item-line position-absolute opacity-0 h-100 top-0 end-0 bg-primary hp-bg-dark-0" style={{ width: "2px" }}></span>
                                                </a>
                                            </li>

                                        </ul>
                                    </div>

                                    <div className="hp-profile-menu-footer">
                                        <Image width={200} height={200} src="/app-assets/img/pages/profile/menu-img.svg" alt="Profile Image" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {tab === 1 ?
                            <div className="col ps-16 ps-sm-32 py-24 py-sm-32 overflow-hidden">
                                <div className="row">
                                    <div className="col-12 col-md-8">
                                        <h2 className="text-2xl font-bold">Data Personal</h2>
                                    </div>

                                    <div className="divider border-black-40 hp-border-color-dark-80"></div>

                                    <div className="col-12">
                                        <div className="row align-items-center justify-content-between">
                                            <div className="col-12 col-md-6">
                                                <h3>Kontak</h3>
                                            </div>

                                            <div className="col-12 col-md-6 hp-profile-action-btn text-end">
                                                <button className="btn btn-ghost btn-primary" data-bs-toggle="modal" data-bs-target="#profileContactEditModal">Edit</button>
                                            </div>

                                            <div className="col-12 hp-profile-content-list mt-8 pb-0 pb-sm-120">
                                                <ul>
                                                    <li>
                                                        <span className="hp-p1-body">Nama Lengkap</span>
                                                        <span className="mt-0 mt-sm-4 hp-p1-body text-black-100 hp-text-color-dark-0">{userData.namaLengkap ?? '-'}</span>
                                                    </li>
                                                    <li className="mt-18">
                                                        <span className="hp-p1-body">Username</span>
                                                        <span className="mt-0 mt-sm-4 hp-p1-body text-black-100 hp-text-color-dark-0">{userData.username}</span>
                                                    </li>
                                                    <li className="mt-18">
                                                        <span className="hp-p1-body">Email</span>
                                                        <span className="mt-0 mt-sm-4 hp-p1-body text-black-100 hp-text-color-dark-0">{userData.email}</span>
                                                    </li>
                                                    <li className="mt-18">
                                                        <span className="hp-p1-body">Phone</span>
                                                        <a className="mt-0 mt-sm-4 hp-p1-body text-black-100 hp-text-color-dark-0" href={`tel:${userData.noHp}`}>{userData.noHp ?? '-'}</a>
                                                    </li>
                                                    <li className="mt-18">
                                                        <span className="hp-p1-body">Tanggal Lahir</span>
                                                        <span className="mt-0 mt-sm-4 hp-p1-body text-black-100 hp-text-color-dark-0">{userData.tanggalLahir ? moment(userData.tanggalLahir).format('DD/MM/YYYY') : '-'}</span>
                                                    </li>
                                                    <li className="mt-18">
                                                        <span className="hp-p1-body">Alamat</span>
                                                        <span className="mt-0 mt-sm-4 hp-p1-body text-black-100 hp-text-color-dark-0">{userData.alamat ?? '-'}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : tab === 2 ?
                                <div className="col ps-16 ps-sm-32 py-24 py-sm-32 overflow-hidden">
                                    <div className="row">
                                        <div className="col-12">
                                            <h2 className="text-2xl font-bold">Ubah Password</h2>
                                        </div>

                                        <div className="divider border-black-40 hp-border-color-dark-80"></div>

                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 col-sm-8 col-md-7 col-xl-5 col-xxxl-3">
                                                    <form onSubmit={submitPassword} id="submitPassword">
                                                        <div className="mb-24">
                                                            <Input label="Password Lama" variant="standard" required type="password" className="border-b-1" id="profileOldPassword" name="old_password" />
                                                        </div>

                                                        <div className="mb-24">
                                                            <Input label="Password Baru" variant="standard" required type="password" className="border-b-1" id="profileNewPassword" name="password" />
                                                        </div>

                                                        <div className="mb-24">
                                                            <Input label="Ulangi Password Baru" variant="standard" required type="password" className="border-b-1" id="profileConfirmPassword" name="confirm_password" />
                                                        </div>

                                                        <Button color="red" type="submit" className="w-100">Ubah Password</Button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : <></>}
                    </div>
                </div>
            </div >

            <div className="modal fade" id="profileContactEditModal" tabIndex={-1} aria-labelledby="profileContactEditModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "416px" }}>
                    <div className="modal-content">
                        <div className="modal-header py-16">
                            <h5 className="modal-title font-bold" id="profileContactEditModalLabel">Profile Edit</h5>
                            <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                            </button>
                        </div>

                        <div className="divider my-0"></div>

                        <div className="modal-body py-48">
                            <form onSubmit={submitProfile}>
                                <div className="row g-24">
                                    <div className="col-12 -mt-2">
                                        <Input label="Nama Lengkap" variant="standard" required type="text" className="border-b-1" name="namaLengkap" id="fullName" defaultValue={userData.namaLengkap} />
                                    </div>

                                    <div className="col-12">
                                        <Input label="Username" variant="standard" required type="text" className="border-b-1" name="username" id="username" defaultValue={userData.username} />
                                    </div>

                                    <div className="col-12">
                                        <Input label="Email" variant="standard" required type="email" className="border-b-1" name="email" id="email" defaultValue={userData.email} />
                                    </div>

                                    <div className="col-12">
                                        <Input label="Tanggal Lahir" variant="standard" required type="date" className="border-b-1" name="tanggalLahir" id="dateOfBirth" defaultValue={userData.tanggalLahir} />
                                    </div>

                                    <div className="col-12">
                                        <Input label="No Hp" variant="standard" required type="number" className="border-b-1" name="noHp" id="noHp" defaultValue={userData.noHp} />
                                    </div>

                                    <div className="col-12">
                                        <Textarea label="Alamat" variant="standard" required name="alamat" id="address" className="border-b-1" defaultValue={userData.alamat}></Textarea>
                                    </div>

                                    <div className="col-6">
                                        <Button color="blue" type="submit" className=" w-100">Edit</Button>
                                    </div>

                                    <div className="col-6">
                                        <div className="btn w-100" data-bs-dismiss="modal">Kembali</div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}