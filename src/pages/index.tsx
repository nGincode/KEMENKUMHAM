import React, { Component, useEffect, useState, Suspense } from "react"
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";

import Chart from "../components/chart";
import Skelaton from '../components/skelaton';

export default function Index({ userData, setuserData }: any) {

    useEffect(() => {
        (document as any).title = 'Dashboard';
        require("./../../public/app-assets/js/cards/card-analytic.js");
        require("./../../public/app-assets/js/cards/card-advance.js");
        require("./../../public/app-assets/js/cards/card-statistic.js");
    }, []);


    return (
        <div className="row mb-32 g-32">
            <div className="col flex-grow-1 overflow-hidden">
                <div className="row g-32">
                    <div className="col-12">
                        <h1 className="hp-mb-0 text-4xl font-bold">Dashboard</h1>
                    </div>

                    <div className="col-12">
                        <div className="row g-32">
                            <div className="col-md-4 col-6">
                                <div className="card shadow-md  hp-dashboard-feature-card hp-border-color-black-0 hp-border-color-dark-80 hp-cursor-pointer">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-center hp-dashboard-feature-card-icon rounded-3 hp-bg-black-20 hp-bg-dark-80" style={{ width: "48px", height: "48px" }}>
                                            <svg className="hp-text-color-black-bg hp-text-color-dark-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M18.809 6.25h1.36c-.19-.27-.39-.52-.6-.77l-.76.77ZM18.52 4.42c-.25-.21-.5-.41-.77-.6v1.36l.77-.76ZM19.58 5.481l2.95-2.95c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.95 2.95c.38.33.73.69 1.06 1.06ZM17.752 3c0-.41-.34-.75-.75-.75-.4 0-.72.32-.74.71.52.25 1.02.53 1.49.86V3ZM21.752 7c0-.41-.34-.75-.75-.75h-.83c.33.47.62.97.86 1.49.4-.02.72-.34.72-.74ZM12.75 14.75h.3c.39 0 .7-.35.7-.78 0-.54-.15-.62-.49-.74l-.51-.18v1.7Z" fill="currentColor"></path>
                                                <path d="M21.04 7.74c-.01 0-.02.01-.04.01h-4c-.1 0-.19-.02-.29-.06a.782.782 0 0 1-.41-.41.868.868 0 0 1-.05-.28V3c0-.01.01-.02.01-.04C14.96 2.35 13.52 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.52-.35-2.96-.96-4.26Zm-7.29 4.08c.64.22 1.5.69 1.5 2.16 0 1.25-.99 2.28-2.2 2.28h-.3v.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-.25h-.08c-1.33 0-2.42-1.12-2.42-2.5 0-.42.34-.76.75-.76s.75.34.75.75c0 .55.41 1 .92 1h.08v-2.22l-1-.35c-.64-.22-1.5-.69-1.5-2.16 0-1.25.99-2.28 2.2-2.28h.3V7.5c0-.41.34-.75.75-.75s.75.34.75.75v.25h.08c1.33 0 2.42 1.12 2.42 2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.55-.41-1-.92-1h-.08v2.22l1 .35Z" fill="currentColor"></path>
                                                <path d="M10.25 10.03c0 .54.15.62.49.74l.51.18v-1.7h-.3c-.38 0-.7.35-.7.78Z" fill="currentColor"></path>
                                            </svg>
                                        </div>

                                        <div className="d-flex mt-12">
                                            <span className="h4 mb-0 d-block hp-text-color-black-bg hp-text-color-dark-0 fw-medium me-4"> Income </span>
                                            <div>
                                                <svg className="hp-text-color-success-1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path fill="currentColor" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2zm1.06 10.33c0 .41-.34.75-.75.75s-.75-.34-.75-.75V9.31l-7.72 7.72c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 010-1.06l7.72-7.72h-3.02c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4.83c.41 0 .75.34.75.75v4.83z"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <span className="hp-caption mt-4 d-block fw-normal hp-text-color-black-60"> April 2023 </span>
                                        <span className="d-block mt-12 mb-8 h3"> Rp. 500 jt </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-6">
                                <div className="card  shadow-md hp-dashboard-feature-card hp-border-color-black-0 hp-border-color-dark-80 hp-cursor-pointer">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-center hp-dashboard-feature-card-icon rounded-3 hp-bg-black-20 hp-bg-dark-80" style={{ width: "48px", height: "48px" }}>
                                            <svg className="hp-text-color-black-bg hp-text-color-dark-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M10.25 10.03c0 .54.15.62.49.74l.51.18v-1.7h-.3c-.38 0-.7.35-.7.78ZM12.75 14.75h.3c.39 0 .7-.35.7-.78 0-.54-.15-.62-.49-.74l-.51-.18v1.7Z" fill="currentColor"></path>
                                                <path d="m19.58 5.48-2.05 2.05c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.05-2.05C16.76 2.92 14.49 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.49-.92-4.76-2.42-6.52Zm-5.83 6.34c.64.23 1.5.69 1.5 2.16 0 1.25-.99 2.28-2.2 2.28h-.3v.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-.25h-.08c-1.33 0-2.42-1.12-2.42-2.5 0-.42.34-.76.75-.76s.75.34.75.75c0 .55.41 1 .92 1h.08v-2.22l-1-.35c-.64-.23-1.5-.69-1.5-2.16 0-1.25.99-2.28 2.2-2.28h.3V7.5c0-.41.34-.75.75-.75s.75.34.75.75v.25h.08c1.33 0 2.42 1.12 2.42 2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.55-.41-1-.92-1h-.08v2.22l1 .35ZM22.69 1.71a.782.782 0 0 0-.41-.41.868.868 0 0 0-.28-.05h-4c-.41 0-.75.34-.75.75s.34.75.75.75h2.19l-1.67 1.67c.38.33.73.68 1.06 1.06l1.67-1.67V6c0 .41.34.75.75.75s.75-.34.75-.75V2c0-.1-.02-.19-.06-.29Z" fill="currentColor"></path>
                                            </svg>
                                        </div>

                                        <div className="d-flex mt-12">
                                            <span className="h4 mb-0 d-block hp-text-color-black-bg hp-text-color-dark-0 fw-medium me-4"> Expenses </span>
                                            <div>
                                                <svg className="hp-text-color-danger-1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path fill="currentColor" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2zm1.34 5.53l-7.72 7.72h3.02c.41 0 .75.34.75.75s-.34.75-.75.75H8c-.41 0-.75-.34-.75-.75v-4.83c0-.41.34-.75.75-.75s.75.34.75.75v3.02l7.72-7.72c.15-.15.34-.22.53-.22s.38.07.53.22c.29.29.29.77 0 1.06z"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <span className="hp-caption mt-4 d-block fw-normal hp-text-color-black-60"> April 2023 </span>
                                        <span className="d-block mt-12 mb-8 h3"> Rp 50 jt </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-6">
                                <div className="card  shadow-md hp-dashboard-feature-card hp-border-color-black-0 hp-border-color-dark-80 hp-cursor-pointer">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-center hp-dashboard-feature-card-icon rounded-3 hp-bg-black-20 hp-bg-dark-80" style={{ width: "48px", height: "48px" }}>
                                            <svg className="hp-text-color-black-bg hp-text-color-dark-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="m11.94 2.212-2.41 5.61H7.12c-.4 0-.79.03-1.17.11l1-2.4.04-.09.06-.16c.03-.07.05-.13.08-.18 1.16-2.69 2.46-3.53 4.81-2.89ZM18.731 8.09l-.02-.01c-.6-.17-1.21-.26-1.83-.26h-6.26l2.25-5.23.03-.07c.14.05.29.12.44.17l2.21.93c1.23.51 2.09 1.04 2.62 1.68.09.12.17.23.25.36.09.14.16.28.2.43.04.09.07.17.09.26.15.51.16 1.09.02 1.74ZM18.288 9.52c-.45-.13-.92-.2-1.41-.2h-9.76c-.68 0-1.32.13-1.92.39a4.894 4.894 0 0 0-2.96 4.49v1.95c0 .24.02.47.05.71.22 3.18 1.92 4.88 5.1 5.09.23.03.46.05.71.05h7.8c3.7 0 5.65-1.76 5.84-5.26.01-.19.02-.39.02-.59V14.2a4.9 4.9 0 0 0-3.47-4.68Zm-3.79 7.23h-5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
                                            </svg>
                                        </div>

                                        <div className="d-flex mt-12">
                                            <span className="h4 mb-0 d-block hp-text-color-black-bg hp-text-color-dark-0 fw-medium me-4"> Balance </span>
                                            <div></div>
                                        </div>

                                        <span className="hp-caption mt-4 d-block fw-normal hp-text-color-black-60"> April 2023 </span>
                                        <span className="d-block mt-12 mb-8 h3"> Rp. 450 jt </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="mb-18 col-12">
                                <div className="row align-items-center justify-content-between">
                                    <div className="hp-flex-none w-auto col">
                                        <span className="d-block hp-p1-body">Traffic</span>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="hp-p1-body d-block">30 Days</span>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden col-12 mb-n24">
                                <Chart />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="hp-flex-none w-auto hp-dashboard-line px-0 col">
                <div className="hp-bg-black-40 hp-bg-dark-80 h-100 mx-24" style={{ width: "1px" }}></div>
            </div>
        </div>
    )
}