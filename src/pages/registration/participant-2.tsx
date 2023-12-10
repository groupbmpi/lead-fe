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
                        <label htmlFor="namaPeserta2" className="form-label">Nama Peserta</label>
                        <input value={userData.namaPeserta2} onChange={(e) => setUserData({ ...userData, namaPeserta2: e.target.value })} type="text" className="form-control" name="namaPeserta2" placeholder="Nama Peserta 1" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailPeserta2" className="form-label">Email Peserta</label>
                        <input value={userData.emailPeserta2} onChange={(e) => setUserData({ ...userData, emailPeserta2: e.target.value })} type="email" className="form-control" name="emailPeserta2" placeholder="cth: a@gmail.com" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="posisiPeserta2" className="form-label">Posisi Peserta dalam Instansi</label>
                        <select value={userData.posisiPeserta2} onChange={(e) => setUserData({ ...userData, posisiPeserta2: e.target.value })} className="form-select" name="posisiPeserta2" required >
                            <option disabled selected>Pilih</option>
                            <option value="Ketua Instansi">Ketua Instansi</option>
                            <option value="Wakil Ketua Instansi">Wakil Ketua Instansi</option>
                            <option value="Bendahara">Bendahara</option>
                            <option value="Sekretaris">Sekretaris</option>
                            <option value="Ketua Divisi Program">Ketua Divisi Program</option>
                            <option value="Anggota">Anggota</option>
                            <option value="Ketua Divisi Riset dan Komunikasi">Ketua Divisi Riset dan Komunikasi</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pendidikanPeserta2" className="form-label">Pendidikan Terakhir Peserta</label>
                        <select value={userData.pendidikanPeserta2} onChange={(e) => setUserData({ ...userData, pendidikanPeserta2: e.target.value })} className="form-select" name="pendidikanPeserta2" required>
                        <option disabled selected>Pilih</option>
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
                        <label htmlFor="jurusanPeserta2" className="form-label">Jurusan atau Latar Belakang Pendidikan Terakhir Peserta</label>
                        <p>Contoh Jawaban: Ilmu Kesejahteraan Sosial</p>
                        <input value={userData.jurusanPeserta2} onChange={(e) => setUserData({ ...userData, jurusanPeserta2: e.target.value })} type="text" className="form-control" name="jurusanPeserta2" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fokusIsuPeserta2" className="form-label">Fokus Bidang atau Isu yang Digeluti Peserta</label>
                        <p>Contoh Jawaban: Pendidikan Anak Prasejahtera</p>
                        <input value={userData.fokusIsuPeserta2} onChange={(e) => setUserData({ ...userData, fokusIsuPeserta2: e.target.value })} type="text" className="form-control" name="fokusIsuPeserta2" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="whatsappPeserta2" className="form-label">Nomor Whatsapp</label>
                        <input value={userData.whatsappPeserta2} onChange={(e) => setUserData({ ...userData, whatsappPeserta2: e.target.value })} type="tel" className="form-control" name="whatsappPeserta2" placeholder="cth : 6281234567890" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="alasanPeserta2" className="form-label">Alasan mengikuti LEAD</label>
                        <textarea value={userData.alasanPeserta2} onChange={(e) => setUserData({ ...userData, alasanPeserta2: e.target.value })} className="form-control" name="alasanPeserta2" style={{ width: '550px', height: '100px' }} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ktpPeserta2" className="form-label">Unggah Kartu Tanda Penduduk (KTP)</label>
                        <input value={userData.ktpPeserta2} onChange={(e) => setUserData({ ...userData, ktpPeserta2: e.target.value })} type="url" className="form-control" name="ktpPeserta2" placeholder="Link Kartu Tanda Penduduk" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cvPeserta2" className="form-label">Unggah Curriculum Vitae</label>
                        <input value={userData.cvPeserta2} onChange={(e) => setUserData({ ...userData, cvPeserta2: e.target.value })} type="url" className="form-control" name="cvPeserta2" placeholder="Link Curriculum Vitae" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="miniTrainingPeserta2" className="form-label">Apakah Anda bersedia mengikuti agenda <b>Mini Training LEAD Indonesia</b> yang akan dilakukan secara <b>online selama 5 hari?</b></label>
                        <p>Perlu diingat, bahwa Anda harus mengosongkan aktivitas lainnya selama 5 hari ini untuk dapat mengikuti kegiatan ini secara optimal, dimana setiap harinya terdapat mini practice yang harus dikerjakan dan dikumpulkan.</p>
                        <select value={userData.miniTrainingPeserta2} onChange={(e) => setUserData({ ...userData, miniTrainingPeserta2: e.target.value })} className="form-select" name="miniTrainingPeserta2" required >
                            <option disabled selected>Pilih</option>
                            <option value="Ya, Saya bersedia">Ya, Saya bersedia</option>
                            <option value="Mungkin perlu rekan pengganti di hari tertentu">Mungkin perlu rekan pengganti di hari tertentu</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="initMentoringPeserta2" className="form-label">Apakah Anda bersedia mengikuti agenda <b>Initial Mentoring LEAD Indonesia</b> yang akan dilakukan secara <b>online selama 3 hari?</b></label>
                        <p>Perlu diingat, bahwa Anda harus mengosongkan aktivitas lainnya selama 3 hari ini untuk dapat mengikuti kegiatan ini secara optimal, dimana setiap harinya terdapat output dari setiap kelompok dalam masing-masing bidang yang harus dikerjakan dan dikumpulkan.</p>
                        <select value={userData.initMentoringPeserta2} onChange={(e) => setUserData({ ...userData, initMentoringPeserta2: e.target.value })} className="form-select" name="initMentoringPeserta2" required >
                            <option disabled selected>Pilih</option>
                            <option value="Ya, Saya bersedia">Ya, Saya bersedia</option>
                            <option value="Mungkin perlu rekan pengganti di hari tertentu">Mungkin perlu rekan pengganti di hari tertentu</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pendampinganPeserta2" className="form-label">Apakah Anda bersedia mengikuti agenda <b>Pendampingan Intensif bersama Para Mentor LEAD Indonesia</b> yang akan dilakukan secara <b>online sebanyak 2 - 3 kali setiap bulan?</b></label>
                        <p>Pendampingan Intensif bersama Mentor merupakan kegiatan mentoring yang dilakukan secara rutin 2 - 3 kali setiap bulan selama 5 bulan dengan menyesuaikan kesepakatan waktu antara mentor dan peserta terkait. </p>
                        <p>Perlu diingat, bahwa Anda harus mengosongkan aktivitas lain dan secara dedikatif mengikuti kegiatan mentoring secara optimal, dimana peserta perlu menyampaikan progress, problem, plan kepada mentor sebelum melakukan kegiatan mentoring.</p>
                        <select value={userData.pendampinganPeserta2} onChange={(e) => setUserData({ ...userData, pendampinganPeserta2: e.target.value })} className="form-select" name="pendampinganPeserta2" required >
                            <option disabled selected>Pilih</option>
                            <option value="Ya, Saya bersedia">Ya, Saya bersedia</option>
                            <option value="Mungkin perlu rekan pengganti di hari tertentu">Mungkin perlu rekan pengganti di hari tertentu</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Tambahkan</button>
                </div>
            </form>
        </>
    )
}