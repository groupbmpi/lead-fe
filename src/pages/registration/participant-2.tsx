import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router';
import { useRegistration } from '@/contexts/RegistrationContext';

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [isFormFilled, setIsFormFilled] = useState(false);
    const { userData, setUserData } = useRegistration();

    useEffect(() => {
        if (!userData || Object.keys(userData).length === 0) {
            router.push('/registration/instance');
        }
    }, [userData, router]);
      
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const participantRegistrationForm = new FormData(e.currentTarget);
        const participantRegistrationData: Record<string, string> = {};

        participantRegistrationForm.forEach((value, key) => {
            participantRegistrationData[key] = value.toString();
        });
        setFormData(participantRegistrationData);
        setIsFormFilled(true);
        setUserData((prevUserData) => ({
            ...prevUserData,
            ...participantRegistrationData,
        }));

        router.push({
        pathname: '/registration/summary',
        query: participantRegistrationData,
        });
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Head>
                <title>Pendaftaran Peserta 1</title>
                </Head>
                <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
                    <h1>Profil Peserta 1</h1>
                    <div className="mb-3">
                        <label htmlFor="namaPeserta2" className="form-label"><h5>Nama Peserta</h5></label>
                        <input value={userData.namaPeserta2} onChange={(e) => setUserData({ ...userData, namaPeserta2: e.target.value })} type="text" className="form-control" name="namaPeserta2" placeholder="Nama Peserta 1" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailPeserta2" className="form-label"><h5>Email Peserta</h5></label>
                        <input value={userData.emailPeserta2} onChange={(e) => setUserData({ ...userData, emailPeserta2: e.target.value })} type="text" className="form-control" name="emailPeserta2" placeholder="Email Peserta 1" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pendidikanPeserta2" className="form-label"><h5>Pendidikan Terakhir Peserta</h5></label>
                        <select value={userData.pendidikanPeserta2} onChange={(e) => setUserData({ ...userData, pendidikanPeserta2: e.target.value })} className="form-select" name="pendidikanPeserta2" required>
                        <option selected>Pilih</option>
                            <option value="SD/Sederajat">SD/Sederajat</option>
                            <option value="SMP/Sederajat">SMP/Sederajat</option>
                            <option value="SMA/SMK/Sederajat">SMA/SMK/Sederajat</option>
                            <option value="D3">D3</option>
                            <option value="Tidak selesai S1">Tidak selesai S1</option>
                            <option value="D4/S1">D4/S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="whatsappPeserta2" className="form-label"><h5>Nomor Whatsapp</h5></label>
                        <input value={userData.whatsappPeserta2} onChange={(e) => setUserData({ ...userData, whatsappPeserta2: e.target.value })} type="number" className="form-control" name="whatsappPeserta2" placeholder="cth : 6281234567890" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="alasanPeserta2" className="form-label"><h5>Alasan mengikuti LEAD</h5></label>
                        <textarea value={userData.alasanPeserta2} onChange={(e) => setUserData({ ...userData, alasanPeserta2: e.target.value })} className="form-control" name="alasanPeserta2" style={{ width: '550px', height: '100px' }} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ktpPeserta2" className="form-label"><h5>Unggah Kartu Tanda Penduduk (KTP)</h5></label>
                        <input value={userData.ktpPeserta2} onChange={(e) => setUserData({ ...userData, ktpPeserta2: e.target.value })} type="url" className="form-control" name="ktpPeserta2" placeholder="Link Kartu Tanda Penduduk" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cvPeserta2" className="form-label"><h5>Unggah Curriculum Vitae</h5></label>
                        <input value={userData.cvPeserta2} onChange={(e) => setUserData({ ...userData, cvPeserta2: e.target.value })} type="url" className="form-control" name="cvPeserta2" placeholder="Link Curriculum Vitae" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Tambahkan</button>
                </div>
            </form>
        </>
    )
}