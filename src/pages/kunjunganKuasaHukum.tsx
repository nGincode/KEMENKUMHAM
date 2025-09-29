/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Input, Textarea, Button } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import numeral from "numeral";
import moment from "moment";
import { compress, compressAccurately } from 'image-conversion';

import Select from "../components/reactSelect";
import ImgUpload from "../components/imgUpload";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput"
import ReactSelect from "../components/reactSelect";

export default function kunjunganKuasaHukum({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [loadingSubmit, setloadingSubmit] = useState(false);
    const [dataTahanan, setdataTahanan] = useState<any>([]);
    const [dateData, setdateData] = useState<any>([moment().format('YYYY-MM-DD'), moment().add(7, 'days').format('YYYY-MM-DD')]);
    const [dataCreate, setdataCreate] = useState();
    const [SearchValue, setSearchValue] = useState<any>();
    const [search, setsearch] = useState('');
    const URLAPI = "/api/kunjunganKuasaHukum";
    const Subject = "Kunjungan Kuasa Hukum";

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
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdataTahanan(res.data.data)
                }).catch(error => {
                    // if (error?.response?.data?.massage) {
                    //     toast.error(error.response.data.massage);
                    // } else {
                    //     toast.error(error.message);
                    // }
                    console.log(error?.response?.data?.massage);
                });
            } catch (error: any) {
                // toast.error(error.response.data.massage);
                console.log(error.response.data.massage);
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
                    if (error?.response?.data?.massage) {
                        toast.error(error.response.data.massage);
                    } else {
                        toast.error(error.message);
                    }
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
            setloadingSubmit(false);
        }
    }


    const modalData =
        [
            {
                name: 'img',
                type: 'img',
                id: 'img',
                full: true,
                label: 'Upload KTA',
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
                name: 'NIA',
                type: 'text',
                id: 'NIA',
                Label: 'Nomor Induk Advokat '
            },
            {
                require: true,
                name: 'lembaga',
                type: 'text',
                id: 'lembaga',
                Label: 'Asal Lembaga/Biro Hukum',
            },
            {
                require: true,
                name: 'tujuan',
                type: 'text',
                id: 'tujuan',
                Label: 'Tujuan Kunjungan'
            },
            {
                require: true,
                name: 'noHp',
                type: 'number',
                id: 'noHp',
                Label: 'No Wa'
            },
            {
                require: true,
                name: 'tahanan_id',
                type: 'reactSelect',
                id: 'tahanan_id',
                label: 'Tahanan yang dikunjungi',
                search: true,
                full: true,
                select: dataTahanan.map((val: any) => {
                    return { value: val.id, label: val.nama }
                })
            },
        ]

    const submitAdd = async (event: any) => {
        setloadingSubmit(true);
        event.preventDefault();

        const formData = new FormData(document.getElementById("formCreate") as any);
        let img = null;
        let files = (document.getElementById('file') as any)?.files[0];
        if (files) {
            let extension = files.type;
            let size = files.size;
            if (extension === 'image/jpeg' || extension === 'image/png') {
                if (size > 20000000) {
                    return toast.error("Size img only < 20Mb");
                } else {
                    // img = await convertFileToBase64(files);
                    img = files
                }
            } else {
                return toast.error("Extension img not valid, only jpeg/png");
            }
        }


        let suratKuasa = null;
        let files2 = (document.getElementById('suratKuasa') as any)?.files[0];
        if (files2) {
            let size2 = files2.size;
            if (size2 > 20000000) {
                return toast.error("Size img only < 20Mb");
            } else {
                // suratIzin = await convertFileToBase64(files2);
                suratKuasa = files2;
            }
        }


        let selfi = null;
        let files3 = (document.getElementById('selfi') as any)?.files[0];
        if (files3) {
            let size3 = files3.size;
            if (size3 > 20000000) {
                return toast.error("Size img only < 20Mb");
            } else {
                // suratIzin = await convertFileToBase64(files2);
                selfi = files3;
            }
        }


        let suratIzin = null;
        let files4 = (document.getElementById('suratIzin') as any)?.files[0];
        if (files4) {
            let size4 = files4.size;
            if (size4 > 20000000) {
                return toast.error("Size img only < 20Mb");
            } else {
                // suratIzin = await convertFileToBase64(files2);
                suratIzin = files4;
            }
        }

        if (!event.target.tahanan_id.value) {
            setloadingSubmit(false);
            return toast.error("Tahanan dikunjungi belum terisi");
        }
        if (!event.target.NIA.value) {
            setloadingSubmit(false);
            return toast.error("Nomor Induk Advokat belum terisi");
        }
        if (!event.target.lembaga.value) {
            setloadingSubmit(false);
            return toast.error("Asal Lembaga/Biro Hukum belum terisi");
        }
        if (!event.target.tujuan.value) {
            setloadingSubmit(false);
            return toast.error("Tujuan Kunjungan belum terisi");
        }
        if (!event.target.noHp.value) {
            setloadingSubmit(false);
            return toast.error("No Wa belum terisi");
        }
        if (!event.target.waktu.value) {
            setloadingSubmit(false);
            return toast.error("Waktu Kunjungan belum terisi");
        }


        if (!img) {
            setloadingSubmit(false);
            return toast.error("Upload KTA Wajib Terisi");
        }

        if (!selfi) {
            setloadingSubmit(false);
            return toast.error("Selfi Wajib Terisi");
        }

        if (!suratKuasa) {
            setloadingSubmit(false);
            return toast.error("Surat Kuasa Wajib Terisi");
        }

        if (!suratIzin) {
            setloadingSubmit(false);
            return toast.error("Surat Izin Wajib Terisi");
        }

        let data = {
            nama: event.target.nama.value,
            waktu: event.target.waktu.value,
            NIA: event.target.NIA.value,
            tujuan: event.target.tujuan.value,
            lembaga: event.target.lembaga.value,
            tahanan_id: event.target.tahanan_id.value,
            noHp: event.target.noHp.value,
            img: img,
            suratKuasa: suratKuasa,
            suratIzin: suratIzin
        };



        if (files) {
            const file = await compressAccurately(files, 100)
            formData.append('file', file, files.name);
        }

        if (files3) {
            const file2 = await compressAccurately(files3, 100)
            formData.append('selfi', file2, files3.name);
        }

        if (files2) {
            const file3 = await compressAccurately(files2, 100)
            formData.append('suratKuasa', file3, files2.name);
        }

        if (files4) {
            const file4 = await compressAccurately(files4, 100)
            formData.append('suratIzin', file4, files4.name);
        }

        handleApi('create', formData);
    };

    const resizeExternalImage = (ImgtoBeResized: any) => {
        return `https://images.weserv.nl/?url=https://app.easyrubero.com${ImgtoBeResized}&q=60`;
    };


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
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })

        let htmlData = '';
        get.data?.data.map((val: any, i: number) => {
            if (i == 0) {
                htmlData += `
                <div style="width:100%;text-align: center;font-weight: bolder;font-size: larger;margin-bottom: 20px;">Laporan Kunjungan</div>
                <table>
                <tr>
                    <td>No</td>
                    <td>KTP</td>
                    <td>Selfi</td>
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
                <td><img src='${resizeExternalImage(val.img)}' height='50' /></td>
                <td><img src='${resizeExternalImage(val.selfi)}' height='50' /></td>
                <td>${val.waktuKunjungan}</td>
                <td>${val.nama}</td>
                <td>${val.NIK}</td>
                <td>${val.jenisKelamin}</td>
                <td>${val.noHp}</td>
                <td>${val.alamat}</td>
                <td>${val.pengikutDewasa ? val.pengikutDewasa + ' Dewasa' : ''} ${val.pengikutAnak ? '& ' + val.pengikutAnak + ' Anak-Anak' : ''} </td>
                <td>${val.tahanan}</td>
                <td>${val.perkara}</td>
                <td>${val.hubungan ?? '-'}</td>
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

                        <div className="col-12 col-md-3 col-xl-3">
                            <div className="input-group align-items-center">
                                <DebouncedInput
                                    value={search ?? ''}
                                    onChange={value => setsearch(String(value))}
                                    className="form-control ps-8"
                                    placeholder="Search all columns..."
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
                            <div className="input-group align-items-center">
                                <Input type="date" id="tanggal_mulai" defaultValue={moment().format('YYYY-MM-DD')} onChange={(val: any) => { setdateData([val.target.value, (document.getElementById('tanggal_akhir') as any)?.value]) }} label="Tanggal Mulai" variant="standard" name="start" />
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
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
                                                <div className="flex justify-center">
                                                    <div>
                                                        <ImgUpload
                                                            label="Upload KTA"
                                                            id="file" />
                                                    </div>
                                                    <div className="ml-5">
                                                        <ImgUpload
                                                            label="Selfi"
                                                            id="selfi" />
                                                    </div>
                                                </div>
                                                <div className="row gx-8">

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="date" required variant="standard" className="border-b-1" name="waktu" label="Waktu Kunjungan" id="waktu" />
                                                        </div>
                                                    </div>


                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="nama" label="Nama Penasehat Hukum" id="nama" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="NIA" label="Nomor Induk Advokat" id="NIA" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="lembaga" label="Asal Lembaga/Biro Hukum" id="lembaga" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="tujuan" label="Tujuan Kunjungan" id="tujuan" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12  col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="number" required variant="standard" className="border-b-1" name="noHp" label="No WA" id="noHp" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-12">
                                                        <div className="mb-24 ">
                                                            <ReactSelect
                                                                name='tahanan_id'
                                                                search={true}
                                                                label='Tahanan yang dikunjungi'
                                                                setSearchValue={setSearchValue}
                                                                data={dataTahanan.map((val: any) => {
                                                                    return { value: val.id, label: val.nama }
                                                                })}
                                                                required={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    {dataTahanan.map((val: any, i: number) => {
                                                        return <div className=" flex gap-2" key={i}>
                                                            {val.id == SearchValue?.value ? <>
                                                                <div className="col-12  col-md-6">
                                                                    <div className="mb-24">
                                                                        <Input readOnly label="Perkara" type="text" value={val.perkara} variant="standard" className="border-b-1" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12  col-md-6">
                                                                    <div className="mb-24">
                                                                        <Input readOnly label="No Kamar" type="text" value={val.kamar} variant="standard" className="border-b-1" />
                                                                    </div>
                                                                </div>
                                                            </> : null}
                                                        </div>

                                                    })}
                                                    <div className="col-12  col-md-6 ">
                                                        <label>Surat Kuasa</label>
                                                        <div className="mb-24">
                                                            <input type="file" required accept="image/*" id="suratKuasa" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12  col-md-6 ">
                                                        <label>Surat Izin Pihak Penahan</label>
                                                        <div className="mb-24">
                                                            <input type="file" required accept="image/*" id="suratIzin" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="modal-footer pt-0 px-24 pb-24">
                                                <div className="divider"></div>
                                                {loadingSubmit ?
                                                    <Button className="w-full" disabled color="blue">Sedang Upload...</Button> :
                                                    <Button type="submit" className="w-full" color="blue">Submit</Button>
                                                }
                                            </div>
                                        </form>
                                        : <div className="text-center m-5">Data Tahanan Isi Terlebih Dahulu</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card hp-contact-card mb-32 -mt-3 shadow-lg">
                        <div className="card-body px-0">
                            <ReactTable
                                search={search}
                                action={{
                                    userData: userData,
                                    kunjunganKuasaHukum: true,
                                    delete: pagePermission.find((val: any) => val == "delete") ? URLAPI : null,
                                    edit: pagePermission.find((val: any) => val == "edit") ? URLAPI : null
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