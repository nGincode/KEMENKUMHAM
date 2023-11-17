import React, { Component, useEffect, useState, Suspense } from "react"
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const url = process.env.URL;

import Html5QrcodePlugin from "./../components/html5QrcodePlugin"

export default function Index({ userData, setuserData }: any) {
    const [onNewScanResult, setonNewScanResult] = useState();

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

    const scan = (val: any) => {
        (document.getElementById('html5-qrcode-button-camera-stop') as any).click();
        window.open(
            url + '/suratIzin.html?uuid=' + val,
            '_blank'
        );
    }
    const alatBarcode = (val: any) => {
        window.open(
            url + '/suratIzin.html?uuid=' + val.target.value,
            '_blank'
        );

        (document.getElementById('barcode') as any).value = '';

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
        </div>
    )
}