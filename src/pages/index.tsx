/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState, Suspense } from "react"
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import axios from "axios";
const url = process.env.URL;

import Html5QrcodePlugin from "./../components/html5QrcodePlugin"
import { Button } from "@material-tailwind/react";

export default function Index({ userData, setuserData }: any) {
    const [onNewScanResult, setonNewScanResult] = useState();
    const [sliderData, setsliderData] = useState([]);

    useEffect(() => {
        (document as any).title = 'Dashboard';


        $("#qr-reader img").hide();
        $("#qr-reader").css({
            "border-radius": "40px",
        });
        $("#qr-reader__header_message")
            .addClass("mt-3 bg-transparent")
            .css("border-top", "unset");
        $("#html5-qrcode-anchor-scan-type-change")
            .addClass("btn btn-primary")
            .css("text-decoration", "unset");
        $("#html5-qrcode-button-camera-permission")
            .addClass("btn btn-warning")
            .addClass("mb-2");
        $("#html5-qrcode-button-camera-stop")
            .addClass("btn btn-danger")
            .addClass("mb-2");
        $("#html5-qrcode-button-camera-start")
            .addClass("btn btn-success")
            .addClass("mb-2");

        const sliderJson = async () => {
            axios.get('/slider.json')
                .then((res: any) => {
                    setsliderData(res.data)
                })

        }
        sliderJson()

    }, []);

    const scan = async (val: any) => {
        (document.getElementById('html5-qrcode-button-camera-stop') as any).click();

        let value = val.split('|');
        if (value?.[1] == 'titipan') {
            try {
                await axios({
                    method: "GET",
                    url: '/api/titipan/' + value[0],
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    if (res.data.data) {
                        window.open(
                            url + '/titipan.html?uuid=' + value?.[0] + '&petugas=' + userData.namaLengkap + '&NIP=' + userData.NIP,
                            '_blank'
                        );
                    } else {
                        return toast.error('Kode Barcode Tidak Sesuai');
                    }
                }).catch(error => {
                    return toast.error('Kode Barcode Tidak Sesuai');
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else {
            if (value[0]) {
                try {
                    await axios({
                        method: "GET",
                        url: '/api/kunjungan/' + value[0],
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res: any) => {
                        if (res.data.data) {
                            window.open(
                                url + '/suratIzin.html?uuid=' + value?.[0] + '&petugas=' + userData.namaLengkap + '&NIP=' + userData.NIP,
                                '_blank'
                            );
                        } else {
                            return toast.error('Kode Barcode Tidak Sesuai');
                        }
                    }).catch(error => {
                        return toast.error('Kode Barcode Tidak Sesuai, Server Sedang Sibuk');
                    });
                } catch (error: any) {
                    toast.error(error.response.data.massage);
                }
            } else {
                return toast.error('Kode Barcode Tidak Sesuai');
            }
        }
    }
    const alatBarcode = async (val: any) => {
        let value = val.target.value.split('|');

        if (value?.[1] == 'titipan') {
            try {
                await axios({
                    method: "GET",
                    url: '/api/titipan/' + value[0],
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    if (res.data.data) {
                        window.open(
                            url + '/titipan.html?uuid=' + value?.[0] + '&petugas=' + userData.namaLengkap + '&NIP=' + userData.NIP,
                            '_blank'
                        );
                    } else {
                        // return toast.error('Kode Barcode Tidak Sesuai');
                    }
                }).catch(error => {
                    // return toast.error('Kode Barcode Tidak Sesuai');
                });
            } catch (error: any) {
                // toast.error(error.response.data.massage);
            }
        } else {
            if (value[0]) {
                try {
                    await axios({
                        method: "GET",
                        url: '/api/kunjungan/' + value[0],
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res: any) => {
                        if (res.data.data) {
                            window.open(
                                url + '/suratIzin.html?uuid=' + value?.[0] + '&petugas=' + userData.namaLengkap + '&NIP=' + userData.NIP,
                                '_blank'
                            );
                        } else {
                            // return toast.error('Kode Barcode Tidak Sesuai');
                        }
                    }).catch(error => {
                        // return toast.error('Kode Barcode Tidak Sesuai, Server Sedang Sibuk');
                    });
                } catch (error: any) {
                    // toast.error(error.response.data.massage);
                }
            } else {
                // return toast.error('Kode Barcode Tidak Sesuai');
            }
        }

        (document.getElementById('barcode') as any).value = '';

    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        let value = [
            event.target.gambar0.value,
            event.target.gambar1.value,
            event.target.gambar2.value,
            event.target.gambar3.value,
            event.target.gambar4.value,
            event.target.gambar5.value,
            event.target.gambar6.value,
            event.target.gambar7.value,
            event.target.gambar8.value,
            event.target.gambar9.value,
        ];
        axios.post("/api/slider", { data: value }).then((res: any) => {
            setsliderData(res.data)
            return toast.success('Slider Berhasil disimpan');
        })



    }
    return (
        <div className="row mb-32 g-32">

            <div className="mt-3">
                <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={scan} />

                <input onChange={alatBarcode} type="text" id="barcode" placeholder="Klik untuk gunakan alat barcode sampai berkedip" className="w-full border-none text-center focus:border-none" autoFocus />
            </div>
            <div className="w-full">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <div className="text-lg font-bold text-center">Slider Home</div>
                    {sliderData.map((val: any, i: number) => {
                        return (<div key={i} className="mb-8">
                            <center>
                                {val ? <img src={val} alt={'gambar' + i} width="100" height="100" /> : null}
                            </center>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={"gambar" + i}>
                                Gambar {i + 1}
                            </label>
                            <input defaultValue={val} name={"gambar" + i} className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={"gambar" + i} type="text" placeholder={`Gambar ${i + 1}`} />
                        </div>)
                    })}
                    <center><Button type="submit">Simpan</Button></center>
                </form>
            </div>
        </div>
    )
}