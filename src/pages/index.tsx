import React, { Component, useEffect, useState, Suspense } from "react"
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
// import { Html5QrcodeScanner } from "html5-qrcode";

// To use Html5Qrcode (more info below)
// import { Html5Qrcode } from "html5-qrcode";

export default function Index({ userData, setuserData }: any) {

    function onScanSuccess(decodedText: any, decodedResult: any) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);
    }

    function onScanFailure(error: any) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${error}`);
    }

    useEffect(() => {
        (document as any).title = 'Dashboard';

        // let html5QrcodeScanner = new Html5QrcodeScanner(
        //     "reader",
        //     { fps: 10, qrbox: { width: 250, height: 250 } },
        //     false);

        // html5QrcodeScanner.render(onScanSuccess, onScanFailure);

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


    return (
        <div className="row mb-32 g-32">

            <div className="mt-3">
                <div
                    style={{
                        textAlign: "center",
                        color: "black",
                        fontWeight: "bolder",
                        fontSize: "larger",
                        width: "100%",
                        background: "#b6b6b6",
                        height: "90px",
                        marginBottom: "-60px",
                        borderRadius: "30px",
                    }}
                >
                    Scan Kunjungan
                </div>
                <div id="reader" className="bg-gray-500"></div>
            </div>
        </div>
    )
}