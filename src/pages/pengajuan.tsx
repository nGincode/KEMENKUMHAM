import React, { Component, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Input, Textarea, Button } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import numeral from "numeral";
import moment from "moment";

import Select from "../components/reactSelect";
import ImgUpload from "../components/imgUpload";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput"
import ReactSelect from "../components/reactSelect";

export default function Pengajuan({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataTahanan, setdataTahanan] = useState<any>([]);
    const [dateData, setdateData] = useState<any>([moment().format('YYYY-MM-DD'), moment().add(7, 'days').format('YYYY-MM-DD')]);
    const [dataCreate, setdataCreate] = useState();
    const [SearchValue, setSearchValue] = useState<any>();
    const [search, setsearch] = useState('');
    const URLAPI = "/api/pengajuan";
    const Subject = "Pengajuan";

    useEffect(() => {
        (document as any).title = Subject;
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            return val.data.find((vall: any) => {
                if (vall.label == Subject) {
                    return vall;
                }
            })
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? []);


        const handleApiFirst = async (data: any = null) => {
            try {
                await axios({
                    method: "GET",
                    url: '/api/tahanan',
                    timeout: 5000,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdataTahanan(res.data.data)
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

        handleApiFirst();

    }, [userData]);

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create') {
            try {
                await axios({
                    method: "POST",
                    url: URLAPI,
                    data: data,
                    timeout: 5000,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdataCreate(res.data.data)
                    toast.success(res.data.massage);
                    ($('.btn-close') as any).trigger("click");
                    (document.getElementById('formCreate') as HTMLFormElement).reset();
                    (document.getElementById('closeImg') as HTMLInputElement)?.click();
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


    const modalData =
        [
            {
                name: 'img',
                type: 'img',
                id: 'img',
                full: true,
                label: 'Foto KTP',
            },
            {
                require: true,
                name: 'waktuKunjungan',
                type: 'date',
                id: 'waktuKunjungan',
                Label: 'Waktu Kunjungan'
            },
            {
                require: true,
                name: 'nama',
                type: 'text',
                id: 'nama',
                Label: 'Nama'
            },
            {
                require: true,
                name: 'NIK',
                type: 'number',
                id: 'NIK',
                Label: 'NIK KTP'
            },
            {
                require: true,
                name: 'jenisKelamin',
                type: 'reactSelect',
                id: 'jenisKelamin',
                label: 'Jenis Kelamin',
                select: [
                    { value: 'Laki-Laki', label: 'Laki-Laki' },
                    { value: 'Perempuan', label: 'Perempuan' },
                ]
            },
            {
                require: true,
                name: 'alamat',
                type: 'text',
                id: 'alamat',
                Label: 'Alamat',
            },
            {
                require: true,
                name: 'noHp',
                type: 'number',
                id: 'noHp',
                Label: 'No Wa'
            },
            {
                name: 'pengikut',
                type: 'group',
                label: "Pengikut Kunjungan",
                id: 'pengikut',
                group: [
                    {
                        name: 'pengikutPria',
                        type: 'number',
                        id: 'pengikutPria',
                        placeholder: 'Jumlah Laki-Laki'
                    },
                    {
                        name: 'pengikutWanita',
                        type: 'number',
                        id: 'pengikutWanita',
                        placeholder: 'Jumlah Perempuan'
                    },
                ]
            },
            {
                require: true,
                name: 'tahanan_id',
                type: 'reactSelect',
                id: 'tahanan_id',
                label: 'Tahanan yang dikunjungi',
                search: true,
                select: dataTahanan.map((val: any) => {
                    return { value: val.id, label: val.nama }
                })
            },
            {
                require: true,
                name: 'hubungan',
                type: 'text',
                id: 'hubungan',
                label: 'Hubungan dgn Tahanan',
                full: true,
            },
        ]

    const convertFileToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    const submitAdd = async (event: any) => {
        event.preventDefault();

        const formData = new FormData(document.getElementById("formCreate") as any);

        let files = event.target.ktp?.files;
        if (files?.[0]) {
            let extension = files[0].type;
            let size = files[0].size;
            if (extension === "image/jpeg" || extension === "image/png") {
                if (size > 1000000) {
                    return alert("Ukuran img harus < 1000kb");
                } else {
                    let ktp: any = null;
                    ktp = await convertFileToBase64(files[0]);
                    formData.set("ktp", ktp);
                }
            } else {
                return alert("Extension img KTP tidak valid, hanya jpeg/png");
            }
        }

        let files1: any = event.target.files1?.files;
        if (files1?.[0]) {
            let extension1 = files1[0].type;
            let size1 = files1[0].size;
            if (extension1 === "application/pdf") {
                if (size1 > 1000000) {
                    return alert("Ukuran harus < 1000kb");
                } else {
                    let file1: any = null;
                    file1 = await convertFileToBase64(files1[0]);
                    formData.set("files1", file1);
                }
            } else {
                return alert("Extension tidak valid, hanya pdf");
            }
        }

        let files2 = event.target.files2?.files;
        if (files2?.[0]) {
            let extension2 = files2[0].type;
            let size2 = files2[0].size;
            if (extension2 === "application/pdf") {
                if (size2 > 1000000) {
                    return alert("Ukuran harus < 1000kb");
                } else {
                    let file2: any = null;
                    file2 = await convertFileToBase64(files2[0]);
                    formData.set("files2", file2);
                }
            } else {
                return alert("Extension tidak valid, hanya pdf");
            }
        } else {
            formData.delete("files2");
        }

        let files3 = event.target.files3?.files;
        if (files3?.[0]) {
            let extension3 = files3[0].type;
            let size3 = files3[0].size;
            if (extension3 === "application/pdf") {
                if (size3 > 1000000) {
                    return alert("Ukuran harus < 1000kb");
                } else {
                    let file3: any = null;
                    file3 = await convertFileToBase64(files3[0]);
                    formData.set("files3", file3);
                }
            } else {
                return alert("Extension tidak valid, hanya pdf");
            }
        } else {
            formData.delete("files3");
        }

        let files4 = event.target.files4?.files;
        if (files4?.[0]) {
            let extension4 = files4[0].type;
            let size4 = files4[0].size;
            if (extension4 === "application/pdf") {
                if (size4 > 1000000) {
                    return alert("Ukuran harus < 1000kb");
                } else {
                    let file4: any = null;
                    file4 = await convertFileToBase64(files4[0]);
                    formData.set("files4", file4);
                }
            } else {
                return alert("Extension tidak valid, hanya pdf");
            }
        } else {
            formData.delete("files4");
        }

        let files5 = event.target.files5?.files;
        if (files5?.[0]) {
            let extension5 = files5[0].type;
            let size5 = files5[0].size;
            if (extension5 === "application/pdf") {
                if (size5 > 1000000) {
                    return alert("Ukuran harus < 1000kb");
                } else {
                    let file5: any = null;
                    file5 = await convertFileToBase64(files5[0]);
                    formData.set("files5", file5);
                }
            } else {
                return alert("Extension tidak valid, hanya pdf");
            }
        } else {
            formData.delete("files5");
        }

        let files6 = event.target.files6?.files;
        if (files6?.[0]) {
            let extension6 = files6[0].type;
            let size6 = files6[0].size;
            if (extension6 === "application/pdf") {
                if (size6 > 1000000) {
                    return alert("Ukuran harus < 1000kb");
                } else {
                    let file6: any = null;
                    file6 = await convertFileToBase64(files6[0]);
                    formData.set("files6", file6);
                }
            } else {
                return alert("Extension tidak valid, hanya pdf");
            }
        } else {
            formData.delete("files6");
        }

        let files7 = event.target.files7?.files;
        if (files7?.[0]) {
            let extension7 = files7[0].type;
            let size7 = files7[0].size;
            if (extension7 === "application/pdf") {
                if (size7 > 1000000) {
                    return alert("Ukuran harus < 1000kb");
                } else {
                    let file7: any = null;
                    file7 = await convertFileToBase64(files7[0]);
                    formData.set("files7", file7);
                }
            } else {
                return alert("Extension tidak valid, hanya pdf");
            }
        } else {
            formData.delete("files7");
        }

        // var object: any = {};
        // formData.forEach(function (value, key) {
        //     object[key] = value;
        // });

        handleApi('create', formData);
    };

    const byNumeral = (val: any) => {
        let value = numeral(val.target.value).format('0,0');
        (document.getElementById(val.target.id) as HTMLInputElement).value = value;
    }


    const laporan = async (tanggal_mulai: any, tanggal_akhir: any) => {
        if (!tanggal_mulai) {
            return alert('Tanggal Awal Belum Dipilih')
        }

        if (!tanggal_akhir) {
            return alert('Tanggal Akhir Belum Dipilih')
        }

        if (moment(tanggal_mulai, 'YYYY-MM-DD') > moment(tanggal_akhir, 'YYYY-MM-DD')) {
            return alert('Tanggal Awal Harus dibawah Tanggal Akhir')
        }

        const get = await axios({
            method: "GET",
            url: URLAPI + `?tanggal_mulai=${tanggal_mulai}&tanggal_akhir=${tanggal_akhir}`,
            timeout: 5000,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        let htmlData = '';
        console.log(get);
        get.data?.data.map((val: any, i: number) => {
            if (i == 0) {
                htmlData += `
                <div style="width:100%;text-align: center;font-weight: bolder;font-size: larger;margin-bottom: 20px;">Laporan Kunjungan</div>
                <table>
                <tr>
                    <td>No</td>
                    <td>Waktu Kunjungan</td>
                    <td>Nama</td>
                    <td>NIK</td>
                    <td>Jenis Kelamin</td>
                    <td>No Hp</td>
                    <td>Alamat</td>
                    <td>Pengunjung</td>
                    <td>Nama Tahanan</td>
                    <td>Perkara</td>
                    <td>Hubungan</td>
                </tr>`;
            }
            htmlData += `
            <tr>
                <td>${i + 1}</td>
                <td>${val.waktuKunjungan}</td>
                <td>${val.nama}</td>
                <td>${val.NIK}</td>
                <td>${val.jenisKelamin}</td>
                <td>${val.noHp}</td>
                <td>${val.alamat}</td>
                <td>${val.pengikutPria} Pria & ${val.pengikutPria} Wanita</td>
                <td>${val.tahanan}</td>
                <td>${val.perkara}</td>
                <td>${val.hubungan}</td>
            </tr>
            `;

            if (i == get.data?.data.length - 1) {
                htmlData += `</table>`;
            }
        })
        var mywindow: any = window.open('', 'Print', 'height=600,width=800');

        mywindow.document.write('<html><head><title>Print</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(`<div
            style="
                text-align: center;
                display: flex;
                width: 100%;
                background: #4f4326;
                color: white;
                padding: 10px;
                align-items: center;
                justify-content: center;
                border: solid black 2px;
                font-weight: bolder;
                margin-bottom: 20px;
            "
            >
            <img src="https://app.easyrubero.com/img/logo2.jpeg" style="height: 60px; margin-right: 110px" />
            <div>
                KEMENTRIAN HUKUM DAN HAM RI<br />
                KANTOR WILAYAH BENGKULU<br />
                RUMAH TAHANAN NEGARA KELAS IIB BENGKULU
            </div>
            <img src="https://app.easyrubero.com/img/logo1.jpeg" style="height: 60px; margin-left: 110px" />
            </div>
            ${htmlData}`);
        mywindow.document.write('<style>table {width:100%} table, th, td {border: 1px solid black;border-collapse: collapse;}</style></body></html>');

        mywindow.document.close();
        mywindow.focus()

        setTimeout(() => {
            mywindow.print();
        }, 1000);
        return true;

    }

    return (
        <>
            <div className="row mb-32 gy-32">
                <div className="col-12">
                    <h1 className="hp-mb-0 text-4xl font-bold">{Subject}</h1>
                </div>
                <div className="col-12">
                    <div className="row justify-content-between gy-32">
                        <div className="col hp-flex-none w-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {Subject}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>


                <div className="col-12 mt-15">
                    <div className="row g-16 align-items-center justify-content-end">

                        <div className="col-4 col-md-3 col-xl-3">
                            <div className="input-group align-items-center">
                                <DebouncedInput
                                    value={search ?? ''}
                                    onChange={value => setsearch(String(value))}
                                    className="form-control ps-8"
                                    placeholder="Search all columns..."
                                />
                            </div>
                        </div>
                        <div className="col-6 col-md-3 col-xl-3">
                            <div className="input-group align-items-center">
                                <Input type="date" id="tanggal_mulai" defaultValue={moment().format('YYYY-MM-DD')} onChange={(val: any) => { setdateData([val.target.value, (document.getElementById('tanggal_akhir') as any)?.value]) }} label="Tanggal Mulai" variant="standard" name="start" />
                            </div>
                        </div>
                        <div className="col-6 col-md-3 col-xl-3">
                            <div className="input-group align-items-center">
                                <Input type="date" id="tanggal_akhir" defaultValue={moment().add(7, 'days').format('YYYY-MM-DD')} onChange={(val: any) => { setdateData([(document.getElementById('tanggal_mulai') as any)?.value, val.target.value]) }} label="Tanggal Akhir" variant="standard" name="end" />
                            </div>
                        </div>

                        <div className="col hp-flex-none w-auto">
                            <Button className="w-100 px-5" onClick={() => {
                                laporan((document.getElementById('tanggal_mulai') as any).value, (document.getElementById('tanggal_akhir') as any).value);
                            }}>Laporan</Button>
                        </div>

                        {pagePermission.find((val: any) => val == "create") ?
                            <div className="col hp-flex-none w-auto">
                                <Button type="button" className="w-100 px-5" variant="gradient" color="blue" data-bs-toggle="modal" data-bs-target="#addNewUser"><i className="ri-add-line remix-icon"></i></Button>
                            </div>
                            : null}


                        <div className="modal fade -mt-2" id="addNewUser" tabIndex={-1} aria-labelledby="addNewUserLabel" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
                            <div className="modal-dialog modal-xl  modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header py-16 px-24">
                                        <h5 className="modal-title font-bold" id="addNewUserLabel">Tambah {Subject}</h5>
                                        <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                            <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                                        </button>
                                    </div>

                                    <div className="divider m-0"></div>
                                    {dataTahanan.length ?
                                        <form onSubmit={submitAdd} id="formCreate">
                                            <div className="modal-body">
                                                <ImgUpload
                                                    label="Foto KTP"
                                                    name="ktp"
                                                    id="ktp" />
                                                <div className="row gx-8">
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="nama" label="Nama" id="nama" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="number" required variant="standard" className="border-b-1" name="nik" label="NIK KTP" id="nik_ktp" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <ReactSelect
                                                                name='jenisKelamin'
                                                                label='Jenis Kelamin'
                                                                data={[
                                                                    { label: 'Laki-Laki', value: 'Laki-Laki' },
                                                                    { label: 'Perempuan', value: 'Perempuan' },
                                                                ]}
                                                                required={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12  col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="alamat" label="Alamat" id="alamat" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12  col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="number" required variant="standard" className="border-b-1" name="noHp" label="No WA" id="noHp" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12  col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="email" required variant="standard" className="border-b-1" name="email" label="Email" id="email" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-12">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="hubungan" label="Hubungan dgn Tahanan" id="hubungan" />
                                                        </div>
                                                    </div>


                                                    <div className="col-12  col-md-12">
                                                        <div className="mb-24">
                                                            <label className="form-label font-normal">
                                                                File 1
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <input type="file" required className="input-group" name="files1" id="files1" accept=".pdf" />
                                                        </div>
                                                    </div>


                                                    <div className="col-12  col-md-12">
                                                        <div className="mb-24">
                                                            <label className="form-label font-normal">
                                                                File 2
                                                            </label>
                                                            <input type="file" className="input-group" name="files2" id="files2" accept=".pdf" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12  col-md-12">
                                                        <div className="mb-24">
                                                            <label className="form-label font-normal">
                                                                File 3
                                                            </label>
                                                            <input type="file" className="input-group" name="files3" id="files3" accept=".pdf" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12  col-md-12">
                                                        <div className="mb-24">
                                                            <label className="form-label font-normal">
                                                                File 4
                                                            </label>
                                                            <input type="file" className="input-group" name="files4" id="files4" accept=".pdf" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12  col-md-12">
                                                        <div className="mb-24">
                                                            <label className="form-label font-normal">
                                                                File 5
                                                            </label>
                                                            <input type="file" className="input-group" name="files5" id="files5" accept=".pdf" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12  col-md-12">
                                                        <div className="mb-24">
                                                            <label className="form-label font-normal">
                                                                File 6
                                                            </label>
                                                            <input type="file" className="input-group" name="files6" id="files6" accept=".pdf" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12  col-md-12">
                                                        <div className="mb-24">
                                                            <label className="form-label font-normal">
                                                                File 7
                                                            </label>
                                                            <input type="file" className="input-group" name="files6" id="files7" accept=".pdf" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="modal-footer pt-0 px-24 pb-24">
                                                <div className="divider"></div>
                                                <Button type="submit" className="w-full" color="blue">Submit</Button>
                                            </div>
                                        </form>
                                        : <div className="text-center m-5">Data Tahanan Isi Terlebih Dahulu</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card hp-contact-card mb-32 -mt-3 shadow-md">
                        <div className="card-body px-0">
                            <ReactTable
                                search={search}
                                action={{
                                    delete: pagePermission.find((val: any) => val == "delete") ? URLAPI : null
                                }}
                                date={dateData}
                                urlFatch={URLAPI}
                                reload={dataCreate}
                                modalData={modalData}
                            />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}