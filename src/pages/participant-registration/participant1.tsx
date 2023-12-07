import { Console } from 'console';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { FormEvent } from 'react';

export default function Home() {
    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const registration = new FormData(e.currentTarget);
        const registrationObject: Record<string, string> = {};
        registration.forEach((value, key) => {
            registrationObject[key] = value.toString();
        });
        router.push({
        pathname: '/summary-registration',
        query: registrationObject,
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
                        <label htmlFor="namaPeserta1" className="form-label"><h5>Nama Peserta</h5></label>
                        <input type="text" className="form-control" name="namaPeserta1" placeholder="Nama Peserta 1"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailPeserta1" className="form-label"><h5>Email Peserta</h5></label>
                        <input type="text" className="form-control" name="emailPeserta1" placeholder="Email Peserta 1"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pendidikanPeserta1" className="form-label"><h5>Pendidikan Terakhir Peserta</h5></label>
                        <select className="form-select" name="pendidikanPeserta1">
                            <option selected>Pilih</option>
                            <option value="sd">SD/Sederajat</option>
                            <option value="smp">SMP/Sederajat</option>
                            <option value="sma">SMA/SMK/Sederajat</option>
                            <option value="d3">D3</option>
                            <option value="notS1">Tidak selesai D1</option>
                            <option value="s1">D4/S1</option>
                            <option value="s2">S2</option>
                            <option value="s3">S3</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="whatsappPeserta1" className="form-label"><h5>Nomor Whatsapp</h5></label>
                        <input type="number" className="form-control" name="whatsappPeserta1" placeholder="cth : 6281234567890"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="alasanPeserta1" className="form-label"><h5>Alasan mengikuti LEAD</h5></label>
                        <textarea className="form-control" name="alasanPeserta1" style={{ width: '550px', height: '100px' }}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ktpPeserta1" className="form-label"><h5>Unggah Kartu Tanda Penduduk (KTP)</h5></label>
                        <input type="url" className="form-control" name="ktpPeserta1" placeholder="Link Kartu Tanda Penduduk"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cvPeserta1" className="form-label"><h5>Unggah Curriculum Vitae</h5></label>
                        <input type="url" className="form-control" name="cvPeserta1" placeholder="Link Curriculum Vitae"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Tambahkan</button>
                </div>
            </form>
        </>
    )
}