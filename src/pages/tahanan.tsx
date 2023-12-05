import React, { Component, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Input, Textarea, Button } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import numeral from "numeral";

import Select from "../components/reactSelect";
import ImgUpload from "../components/imgUpload";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput"
import ReactSelect from "../components/reactSelect";

export default function Tahanan({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataTahanan, setDataTahanan] = useState([]);
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const URLAPI = "/api/tahanan";
    const Subject = "Tahanan";

    useEffect(() => {
        (document as any).title = Subject;
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            return val.data.find((vall: any) => {
                if (vall.label == Subject) {
                    return vall;
                }
            })
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? [])
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
        } else if (url === 'view') {
            try {
                await axios({
                    method: "GET",
                    url: URLAPI,
                    timeout: 5000,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setDataTahanan(res.data.data)
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
                label: 'Foto',
                full: true
            },
            {
                name: 'tanggalMasuk',
                type: 'date',
                id: 'tanggalMasuk',
                label: "Tanggal Masuk",
                required: true
            },
            {
                name: 'tanggalKeluar',
                type: 'date',
                id: 'tanggalKeluar',
                label: "Tanggal Keluar",
                required: true
            },
            {
                name: 'nama',
                type: 'text',
                id: 'nama',
                label: "Nama",
                required: true
            },
            {
                name: 'BIN',
                type: 'text',
                id: 'BIN',
                label: "BIN",
                required: true
            },
            {
                name: 'kamar',
                type: 'text',
                id: 'kamar',
                label: "No Kamar",
                required: true
            },
            {
                name: 'perkara',
                type: 'reactSelect',
                id: 'perkara',
                label: "Perkara",
                required: true,
                select: [
                    { label: 'PiDum', value: 'PiDum' },
                    { label: 'Narkoba', value: 'Narkoba' },
                    { label: 'Tipikor', value: 'Tipikor' }
                ]
            },
            {
                name: 'statusTahanan',
                type: 'reactSelect',
                id: 'statusTahanan',
                label: "Status Tahanan",
                required: true,
                select: [
                    { label: 'Tetap', value: 'Tetap' },
                    { label: 'Titipan', value: 'Titipan' }
                ]
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
        let img = null;
        let files = event.target.file.files?.[0];
        if (files) {
            let extension = files.type;
            let size = files.size;
            if (extension === 'image/jpeg' || extension === 'image/png') {
                if (size > 1000000) {
                    return toast.error("Size img only < 1000kb");
                } else {
                    img = await convertFileToBase64(files);
                }
            } else {
                return toast.error("Extension img not valid, only jpeg/png");
            }
        }

        if (event.target.status.value) {
            return toast.error("Status Tahanan Wajib Terisi");
        }

        if (event.target.perkara.value) {
            return toast.error("Perkara Tahanan Wajib Terisi");
        }


        let data = {
            nama: event.target.nama.value,
            tanggal: event.target.tanggal.value,
            tanggal_keluar: event.target.tanggal_keluar.value,
            BIN: event.target.BIN.value,
            kamar: event.target.kamar.value,
            status: event.target.status_val.value,
            perkara: event.target.perkara_val.value,
            img: img
        };

        handleApi('create', data);


    };

    const byNumeral = (val: any) => {
        let value = numeral(val.target.value).format('0,0');
        (document.getElementById(val.target.id) as HTMLInputElement).value = value;
    }

    const laporan = async () => {

        const get = await axios({
            method: "GET",
            url: URLAPI,
            timeout: 5000,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        let htmlData = '';
        get.data?.data.map((val: any, i: number) => {
            if (i == 0) {
                htmlData += `
                <div style="width:100%;text-align: center;font-weight: bolder;font-size: larger;margin-bottom: 20px;">Laporan Tahanan</div>
                <table>
                <tr>
                    <td>No</td>
                    <td>Nama</td>
                    <td>BIN</td>
                    <td>No Kamar</td>
                    <td>Perkara</td>
                    <td>Tanggal Masuk</td>
                    <td>Tanggal Keluar</td>
                    <td>Masa Tahan</td>
                    <td>Sisa Tahan</td>
                    <td>Status</td>
                </tr>`;
            }
            htmlData += `
            <tr>
                <td>${i + 1}</td>
                <td>${val.nama}</td>
                <td>${val.BIN}</td>
                <td>${val.kamar}</td>
                <td>${val.perkara}</td>
                <td>${val.tanggalMasuk}</td>
                <td>${val.tanggalKeluar}</td>
                <td>${val.masaTahan}</td>
                <td>${val.sisaTahan}</td>
                <td>${val.statusTahanan}</td>
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


                <div className="col-12 mt-10">
                    <div className="row g-16 align-items-center justify-content-end">
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="input-group align-items-center">
                                <DebouncedInput
                                    value={search ?? ''}
                                    onChange={value => setsearch(String(value))}
                                    className="form-control ps-8"
                                    placeholder="Search all columns..."
                                />
                            </div>
                        </div>

                        <div className="col hp-flex-none w-auto">
                            <Button className="w-100 px-5" onClick={() => {
                                laporan();
                            }}>Laporan</Button>
                        </div>

                        {pagePermission.find((val: any) => val == "create") ?
                            <div className="col hp-flex-none w-auto">
                                <Button type="button" className="w-100 px-5" variant="gradient" color="blue" data-bs-toggle="modal" data-bs-target="#addNewUser"><i className="ri-add-line remix-icon"></i> Tambah {Subject}</Button>
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
                                    <form onSubmit={submitAdd} id="formCreate">
                                        <div className="modal-body">
                                            <ImgUpload
                                                label="Foto"
                                                name="file"
                                                id="file" />
                                            <div className="row gx-8">

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="date" required variant="standard" className="border-b-1" name="tanggal" label="Tanggal Masuk" id="tanggal" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="date" required variant="standard" className="border-b-1" name="tanggal_keluar" label="Tanggal Keluar" id="tanggal_keluar" />
                                                    </div>
                                                </div>


                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="text" required variant="standard" className="border-b-1" name="nama" label="Nama" id="nama" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="texy=t" required variant="standard" className="border-b-1" name="BIN" label="BIN" id="BIN" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="text" required variant="standard" className="border-b-1" name="kamar" label="No Kamar" id="kamar" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <ReactSelect
                                                            name='perkara'
                                                            id="perkara"
                                                            label='Perkara'
                                                            data={[
                                                                { label: 'Pidum', value: 'Pidum' },
                                                                { label: 'Narkoba', value: 'Narkoba' },
                                                                { label: 'Tipikor', value: 'Tipikor' },
                                                            ]}
                                                            required={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <ReactSelect
                                                            name='status'
                                                            id="status"
                                                            label='Status'
                                                            data={[
                                                                { label: 'Tetap', value: 'Tetap' },
                                                                { label: 'Titipan', value: 'Titipan' }
                                                            ]}
                                                            required={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer pt-0 px-24 pb-24">
                                            <div className="divider"></div>
                                            <Button type="submit" className="w-full" color="blue">Submit</Button>
                                        </div>
                                    </form>
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
                                    delete: pagePermission.find((val: any) => val == "delete") ? URLAPI : null,
                                    edit: pagePermission.find((val: any) => val == "edit") ? URLAPI : null
                                }}
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