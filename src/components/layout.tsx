/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect } from "react"
import { useRouter } from 'next/router'
import Link from "next/link";

import ReactSelect from "./reactSelect";
import AccessData from "./accessData";

export default function layout({ children = null, logOut, userData }: any) {
    const router = useRouter();

    useEffect(() => {
        require("./../../public/app-assets/js/plugin/swiper-bundle.min.js");
        require("./../../public/app-assets/js/plugin/jquery.mask.min.js");

        require("./../../public/app-assets/js/layouts/sider.js");
        require("./../../public/app-assets/js/components/input-number.js");

        require("./../../public/app-assets/js/base/index.js");

        require("./../../public/assets/js/main.js");
    }, []);


    const Menu = () => {
        return <>
            {
                AccessData('menu').map((val: any, i: number) => {
                    let PermissionLabel = userData.permission?.data?.find((find: any) => val.label == find.label.toUpperCase());
                    if (PermissionLabel?.check)
                        return (
                            <li key={i} style={{ marginTop: '20px' }}>
                                <div className="menu-title">{val.label}</div>
                                <ul>
                                    {val.option.map((vall: any, ii: number) => {
                                        let OptionTrue = PermissionLabel?.data?.find((find: any) => find.label == vall.label)?.check;
                                        if (PermissionLabel?.data?.find((find: any) => find.label == vall.label)?.checklist?.find((find: any) => find == "view") || OptionTrue)
                                            return (
                                                <span key={ii}>
                                                    {vall.dropdown ?
                                                        <li>
                                                            <Link href="" className={vall.option.find((el: any) => el.link === router.asPath) ? "submenu-item  active arrow-active" : "submenu-item "}>
                                                                <span>
                                                                    <span className="submenu-item-icon">
                                                                        {vall.icon}
                                                                    </span>
                                                                    <span>{vall.label}</span>
                                                                </span>
                                                                <div className="menu-arrow"></div>
                                                            </Link>

                                                            <ul className={vall.option.find((el: any) => el.link === router.asPath) ? "submenu-children active" : "submenu-children"} data-level={1} style={vall.option.find((el: any) => el.link === router.asPath) ? { display: "block" } : {}}>
                                                                {vall.option.map((valll: any, iii: number) => {
                                                                    if (PermissionLabel?.data?.find((find: any) => find.label == vall.label).data.find((fd: any) => fd.link == valll.link)?.checklist?.find((find: any) => find == "view"))
                                                                        return (
                                                                            <li key={iii}>
                                                                                <Link href={valll.link} className={router.asPath === valll.link ? "active" : ""}>
                                                                                    <div className="flex">
                                                                                        <span className="submenu-item-icon">
                                                                                            {valll.icon}
                                                                                        </span>
                                                                                        <span className="ml-1 mt-0.5">{valll.label}</span>
                                                                                    </div>
                                                                                </Link>
                                                                            </li>)
                                                                })}
                                                            </ul>
                                                        </li>
                                                        :
                                                        <li>
                                                            <Link href={vall.link} className={`${(router.asPath === vall.link ? "active" : "")}`}>
                                                                <div className="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="" data-bs-original-title={vall.label} aria-label={vall.label}></div>
                                                                <span>
                                                                    <span className="submenu-item-icon">
                                                                        {vall.icon}
                                                                    </span>
                                                                    <span>{vall.label}</span>
                                                                </span>
                                                            </Link>
                                                        </li>
                                                    }
                                                </span>)
                                    })}
                                </ul>
                            </li>)
                })
            }
        </>
    }

    $(function () {
        $("#header-search").keyup(function () {
            $(".autocomplete-suggestions").css(
                "width",
                $("header .hp-header-search").width() + "px"
            );
        });

        ($("#header-search") as any).autocomplete({
            lookup: [
                {
                    value: "Dashboard",
                    url: "/",
                },
                {
                    value: "Stock",
                    url: "/stock",
                },
                {
                    value: "Permission",
                    url: "/permission",
                },
                {
                    value: "Users",
                    url: "/users",
                },
            ],
            onSelect: function (event: any) {
                router.push(event.url);
            },
        });
    });

    const searchActive = () => {
        $("header .hp-header-text-info").toggleClass("d-none");
        $("header .hp-header-search").toggleClass("d-none");
        $(".hp-header-search-button")
            .find("button .hp-header-search-button-icon-1")
            .toggleClass("d-none");
        $(".hp-header-search-button")
            .find("button .hp-header-search-button-icon-2")
            .toggleClass("d-none");

        $("header .hp-horizontal-menu").toggleClass("search-active");

        setTimeout(() => {
            $("header .hp-header-search").toggleClass("active");

            if (!$("header .hp-header-search").hasClass("active")) {
                $("#header-search").val("");
            }

            setTimeout(() => {
                $("#header-search").focus();
            }, 300);
        }, 100);
    }

    return (
        <>
            <main className="hp-bg-color-dark-90 d-flex min-vh-100 bg-gradient-to-r from-gray-100 from-5% to-indigo-300 to-100%">
                <div className=" hp-bg-color-black-20delete hp-sidebar hp-bg-color-dark-90 border-end border-black-40 hp-border-color-dark-80">
                    <div className="hp-sidebar-container">
                        <div className="hp-sidebar-header-menu">
                            <div className="row justify-content-between align-items-center mx-0">
                                <div className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-visible">
                                    <div className="hp-cursor-pointer">
                                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                                            <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div className="w-auto px-0">
                                    <div className="hp-header-logo d-flex align-items-center">
                                        <div className="position-relative font-bold text-center">
                                            <img className="hp-logo hp-sidebar-visible hp-dark-none" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-visible hp-dark-block" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-none  h-14" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-block  h-14" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-hidden hp-dir-block hp-dark-none  h-14" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-hidden hp-dir-block hp-dark-block h-14" src="/img/logo.png" alt="logo" />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-hidden">
                                    <div className="hp-cursor-pointer mb-4">
                                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                                            <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <ul style={{ marginTop: "10px" }}>
                                {Menu()}

                            </ul>
                        </div>

                        <div className="row justify-content-between align-items-center hp-sidebar-footer mx-0 hp-bg-color-dark-90">
                            <div className="divider border-black-40 hp-border-color-dark-70 hp-sidebar-hidden mt-0 px-0"></div>

                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="w-auto px-0">
                                        {userData.img ?
                                            <div className="avatar-item bg-primary-4 d-flex align-items-center justify-content-center rounded-circle" style={{ width: "48px", height: "48px" }}>
                                                <img src={userData.img} height="100%" className="hp-img-cover object-cover rounded-full w-12 h-12" />
                                            </div>
                                            :
                                            <div className="avatar-item d-flex align-items-center justify-content-center avatar-lg hp-bg-primary-4 hp-text-color-primary-1 rounded-circle">
                                                <i className="iconly-Curved-User"></i>
                                            </div>}
                                    </div>

                                    <div className="w-auto ms-8 px-0 hp-sidebar-hidden mt-4">
                                        <span className="d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body lh-1">{userData.fullName ?? userData.username}</span>
                                        <Link href="/profile" className="hp-badge-text fw-normal hp-text-color-dark-30">View Profile</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col hp-flex-none w-auto px-0 hp-sidebar-hidden">
                                <Link href="/profile">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="remix-icon hp-text-color-black-100 hp-text-color-dark-0" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                            <path d="M3.34 17a10.018 10.018 0 0 1-.978-2.326 3 3 0 0 0 .002-5.347A9.99 9.99 0 0 1 4.865 4.99a3 3 0 0 0 4.631-2.674 9.99 9.99 0 0 1 5.007.002 3 3 0 0 0 4.632 2.672c.579.59 1.093 1.261 1.525 2.01.433.749.757 1.53.978 2.326a3 3 0 0 0-.002 5.347 9.99 9.99 0 0 1-2.501 4.337 3 3 0 0 0-4.631 2.674 9.99 9.99 0 0 1-5.007-.002 3 3 0 0 0-4.632-2.672A10.018 10.018 0 0 1 3.34 17zm5.66.196a4.993 4.993 0 0 1 2.25 2.77c.499.047 1 .048 1.499.001A4.993 4.993 0 0 1 15 17.197a4.993 4.993 0 0 1 3.525-.565c.29-.408.54-.843.748-1.298A4.993 4.993 0 0 1 18 12c0-1.26.47-2.437 1.273-3.334a8.126 8.126 0 0 0-.75-1.298A4.993 4.993 0 0 1 15 6.804a4.993 4.993 0 0 1-2.25-2.77c-.499-.047-1-.048-1.499-.001A4.993 4.993 0 0 1 9 6.803a4.993 4.993 0 0 1-3.525.565 7.99 7.99 0 0 0-.748 1.298A4.993 4.993 0 0 1 6 12c0 1.26-.47 2.437-1.273 3.334a8.126 8.126 0 0 0 .75 1.298A4.993 4.993 0 0 1 9 17.196zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                        </g>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hp-main-layout">
                    <header>
                        <div className="row w-100 m-0">
                            <div className="col px-0">
                                <div className="row w-100 align-items-center justify-content-between position-relative">
                                    <div className="col w-auto hp-flex-none hp-mobile-sidebar-button me-24 px-0" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu">
                                        <button type="button" className="btn btn-text btn-icon-only">
                                            <i className="ri-menu-fill hp-text-color-black-80 hp-text-color-dark-30 lh-1" style={{ fontSize: "24px" }}></i>
                                        </button>
                                    </div>

                                    <div className="hp-header-text-info col col-lg-14 col-xl-16 hp-header-start-text d-flex align-items-center hp-horizontal-none">


                                    </div>

                                    <div className="hp-header-search d-none col">
                                        <input type="text" className="form-control" placeholder="Search..." id="header-search" autoComplete="off" />
                                    </div>

                                    <div className="col hp-flex-none w-auto pe-0">
                                        <div className="row align-items-center justify-content-end">
                                            <div className="w-auto px-0">
                                                <div onClick={searchActive} className="d-flex align-items-center me-4 hp-header-search-button">
                                                    <button type="button" className="btn btn-icon-only bg-transparent border-0 hp-hover-bg-black-10 hp-hover-bg-dark-100 hp-transition d-flex align-items-center justify-content-center" style={{ height: "40px" }}>
                                                        <svg className="hp-header-search-button-icon-1 hp-text-color-black-80 hp-text-color-dark-30" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                        <i className="d-none hp-header-search-button-icon-2 ri-close-line hp-text-color-black-60" style={{ fontSize: "24px" }}></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="hover-dropdown-fade w-auto px-0 ms-6 position-relative">
                                                <div className="hp-cursor-pointer rounded-4 border hp-border-color-dark-80">
                                                    <div className="rounded-3 overflow-hidden m-4 d-flex">
                                                        {userData.img ?
                                                            <div className="avatar-item hp-bg-info-4 d-flex" style={{ width: "32px", height: "32px" }}>
                                                                <img src={userData.img} className="object-cover rounded-md w-10 h-10" />
                                                            </div> :
                                                            <div className="avatar-item d-flex align-items-center justify-content-center hp-bg-primary-4 hp-text-color-primary-1 rounded">
                                                                <i className="iconly-Curved-User"></i>
                                                            </div>}
                                                    </div>
                                                </div>

                                                <div className="hp-header-profile-menu dropdown-fade position-absolute pt-18" style={{ top: "100%", width: "260px" }}>
                                                    <div className="rounded hp-bg-black-0 hp-bg-dark-100 px-18 py-24">
                                                        <span className="d-block h5 hp-text-color-black-100 hp-text-color-dark-0 mb-16">Profile Settings</span>
                                                        <div className="divider mt-12 mb-18"></div>

                                                        <div className="row">
                                                            <div className="col-12">
                                                                <Link className="hp-p1-body fw-medium" href="/profile">Account Settings</Link>
                                                            </div>

                                                            <div className="col-12 mt-24">
                                                                <a className="hp-p1-body fw-medium cursor-pointer text-red-900" onClick={() => { logOut() }}>Logout</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="offcanvas offcanvas-start hp-mobile-sidebar bg-black-20 hp-bg-dark-90" tabIndex={-1} id="mobileMenu" aria-labelledby="mobileMenuLabel" style={{ width: "256px" }}>
                        <div className="offcanvas-header justify-content-between align-items-center ms-16 me-8 mt-16 p-0">
                            <div className="w-auto px-0">
                                <div className="hp-header-logo d-flex align-items-center">
                                    <div className="position-relative font-bold text-center">
                                        <img className="hp-logo" src="/img/logo.png" alt="logo" />

                                    </div>
                                </div>
                            </div>

                            <div id="menuClose" className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-hidden" data-bs-dismiss="offcanvas" aria-label="Close">
                                <button type="button" className="btn btn-text btn-icon-only bg-transparent">
                                    <i className="ri-close-fill lh-1 hp-text-color-black-80" style={{ fontSize: "24px" }}></i>
                                </button>
                            </div>
                        </div>

                        <div className="hp-sidebar hp-bg-color-black-20 hp-bg-color-dark-90 border-end border-black-40 hp-border-color-dark-80">
                            <div className="hp-sidebar-container">
                                <div className="hp-sidebar-header-menu">

                                    <div className="row justify-content-between align-items-center mx-0">
                                        <div className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-visible">
                                            <div className="hp-cursor-pointer">
                                                <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                                                    <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="w-auto px-0">
                                            <div className="hp-header-logo d-flex align-items-center">
                                                <div className="position-relative font-bold text-center">
                                                    <img className="hp-logo hp-sidebar-visible hp-dark-none" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-visible hp-dark-block" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-none  h-14" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-block  h-14" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-hidden hp-dir-block hp-dark-none  h-14" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-hidden hp-dir-block hp-dark-block h-14" src="/img/logo.png" alt="logo" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-hidden">
                                            <div className="hp-cursor-pointer mb-4">
                                                <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                                                    <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <ul>
                                        {Menu()}
                                    </ul>
                                </div>
                                <div className="row justify-content-between align-items-center hp-sidebar-footer mx-0 hp-bg-color-dark-90">
                                    <div className="divider border-black-40 hp-border-color-dark-70 hp-sidebar-hidden mt-0 px-0"></div>

                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="w-auto px-0">
                                                {userData.img ?
                                                    <div className="avatar-item bg-primary-4 d-flex align-items-center justify-content-center rounded-circle" style={{ width: "48px", height: "48px" }}>
                                                        <img src={userData.img} height="100%" className="hp-img-cover object-cover rounded-full w-12 h-12" />
                                                    </div>
                                                    :
                                                    <div className="avatar-item d-flex align-items-center justify-content-center avatar-lg hp-bg-primary-4 hp-text-color-primary-1 rounded-circle">
                                                        <i className="iconly-Curved-User"></i>
                                                    </div>}
                                            </div>

                                            <div className="w-auto ms-8 px-0 hp-sidebar-hidden mt-4">
                                                <span className="d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body lh-1">{userData.fullName ?? userData.username}</span>
                                                <Link onClick={() => {
                                                    ($('#menuClose') as any).trigger("click");
                                                }} href="/profile" className="hp-badge-text fw-normal hp-text-color-dark-30">View Profile</Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col hp-flex-none w-auto px-0 hp-sidebar-hidden">
                                        <Link onClick={() => {
                                            ($('#menuClose') as any).trigger("click");
                                        }} href="/profile">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="remix-icon hp-text-color-black-100 hp-text-color-dark-0" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                                                <g>
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path d="M3.34 17a10.018 10.018 0 0 1-.978-2.326 3 3 0 0 0 .002-5.347A9.99 9.99 0 0 1 4.865 4.99a3 3 0 0 0 4.631-2.674 9.99 9.99 0 0 1 5.007.002 3 3 0 0 0 4.632 2.672c.579.59 1.093 1.261 1.525 2.01.433.749.757 1.53.978 2.326a3 3 0 0 0-.002 5.347 9.99 9.99 0 0 1-2.501 4.337 3 3 0 0 0-4.631 2.674 9.99 9.99 0 0 1-5.007-.002 3 3 0 0 0-4.632-2.672A10.018 10.018 0 0 1 3.34 17zm5.66.196a4.993 4.993 0 0 1 2.25 2.77c.499.047 1 .048 1.499.001A4.993 4.993 0 0 1 15 17.197a4.993 4.993 0 0 1 3.525-.565c.29-.408.54-.843.748-1.298A4.993 4.993 0 0 1 18 12c0-1.26.47-2.437 1.273-3.334a8.126 8.126 0 0 0-.75-1.298A4.993 4.993 0 0 1 15 6.804a4.993 4.993 0 0 1-2.25-2.77c-.499-.047-1-.048-1.499-.001A4.993 4.993 0 0 1 9 6.803a4.993 4.993 0 0 1-3.525.565 7.99 7.99 0 0 0-.748 1.298A4.993 4.993 0 0 1 6 12c0 1.26-.47 2.437-1.273 3.334a8.126 8.126 0 0 0 .75 1.298A4.993 4.993 0 0 1 9 17.196zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                                </g>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hp-main-layout-content">
                        {children}
                    </div>
                </div>
            </main >

            <div className="scroll-to-top">
                <button type="button" className="btn btn-primary btn-icon-only rounded-circle hp-primary-shadow">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"></path>
                        </g>
                    </svg>
                </button>
            </div>

        </>
    )

}