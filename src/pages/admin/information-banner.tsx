import NavbarAdmin from '@/components/Navbar/NavbarAdmin';
import { checkAuth } from '@/utils/auth';
import Head from 'next/head';
import router from 'next/router';
import React, { useEffect, useState } from 'react';

const InformationBannerPage = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [url_picture, setUrlPicture] = useState('');
    const [allowed, setAllowed] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const checkAuthentication = async () => {
          const isAllowed = await checkAuth(['SUPERADMIN']);
          setAllowed(isAllowed);
    
          if (!isAllowed) {
            router.push('/admin-login');
          }
        };
        checkAuthentication();
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files ? e.target.files[0] : null;
        setImage(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {    
            const response = await fetch(`${backendUrl}/api/v1/informationBanner/1`, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text, url_picture}),
            });
    
            if (response.ok) {
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
                        <input type="file" id="image" accept=".jpg, .png, .jpeg" onChange={handleImageChange} className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary">Buat</button>
                </form>
            </div>
        </>
    );
};

export default InformationBannerPage;
