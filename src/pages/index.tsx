/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState, Suspense } from "react"
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import axios from "axios";
const url = process.env.URL;

import Html5QrcodePlugin from "./../components/html5QrcodePlugin"
import { Button } from "@material-tailwind/react";
import Link from "next/link";

export default function Index({ userData, setuserData }: any) {

    const Subject = "Scanning";

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
            if (value?.[1] == 'kuasa_hukum') {
                try {
                    await axios({
                        method: "GET",
                        url: '/api/kunjunganKuasaHukum/' + value[0],
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res: any) => {
                        if (res.data.data) {
                            window.open(
                                url + '/suratIzinKuasaHukum.html?uuid=' + value?.[0] + '&petugas=' + userData.namaLengkap + '&NIP=' + userData.NIP,
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
            if (value?.[1] == 'kuasa_hukum') {
                try {
                    await axios({
                        method: "GET",
                        url: '/api/kunjunganKuasaHukum/' + value[0],
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res: any) => {
                        if (res.data.data) {
                            window.open(
                                url + '/suratIzinKuasaHukum.html?uuid=' + value?.[0] + '&petugas=' + userData.namaLengkap + '&NIP=' + userData.NIP,
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
        }

        (document.getElementById('barcode') as any).value = '';

    }

    return (
        <div className="row mb-32 g-32">
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
            <div className="mt-3">
                <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={scan} />

                <input onChange={alatBarcode} type="text" id="barcode" placeholder="Klik untuk gunakan alat barcode sampai berkedip" className="w-full border-none text-center focus:border-none" autoFocus />
            </div>
        </div>
    )
}
