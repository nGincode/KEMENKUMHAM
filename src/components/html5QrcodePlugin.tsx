import { Html5QrcodeScanner } from "html5-qrcode";
import React from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

class Html5QrcodePlugin extends React.Component {
    html5QrcodeScanner: any;
    props: any;

    render() {
        return <>
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
            </div><div className="bg-gray-300" id={qrcodeRegionId} /></>;
    }

    componentWillUnmount() {
        this.html5QrcodeScanner.clear().catch((error: any) => {
            console.error("Failed to clear html5QrcodeScanner. ", error);
        });
    }

    componentDidMount() {
        // Creates the configuration object for Html5QrcodeScanner.
        function createConfig(props: any) {
            var config: any = {};
            if (props.fps) {
                config.fps = props.fps;
            }
            if (props.qrbox) {
                config.qrbox = props.qrbox;
            }
            if (props.aspectRatio) {
                config.aspectRatio = props.aspectRatio;
            }
            if (props.disableFlip !== undefined) {
                config.disableFlip = props.disableFlip;
            }
            return config;
        }

        var config = createConfig(this.props);
        var verbose = this.props.verbose === true;

        // Suceess callback is required.
        if (!(this.props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }

        this.html5QrcodeScanner = new Html5QrcodeScanner(
            qrcodeRegionId, config, verbose);
        this.html5QrcodeScanner.render(
            this.props.qrCodeSuccessCallback,
            this.props.qrCodeErrorCallback);
    }
};

export default Html5QrcodePlugin;