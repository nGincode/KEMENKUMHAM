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

export default function Kunjungan({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataTahanan, setdataTahanan] = useState<any>([]);
    const [dateData, setdateData] = useState<any>([moment().format('YYYY-MM-DD'), moment().add(7, 'days').format('YYYY-MM-DD')]);
    const [dataCreate, setdataCreate] = useState();
    const [SearchValue, setSearchValue] = useState<any>();
    const [search, setsearch] = useState('');
    const URLAPI = "/api/kunjungan";
    const Subject = "Kunjungan";

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
                        name: 'pengikutDewasa',
                        type: 'number',
                        id: 'pengikutDewasa',
                        placeholder: 'Jumlah Pengunjung Dewasa'
                    },
                    {
                        name: 'pengikutAnak',
                        type: 'number',
                        id: 'pengikutAnak',
                        placeholder: 'Jumlah Anak-anak'
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
        let img = null;
        let files = event.target.file?.files?.[0];
        if (files) {
            let extension = files.type;
            let size = files.size;
            if (extension === 'image/jpeg' || extension === 'image/png') {
                if (size > 5000000) {
                    return toast.error("Size img only < 5000kb");
                } else {
                    // img = await convertFileToBase64(files);
                    img = files
                }
            } else {
                return toast.error("Extension img not valid, only jpeg/png");
            }
        }


        let suratIzin = null;
        let files2 = event.target.suratIzin?.files?.[0];
        if (files2) {
            let size2 = files2.size;
            if (size2 > 5000000) {
                return toast.error("Size img only < 5Mb");
            } else {
                // suratIzin = await convertFileToBase64(files2);
                suratIzin = files2;
            }
        }


        let selfi = null;
        let files3 = event.target.selfi?.files?.[0];
        if (files3) {
            let size3 = files3.size;
            if (size3 > 5000000) {
                return toast.error("Size img only < 5Mb");
            } else {
                // suratIzin = await convertFileToBase64(files2);
                selfi = files3;
            }
        }

        if (!event.target.tahanan_id.value) {
            return toast.error("Tahanan dikunjungi belum terisi");
        }

        if (!event.target.kelamin_val.value) {
            return toast.error("Jenis Kelamin belum terisi");
        }

        if (!img) {
            return toast.error("Foto KTP Wajib Terisi");
        }

        if (!selfi) {
            return toast.error("Selfi Wajib Terisi");
        }
        let data = {
            nama: event.target.nama.value,
            waktuKunjungan: event.target.waktu.value,
            NIK: event.target.nik_ktp.value,
            alamat: event.target.alamat.value,
            jenisKelamin: event.target.kelamin_val.value,
            tahanan_id: event.target.tahanan_id.value,
            noHp: event.target.noHp.value,
            hubungan: event.target.hubungan.value,
            pengikut: {
                dewasa: event.target.pengikut_dewasa.value, anak: event.target.pengikut_anak.value
            },
            img: img,
            suratIzin: suratIzin
        };


        const formData = new FormData(document.getElementById("formCreate") as any);

        handleApi('create', formData);
    };

    const byNumeral = (val: any) => {
        let value = numeral(val.target.value).format('0,0');
        (document.getElementById(val.target.id) as HTMLInputElement).value = value;
    }

    const resizeExternalImage = (ImgtoBeResized: any) => {
        return `https://images.weserv.nl/?url=${ImgtoBeResized}&q=60`
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
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
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
                                                            label="Foto KTP"
                                                            name="file"
                                                            id="file" />
                                                    </div>
                                                    <div className="ml-5">
                                                        <ImgUpload
                                                            label="Selfi"
                                                            name="selfi"
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
                                                            <Input type="text" required variant="standard" className="border-b-1" name="nama" label="Nama" id="nama" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="number" required variant="standard" className="border-b-1" name="nik_ktp" label="NIK KTP" id="nik_ktp" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <ReactSelect
                                                                name='kelamin'
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

                                                    <div className="col-12 col-md-6 mb-5">
                                                        <label htmlFor="pengikut" className="form-label">
                                                            <span className="text-danger me-4">*</span>Pengunjung
                                                        </label>
                                                        <div className="input-group">
                                                            <input type="number" required placeholder="Jumlah Org Dewasa" name="pengikut_dewasa" className="form-control" />
                                                            <input type="number" required placeholder="Jumlah Org Anak-Anak" name="pengikut_anak" className="form-control" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
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
                                                        return <div className="row" key={i}>
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
                                                            {val.statusTahanan == "Titipan" && val.id == SearchValue?.value ?
                                                                <div className="col-12  col-md-6 ">
                                                                    <label>Surat Izin</label>
                                                                    <div className="mb-24">
                                                                        <input type="file" required accept="image/*,application/pdf" name="suratIzin" id="suratIzin" />
                                                                    </div>
                                                                </div>
                                                                : null}
                                                        </div>

                                                    })}

                                                    <div className="col-12 col-md-12">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="hubungan" label="Hubungan dgn Tahanan" id="hubungan" />
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
                                    userData: userData,
                                    kunjungan: true,
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