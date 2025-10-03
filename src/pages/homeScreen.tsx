/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState, Suspense } from "react"
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import axios from "axios";
const url = process.env.URL;

import Html5QrcodePlugin from "../components/html5QrcodePlugin"
import { Button } from "@material-tailwind/react";
import Link from "next/link";

export default function Index({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState<("create" | "edit" | "delete")[]>([]);
    const [onsliderData, setsliderData] = useState([]);
    const [jadwal, setJadwal] = useState([
        {
            id: 1,
            menu: "kunjungan",
            label: "Pidum",
            day: ["Monday", "Wednesday", "Saturday"],
            time_start: "00:00:00",
            time_end: "23:59:00",
        },
        {
            id: 2,
            menu: "kunjungan",
            label: "Narkoba",
            day: ["Tuesday", "Thursday", "Saturday"],
            time_start: "00:00:00",
            time_end: "23:59:00",
        },
        {
            id: 3,
            menu: "kunjungan",
            label: "Tipikor",
            day: ["Tuesday", "Thursday", "Saturday"],
            time_start: "00:00:00",
            time_end: "23:59:00",
        },
        {
            id: 4,
            menu: "kunjungan_kuasa_hukum",
            label: "",
            day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            time_start: "00:00:00",
            time_end: "23:59:00",
        },
        {
            id: 5,
            menu: "titipan",
            label: "",
            day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            time_start: "12:00:00",
            time_end: "17:59:00",
        },
    ]);
    const Subject = "Home Screen";

    useEffect(() => {
        (document as any).title = Subject;
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            return val.data.find((vall: any) => {
                if (vall.label == Subject) {
                    return vall;
                }
            })
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? [])
    }, [userData])

    useEffect(() => {
        const apiJson = async () => {
            try {
                axios.post('api/slider', { get: true })
                    .then((res: any) => {
                        if (res?.data?.error) {
                            return toast.error(res.data.error);
                        }

                        setsliderData(res.data)
                    })


                axios.get('api/jadwal')
                    .then((res: any) => {
                        if (res?.data?.error) {
                            return toast.error(res.data.error);
                        }

                        setJadwal(res.data.data.map((item: any) => ({ ...item, day: JSON.parse(item.day) })))

                    })

            } catch (error: any) {
                return toast.error(error?.response?.data?.message || 'Gagal mengambil data');
            }

        }
        apiJson()

    }, []);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("gambar", file);

        try {
            // Upload gambar
            const response = await axios.post("/api/slider", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Refresh slider data
            const res = await axios.post("/api/slider", { get: true });
            setsliderData(res.data);

            // Notifikasi
            if (response.data.message) {
                toast.success("Gambar berhasil disimpan");
            } else {
                toast.error(response.data.error || "Gagal menyimpan gambar");
            }

        } catch (error) {
            console.error("Error uploading files:", error);
            toast.error("Terjadi kesalahan saat menyimpan slider");
        } finally {
            // Reset input file supaya bisa pilih ulang file yang sama
            event.target.value = "";
        }
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



    const allDays = [
        { en: "Monday", id: "Senin" },
        { en: "Tuesday", id: "Selasa" },
        { en: "Wednesday", id: "Rabu" },
        { en: "Thursday", id: "Kamis" },
        { en: "Friday", id: "Jumat" },
        { en: "Saturday", id: "Sabtu" },
        { en: "Sunday", id: "Minggu" },
    ];


    const handleDayChange = (id: number, day: string) => {
        setJadwal((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        day: item.day.includes(day)
                            ? item.day.filter((d) => d !== day)
                            : [...item.day, day],
                    }
                    : item
            )
        );
    };

    const handleTimeChange = (id: number, field: string, value: string) => {
        setJadwal((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSubmitJadwal = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/jadwal", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jadwal),
            });

            if (!res.ok) throw new Error("Gagal simpan data");

            toast.success("Jadwal berhasil disimpan!");
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan saat menyimpan jadwal");
        }
    };

    const groupByMenu = jadwal.reduce((acc: any, item) => {
        if (!acc[item.menu]) acc[item.menu] = [];
        acc[item.menu].push(item);
        return acc;
    }, {});

    return (
        <div className="row mb-32 g-32">
            {/* Header */}
            <div className="col-12 mb-6">
                <h1 className="text-4xl font-bold text-gray-800">{Subject}</h1>
            </div>

            {/* Breadcrumb */}
            <div className="col-12 mb-6">
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-800">{Subject}</span>
                </div>
            </div>

            {/* SLIDER HOME */}
            <div className="w-full">
                <form className="bg-white shadow-lg rounded-2xl  p-14 mb-6 space-y-8 transition duration-300 hover:shadow-xl">

                    {/* Judul */}
                    <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Slider Home
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6 mt-2"></div>
                    </h2>

                    {/* Grid Gambar */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {onsliderData?.map((imgSrc, i) => (
                            <div
                                key={i}
                                className="relative rounded-xl overflow-hidden shadow-md group 
                     transition duration-300 hover:shadow-lg hover:ring-2 hover:ring-blue-400"
                            >
                                {/* Gambar */}
                                <img
                                    src={imgSrc}
                                    alt={`gambar${i}`}
                                    className="w-full h-48 object-cover transition duration-500 ease-in-out transform group-hover:scale-110"
                                />

                                {/* Tombol Hapus */}
                                {pagePermission.includes("delete") && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(imgSrc)}
                                        className="absolute top-2 right-2 bg-red-500 text-white 
                         w-8 h-8 flex items-center justify-center 
                         rounded-full shadow-md opacity-90 
                         transition duration-300 hover:bg-red-600 hover:scale-110"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tombol Upload */}
                    {pagePermission.includes("create") && (
                        <div className="flex justify-center mt-8">
                            <label
                                className="cursor-pointer flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 
                     text-white px-12 py-3 rounded-full shadow-lg transition duration-300 
                     hover:scale-105 hover:shadow-xl active:scale-95"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="font-medium">Pilih & Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="gambar"
                                    onChange={handleUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </form>
            </div>








            {/* JADWAL */}
            <div className="w-full">
                <form
                    onSubmit={handleSubmitJadwal}
                    className="space-y-10 bg-white p-14 rounded-2xl shadow-lg transition duration-300 hover:shadow-xl"
                >
                    {/* Judul Utama */}
                    <h2 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600   pb-4">
                        Edit Jadwal Kunjungan
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6 mt-2"></div>
                    </h2>

                    {/* Group per Menu */}
                    {Object.keys(groupByMenu).map((menu) => (
                        <div key={menu} className="space-y-6">
                            {/* Judul Menu */}
                            <h3 className="text-lg text-center font-bold text-blue-700 uppercase bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg shadow-sm">
                                {menu.replaceAll("_", " ")}
                            </h3>

                            {/* Card Jadwal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupByMenu[menu].map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Label opsional */}
                                        {item.label && (
                                            <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">
                                                {item.label}
                                            </h4>
                                        )}

                                        {/* Hari */}
                                        <div className="mb-5">
                                            <p className="text-sm font-medium text-gray-600 mb-2">
                                                Hari Aktif:
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {allDays.map((day) => (
                                                    <label
                                                        key={day.en}
                                                        className="flex items-center gap-2 text-sm bg-gray-50 px-2 py-1 rounded-md hover:bg-blue-50 transition"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="accent-blue-600"
                                                            checked={item.day.includes(day.en)}
                                                            onChange={() => handleDayChange(item.id, day.en)}
                                                        />
                                                        <span>{day.id}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Jam */}
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                                    Jam Mulai
                                                </label>
                                                <input
                                                    type="time"
                                                    value={item.time_start}
                                                    onChange={(e) =>
                                                        handleTimeChange(item.id, "time_start", e.target.value)
                                                    }
                                                    className="border rounded-lg p-2 w-full focus:ring focus:ring-blue-300 focus:border-blue-400"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                                    Jam Selesai
                                                </label>
                                                <input
                                                    type="time"
                                                    value={item.time_end}
                                                    onChange={(e) =>
                                                        handleTimeChange(item.id, "time_end", e.target.value)
                                                    }
                                                    className="border rounded-lg p-2 w-full focus:ring focus:ring-blue-300 focus:border-blue-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Tombol Simpan */}
                    {pagePermission.includes("edit") && (
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
                            >
                                Simpan Jadwal
                            </button>
                        </div>
                    )}
                </form>
            </div>

        </div>

    )
}
