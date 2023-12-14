import NavbarAdmin from '@/components/Navbar/NavbarAdmin';
import { checkAuth } from '@/utils/auth';
import Head from 'next/head';
import router from 'next/router';
import React, { useEffect, useState } from 'react';

const InformationBannerPage = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [allowed, setAllowed] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // useEffect(() => {
    //     const checkAuthentication = async () => {
    //       const isAllowed = await checkAuth(['ADMIN']);
    //       setAllowed(isAllowed);
    
    //       if (!isAllowed) {
    //         router.push('/admin-login');
    //       }
    //     };
    //     checkAuthentication();
    // });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files ? e.target.files[0] : null;
        setImage(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('text', text);
        if (image) {
            formData.append('url_image', image);
        }

        try {    
            console.log(formData);
            const response = await fetch(`${backendUrl}/api/v1/informationBanner`, {
                credentials: 'include',
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                console.log(formData)
                setSuccessMessage('Information banner sukses dibuat!');
            } else {
                setSuccessMessage('Information banner gagal dibuat');
            }
    
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Head>
                <title>LEAD - Buat Information Banner</title>
            </Head>
            {/* <NavbarAdmin/> */}
            {allowed && <NavbarAdmin />}
            <div className="container mt-5">
                <h1>Buat Information Banner</h1>
                <h5>Isi salah satu, gambar <b>atau</b> text</h5>
                {successMessage && <p className="text-success">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="text" className="form-label">Text:</label>
                        <input type="text" id="text" value={text} onChange={handleTextChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Gambar (ratio 9:1):</label>
                        <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary">Buat</button>
                </form>
            </div>
        </>
    );
};

export default InformationBannerPage;
