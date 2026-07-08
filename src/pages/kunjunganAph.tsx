/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, FormEvent } from "react";
import toast from 'react-hot-toast';
import { Input, Button } from "@material-tailwind/react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import moment from "moment";
import { compressAccurately } from 'image-conversion';
import $ from 'jquery';

import ImgUpload from "../components/imgUpload";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput";
import ReactSelect from "../components/reactSelect";

// --- Types & Interfaces ---
interface Tahanan {
    id: string | number;
    nama: string;
    perkara: string;
    kamar: string;
}

interface SelectOption {
    value: string | number;
    label: string;
}

interface UserDataProps {
    userData: {
        permission?: {
            data?: {
                data: {
                    label: string;
                    checklist: string[];
                }[];
            }[];
        };
    };
    setuserData?: React.Dispatch<React.SetStateAction<unknown>>;
}

interface LaporanResponse {
    data: {
        img: string;
        selfi: string;
        suratKuasa: string;
        suratIzin: string;
        waktuKunjungan: string;
        nama: string;
        NIA: string;
        lembaga: string;
        tujuan: string;
        noHp: string;
        tahanan: string;
        perkara: string;
    }[];
}

export default function KunjunganAph({ userData, setuserData }: UserDataProps) {
    const [pagePermission, setpagePermission] = useState<string[]>([]);
    const [loadingSubmit, setloadingSubmit] = useState<boolean>(false);
    const [dataTahanan, setdataTahanan] = useState<Tahanan[]>([]);
    const [dateData, setdateData] = useState<string[]>([moment().format('YYYY-MM-DD'), moment().add(7, 'days').format('YYYY-MM-DD')]);
    const [dataCreate, setdataCreate] = useState<unknown>();

    // State Array untuk form Tahanan Dinamis (dimulai dengan 1 baris kosong)
    const [selectedTahanans, setSelectedTahanans] = useState<(SelectOption | null)[]>([null]);

    const [search, setsearch] = useState<string>('');
    const URLAPI = "/api/kunjunganAph";
    const Subject = "Kunjungan APH";

    useEffect(() => {
        document.title = Subject;

        const permissions = userData?.permission?.data?.map((val) => {
            return val.data.find((vall) => vall.label === Subject);
        })?.filter((val) => val !== undefined)?.[0]?.checklist ?? [];

        setpagePermission(permissions);

        const handleApiFirst = async () => {
            try {
                const res = await axios({
                    method: "GET",
                    url: '/api/tahanan',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setdataTahanan(res.data.data);
            } catch (error) {
                const err = error as AxiosError<{ massage: string }>;
                console.log(err?.response?.data?.massage || err.message);
            }
        }

        handleApiFirst();
    }, [userData]);

    // --- Logic Form Dinamis Tahanan ---
    const handleAddTahananRow = () => {
        setSelectedTahanans([...selectedTahanans, null]);
    };

    const handleRemoveTahananRow = (indexToRemove: number) => {
        const newArr = selectedTahanans.filter((_, index) => index !== indexToRemove);
        setSelectedTahanans(newArr);
    };

    const handleSelectTahanan = (index: number, val: SelectOption) => {
        const newArr = [...selectedTahanans];
        newArr[index] = val;
        setSelectedTahanans(newArr);
    };
    // ----------------------------------

    const handleApi = async (url: string, data: FormData | null = null) => {
        if (url === 'create') {
            try {
                const res = await axios({
                    method: "POST",
                    url: URLAPI,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setdataCreate(res.data.data);
                toast.success(res.data.massage);

                $('.btn-close').trigger("click");
                (document.getElementById('formCreate') as HTMLFormElement).reset();
                (document.getElementById('closeImg') as HTMLInputElement)?.click();
                setSelectedTahanans([null]); // Reset form dinamis ke 1 baris

            } catch (error) {
                const err = error as AxiosError<{ massage: string }>;
                if (err?.response?.data?.massage) {
                    toast.error(err.response.data.massage);
                } else {
                    toast.error(err.message);
                }
            } finally {
                setloadingSubmit(false);
            }
        }
    }

    const modalData = [
        { name: 'img', type: 'img', id: 'img', label: 'Upload KTA' },
        { name: 'selfi', type: 'img', id: 'selfi', label: 'Selfi' },
        { require: true, name: 'waktuKunjungan', type: 'date', id: 'waktuKunjungan', Label: 'Waktu Kunjungan' },
        { require: true, name: 'nama', type: 'text', id: 'nama', Label: 'Nama APH' },
        { require: true, name: 'NIA', type: 'text', id: 'NIA', Label: 'NIA' },
        { require: true, name: 'lembaga', type: 'text', id: 'lembaga', Label: 'Asal Lembaga' },
        { require: true, name: 'tujuan', type: 'text', id: 'tujuan', Label: 'Tujuan Kunjungan' },
        { require: true, name: 'noHp', type: 'number', id: 'noHp', Label: 'No Wa' }
    ];

    const submitAdd = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setloadingSubmit(true);

        const form = event.currentTarget;
        const formData = new FormData(form);

        // Pengambilan File
        const getFile = (id: string): File | null => {
            const input = document.getElementById(id) as HTMLInputElement;
            return input?.files ? input.files[0] : null;
        };

        const img = getFile('file');
        const suratKuasa = getFile('suratKuasa');
        const selfi = getFile('selfi');
        const suratIzin = getFile('suratIzin');

        // Validasi File & Ukuran
        const validateImage = (file: File | null, typeLimit: boolean = false) => {
            if (!file) return false;
            if (typeLimit && !['image/jpeg', 'image/png'].includes(file.type)) {
                toast.error("Extension img not valid, only jpeg/png");
                return false;
            }
            if (file.size > 20000000) {
                toast.error("Size img only < 20Mb");
                return false;
            }
            return true;
        };

        if (!img || !validateImage(img, true)) { setloadingSubmit(false); return toast.error("Upload KTA / ID Wajib Terisi (Valid: jpeg/png, < 20MB)"); }
        if (!selfi || !validateImage(selfi)) { setloadingSubmit(false); return toast.error("Selfi Wajib Terisi (< 20MB)"); }
        if (!suratKuasa || !validateImage(suratKuasa)) { setloadingSubmit(false); return toast.error("Surat Kuasa Wajib Terisi (< 20MB)"); }
        if (!suratIzin || !validateImage(suratIzin)) { setloadingSubmit(false); return toast.error("Surat Izin Wajib Terisi (< 20MB)"); }

        // Validasi Input Teks
        const requiredFields = ['NIA', 'lembaga', 'tujuan', 'noHp', 'waktu'];
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                setloadingSubmit(false);
                return toast.error(`${field} belum terisi`);
            }
        }

        // Proses Form Dinamis Tahanan
        const validTahanans = selectedTahanans.filter((item) => item !== null && item.value !== undefined && item.value !== '');
        if (validTahanans.length === 0) {
            setloadingSubmit(false);
            return toast.error("Minimal 1 Tahanan harus dipilih");
        }

        // Bersihkan key tahanan_id bawaan jika ada dari ReactSelect, ganti dengan array murni
        formData.delete('tahanan_id');
        selectedTahanans.forEach((_, i) => formData.delete(`tahanan_id_${i}`));

        validTahanans.forEach((item) => {
            formData.append('tahanan_id[]', item!.value.toString());
        });

        // Kompresi & Append Gambar
        try {
            if (img) formData.set('file', await compressAccurately(img, 100), img.name);
            if (selfi) formData.set('selfi', await compressAccurately(selfi, 100), selfi.name);
            if (suratKuasa) formData.set('suratKuasa', await compressAccurately(suratKuasa, 100), suratKuasa.name);
            if (suratIzin) formData.set('suratIzin', await compressAccurately(suratIzin, 100), suratIzin.name);
        } catch (err) {
            setloadingSubmit(false);
            return toast.error("Gagal mengkompresi gambar");
        }

        handleApi('create', formData);
    };

    const resizeExternalImage = (ImgtoBeResized: string) => {
        return `https://images.weserv.nl/?url=https://app.easyrubero.com${ImgtoBeResized}&q=60`;
    };

    const laporan = async (tanggal_mulai: string, tanggal_akhir: string) => {
        if (!tanggal_mulai) return alert('Tanggal Awal Belum Dipilih');
        if (!tanggal_akhir) return alert('Tanggal Akhir Belum Dipilih');

        if (moment(tanggal_mulai, 'YYYY-MM-DD') > moment(tanggal_akhir, 'YYYY-MM-DD')) {
            return alert('Tanggal Awal Harus dibawah Tanggal Akhir');
        }

        try {
            const get = await axios.get<LaporanResponse>(
                `${URLAPI}?tanggal_mulai=${tanggal_mulai}&tanggal_akhir=${tanggal_akhir}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            let htmlData = '';
            get.data?.data.forEach((val, i) => {
                if (i === 0) {
                    htmlData += `
                    <div style="width:100%;text-align: center;font-weight: bolder;font-size: larger;margin-bottom: 20px;">Laporan Kunjungan APH</div>
                    <table>
                    <tr>
                        <td>No</td>
                        <td>KTP/KTA</td>
                        <td>Selfi</td>
                        <td>Surat Kuasa</td>
                        <td>Surat Izin</td>
                        <td>Waktu Kunjungan</td>
                        <td>Nama</td>
                        <td>NIA</td>
                        <td>Asal Lembaga</td>
                        <td>Tujuan</td>
                        <td>No Hp</td>  
                        <td>Nama Tahanan</td>
                        <td>Perkara</td> 
                    </tr>`;
                }

                htmlData += `
                <tr>
                    <td>${i + 1}</td>
                    <td><img src='${resizeExternalImage(val.img)}' height='50' /></td>
                    <td><img src='${resizeExternalImage(val.selfi)}' height='50' /></td>
                    <td><img src='${resizeExternalImage(val.suratKuasa)}' height='50' /></td>
                    <td><img src='${resizeExternalImage(val.suratIzin)}' height='50' /></td>
                    <td>${val.waktuKunjungan}</td>
                    <td>${val.nama}</td>
                    <td>${val.NIA}</td>
                    <td>${val.lembaga}</td>
                    <td>${val.tujuan}</td>
                    <td>${val.noHp}</td>  
                    <td>${val.tahanan}</td>
                    <td>${val.perkara}</td> 
                </tr>
                `;

                if (i === get.data.data.length - 1) {
                    htmlData += `</table>`;
                }
            });

            const mywindow = window.open('', 'Print', 'height=600,width=800');
            if (mywindow) {
                mywindow.document.write('<html><head><title>Print</title>');
                mywindow.document.write('</head><body >');
                mywindow.document.write(`
                   <div style="display: flex; align-items: center; margin-bottom: 5px">
                        <img src="img/logo3.png" style="height: 80px; margin-right: 15px">
                        <div style="text-align: center; flex: 1">
                            <div style="font-weight: bold">
                            KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN REPUBLIK INDONESIA<br>
                            DIREKTORAT JENDERAL PEMASYARAKATAN<br>
                            KANTOR WILAYAH BENGKULU<br>
                            RUMAH TAHANAN NEGARA KELAS IIB BENGKULU
                            </div>
                            <div style="font-size: 12px">
                            Jl. Brigjen Berlian No.556 Bengkulu, Kel. Malabero, Kec. Teluk Segara,
                            Kota Bengkulu<br>
                            Laman : rutanbengkulu.kemenkumham.go.id, email :
                            rutanbengkulu@gmail.com
                            </div>
                        </div>
                        </div> 
                        <hr style="border: 1px solid black; margin: 0 0 10px 0" />
                    ${htmlData}
                `);
                mywindow.document.write('<style>table {width:100%} table, th, td {border: 1px solid black;border-collapse: collapse;}</style></body></html>');
                mywindow.document.close();
                mywindow.focus();

                setTimeout(() => {
                    mywindow.print();
                }, 1000);
            }
        } catch (error) {
            console.error("Gagal menarik data laporan", error);
            alert("Gagal memuat laporan");
        }
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
                                <Input type="date" id="tanggal_mulai" defaultValue={moment().format('YYYY-MM-DD')} onChange={(val) => { setdateData([val.target.value, (document.getElementById('tanggal_akhir') as HTMLInputElement)?.value]) }} label="Tanggal Mulai" variant="standard" name="start" />
                            </div>
                        </div>
                        <div className="col-12 col-md-3">
                            <div className="input-group align-items-center">
                                <Input type="date" id="tanggal_akhir" defaultValue={moment().add(7, 'days').format('YYYY-MM-DD')} onChange={(val) => { setdateData([(document.getElementById('tanggal_mulai') as HTMLInputElement)?.value, val.target.value]) }} label="Tanggal Akhir" variant="standard" name="end" />
                            </div>
                        </div>

                        <div className="col hp-flex-none w-auto">
                            <Button className="w-100 px-5" onClick={() => {
                                laporan((document.getElementById('tanggal_mulai') as HTMLInputElement).value, (document.getElementById('tanggal_akhir') as HTMLInputElement).value);
                            }}>Laporan</Button>
                        </div>

                        {pagePermission.find((val) => val === "create") ?
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
                                                        <ImgUpload label="Upload KTA / ID" id="file" />
                                                    </div>
                                                    <div className="ml-5">
                                                        <ImgUpload label="Selfi" id="selfi" />
                                                    </div>
                                                </div>
                                                <div className="row gx-8 mt-5">
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="date" required variant="standard" className="border-b-1" name="waktu" label="Waktu Kunjungan" id="waktu" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="nama" label="Nama APH" id="nama" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="NIA" label="NIA" id="NIA" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="lembaga" label="Asal Lembaga" id="lembaga" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="tujuan" label="Tujuan Kunjungan" id="tujuan" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="number" required variant="standard" className="border-b-1" name="noHp" label="No WA" id="noHp" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* SECTION TAHANAN DINAMIS */}
                                                <div className="mt-4 mb-4">
                                                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                                                        <h6 className="font-bold text-lg">Daftar Tahanan yang Dikunjungi</h6>
                                                        <Button type="button" size="sm" color="green" onClick={handleAddTahananRow}>
                                                            <i className="ri-add-line"></i> Tambah Tahanan
                                                        </Button>
                                                    </div>

                                                    {selectedTahanans.map((selected, index) => {
                                                        const detailTahanan = dataTahanan.find((val) => val.id === selected?.value);

                                                        return (
                                                            <div key={index} className="p-4 mt-5 mb-4 border border-gray-200 rounded-lg bg-gray-50/50 relative">
                                                                {selectedTahanans.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveTahananRow(index)}
                                                                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-2 rounded"
                                                                    >
                                                                        <i className="ri-delete-bin-line"></i> Hapus
                                                                    </button>
                                                                )}

                                                                <div className="row gx-8 m-2 mt-5">
                                                                    <div className="col-12 col-md-12">
                                                                        <div className="mb-24 pr-12"> {/* Memberi ruang untuk tombol hapus di kanan */}
                                                                            <ReactSelect
                                                                                name={`tahanan_id_${index}`}
                                                                                search={true}
                                                                                label={`Tahanan ${index + 1}`}
                                                                                setSearchValue={(val: SelectOption) => handleSelectTahanan(index, val)}
                                                                                data={dataTahanan.map((val) => ({ value: val.id, label: val.nama }))}
                                                                                required={true}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {detailTahanan && (
                                                                        <div className="flex gap-2 w-full">
                                                                            <div className="col-12 col-md-6">
                                                                                <div className="mb-24">
                                                                                    <Input readOnly label={`Perkara - ${detailTahanan.nama}`} type="text" value={detailTahanan.perkara} variant="standard" className="border-b-1" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 col-md-6">
                                                                                <div className="mb-24">
                                                                                    <Input readOnly label={`No Kamar - ${detailTahanan.nama}`} type="text" value={detailTahanan.kamar} variant="standard" className="border-b-1" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {/* END SECTION TAHANAN DINAMIS */}

                                                <div className="row gx-8 mt-6">
                                                    <div className="col-12 col-md-6">
                                                        <label>Surat Kuasa</label>
                                                        <div className="mb-24">
                                                            <input type="file" required accept="image/*" id="suratKuasa" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <label>Surat Izin</label>
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
                                    kunjunganAph: true,
                                    delete: pagePermission.find((val) => val === "delete") ? URLAPI : null,
                                    edit: pagePermission.find((val) => val === "edit") ? URLAPI : null
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