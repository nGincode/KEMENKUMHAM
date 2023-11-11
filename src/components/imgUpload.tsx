/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

const ImgUpload = ({ name, src, id, empty }: any) => {
    const [profileImg, setprofileImg] = useState<any>();
    const [srcDelete, setsrcDelete] = useState(false);

    const imageHandler = (e: any) => {
        const reader: any = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setprofileImg(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const closeImageHandler = (e: any) => {
        setprofileImg(null);
        $("#" + id).val("");
    };

    const deleteImageHandler = (e: any) => {
        setsrcDelete(true);
    };

    return (
        <>
            <div className="mb-3 col-md-12">
                <div className="form-group">
                    <div
                        style={{
                            margin: "auto",
                            width: "150px",
                            height: "150px",
                            borderRadius: "5px",
                            marginTop: "1rem",
                        }}
                    >
                        {profileImg ? (
                            <>
                                <div
                                    style={{
                                        background: "white",
                                        position: "absolute",
                                        marginLeft: "135px",
                                        marginTop: "-6px",
                                        color: "red",
                                        cursor: "pointer",
                                        borderRadius: "50%",
                                        width: "25px",
                                        height: "25px",
                                        padding: "2px 7px",
                                    }}
                                    onClick={closeImageHandler}
                                    id="closeImg"
                                >
                                    x
                                </div>
                                <img
                                    src={profileImg}
                                    alt=""
                                    style={{
                                        width: "150px",
                                        height: "145px",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                {src ? (
                                    <>
                                        {!srcDelete ? (
                                            <>
                                                <div
                                                    style={{
                                                        background: "white",
                                                        position: "absolute",
                                                        marginLeft: "135px",
                                                        marginTop: "-6px",
                                                        color: "red",
                                                        cursor: "pointer",
                                                        borderRadius: "50%",
                                                        width: "25px",
                                                        height: "25px",
                                                        padding: "2px 7px",
                                                    }}
                                                    onClick={deleteImageHandler}
                                                    id="deleteImg"
                                                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>

                                                </div>
                                                <img
                                                    src={src}
                                                    alt=""
                                                    style={{
                                                        width: "150px",
                                                        height: "145px",
                                                        objectFit: "cover",
                                                        borderRadius: "5px",
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    style={{
                                                        width: "150px",
                                                        height: "145px",
                                                        objectFit: "cover",
                                                        background:
                                                            "rgb(221, 221, 221)",
                                                        borderRadius: "5px",
                                                        display: "table-cell",
                                                        verticalAlign: "middle",
                                                        textAlign: "center",
                                                        padding: "5px"
                                                    }}
                                                >
                                                    Save to delete image
                                                </div>
                                                <input
                                                    type="hidden"
                                                    name="imgDel"
                                                    value="1"
                                                />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {empty ? (
                                            <div
                                                style={{
                                                    width: "150px",
                                                    height: "145px",
                                                    objectFit: "cover",
                                                    background:
                                                        "rgb(221, 221, 221)",
                                                    borderRadius: "5px",
                                                    display: "table-cell",
                                                    verticalAlign: "middle",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#fff",
                                                        fontSize: "xxx-large",
                                                        fontWeight: "bolder",
                                                    }}
                                                >
                                                    {empty.substring(0, 2)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    width: "150px",
                                                    height: "145px",
                                                    objectFit: "cover",
                                                    background:
                                                        "rgb(221, 221, 221)",
                                                    borderRadius: "5px",
                                                }}
                                            ></div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        name={name}
                        id={id}
                        onChange={imageHandler}
                        style={{ display: "none" }}
                    />
                    <div
                        style={{
                            width: "100%",
                            marginTop: "-1rem",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <label
                            htmlFor={id}
                            style={{
                                cursor: "pointer",
                            }}
                            className="badge badge-secondary"
                        >
                            Choose your image
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImgUpload;