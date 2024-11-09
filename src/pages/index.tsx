/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState, Suspense } from "react"
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import axios from "axios";
const url = process.env.URL;

import Html5QrcodePlugin from "./../components/html5QrcodePlugin"
import { Button } from "@material-tailwind/react";

export default function Index({ userData, setuserData }: any) {
    const [onsliderData, setsliderData] = useState([]);


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
            axios.post('api/slider', { get: true })
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

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // Create a new FormData object
        const formData = new FormData();
        const file = event.target[`gambar`]?.files?.[0];
        if (file) {
            formData.append(`gambar`, file);
        }



        try {
            // Use Axios to send the FormData to the server
            const response: any = await axios.post('/api/slider', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            await axios.post('api/slider', { get: true })
                .then((res: any) => {
                    setsliderData(res.data)
                })

            // Process the response, for example show a success toast
            if (response.data.message) {
                toast.success('Gambar Berhasil disimpan');
            } else {
                toast.error(response.data.error);
            }
            event.target[`gambar`].value = '';
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('Terjadi kesalahan saat menyimpan slider');
            event.target[`gambar`].value = '';
        }
    };
    const styles: any = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '20px',
        },
        imageGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',  // Uniform size for images
            gap: '20px',  // Increased gap between images
            width: '100%',
            maxWidth: '900px',
        },
        imageContainer: {
            position: 'relative',
            width: '100%',
            height: 'auto',
            border: '2px solid #ddd',  // Border around images
            borderRadius: '8px',  // Rounded corners for the container
            overflow: 'hidden',  // Ensures that images stay within the container
        },
        image: {
            width: '100%',
            height: '200px',  // Fixed height for all images
            objectFit: 'cover',  // Maintain aspect ratio while covering the area
        },
        deleteButton: {
            position: 'absolute',
            top: '5px',
            right: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            border: 'none',
            borderRadius: '50%',
            padding: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            color: 'red',  // Red icon color
        },
    };

    const handleDelete = (index: number) => {
        // Show confirmation dialog before deleting
        const confirmDelete = window.confirm('Yakin ingin menghapus?');

        // If the user confirms, delete the image
        if (confirmDelete) {
            axios.post('api/slider', { del: index })
                .then((res: any) => {
                    if (res.data.message) {
                        toast.success('Gambar Berhasil dihapus');
                    } else {
                        toast.error(res.data.error);
                    }
                })
            axios.post('api/slider', { get: true })
                .then((res: any) => {
                    setsliderData(res.data)
                })
        }
    };

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
                    <div className="mb-8">
                        <center>
                            <div style={styles.container}>
                                <div style={styles.imageGrid}>
                                    {onsliderData?.map((imgSrc, i) => (
                                        <div key={i} style={styles.imageContainer}>
                                            <img src={imgSrc} alt={`gambar${i}`} style={styles.image} />
                                            <a
                                                onClick={() => handleDelete(imgSrc)}
                                                style={styles.deleteButton}
                                                aria-label={`Delete image ${i}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18M3 6l1 16h16l1-16M10 11v6M14 11v6"></path>
                                                </svg>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </center>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={"gambar"}>
                            Upload
                        </label>
                        <input type="file" accept="image/*" name={"gambar"} className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={"gambar"} placeholder={`Gambar`} />
                    </div>

                    <center><Button type="submit">Simpan</Button></center>
                </form>
            </div>
        </div>
    )
}
