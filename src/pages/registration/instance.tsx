import { useRegistration } from '@/contexts/RegistrationContext'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { FormEvent } from 'react';

const Home = () => {

    const router = useRouter();
    const { userData, setUserData } = useRegistration();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const instanceRegistrationForm = new FormData(e.currentTarget);
        const instanceRegistrationData: Record<string, string> = {};
        instanceRegistrationForm.forEach((value, key) => {
            instanceRegistrationData[key] = value.toString();
        });
        setUserData((prevUserData) => ({
            ...prevUserData,
            ...instanceRegistrationData,
        }));
        router.push('/registration/summary');
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Head>
                    <title>Pendaftaran Instansi</title>
                </Head>
                <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
                    <h1>Daftar</h1>
                    <h2>Profile Instansi</h2>
                    <div className="mb-3">
                        <label htmlFor="namaInstansi" className="form-label"><h5>Nama Instansi</h5></label>
                        <input value={userData.namaInstansi} onChange={(e) => setUserData({ ...userData, namaInstansi: e.target.value })} type="text" className="form-control" name="namaInstansi" placeholder="Nama Instansi" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailInstansi" className="form-label"><h5>Email Instansi</h5></label>
                        <input value={userData.emailInstansi} onChange={(e) => setUserData({ ...userData, emailInstansi: e.target.value })} type="text" className="form-control" name="emailInstansi" placeholder="Email Instansi" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tanggalBerdiri" className="form-label"><h5>Bulan/Tahun Instansi</h5></label>
                        <input value={userData.tanggalBerdiri} onChange={(e) => setUserData({ ...userData, tanggalBerdiri: e.target.value })} type="month" className="form-control" name="tanggalBerdiri" required />
                    </div>


                    <div className="row">
                        <div className="col">
                            <label htmlFor="jenisInstansi" className="form-label"><h5>Jenis Instansi</h5></label>
                            <select value={userData.jenisInstansi} onChange={(e) => setUserData({ ...userData, jenisInstansi: e.target.value })} className="form-select" name="jenisInstansi" required >
                                <option selected>Pilih</option>
                                <option value="Gerakan">Gerakan</option>
                                <option value="Komunitas">Komunitas</option>
                                <option value="Yayasan">Yayasan</option>
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="jenisInstansi" className="form-label"><h5>Jenis Cluster</h5></label>
                            <select value={userData.jenisCluster} onChange={(e) => setUserData({ ...userData, jenisCluster: e.target.value })} className="form-select" name="jenisCluster" required >
                                <option selected>Pilih</option>
                                <option value="Pendidikan">Pendidikan</option>
                                <option value="Kesehatan">Kesehatan</option>
                                <option value="Lingkungan">Lingkungan</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="alamatKantor" className="form-label"><h5>Alamat Kantor</h5></label>
                        <input value={userData.alamatKantor} onChange={(e) => setUserData({ ...userData, alamatKantor: e.target.value })} type="text" className="form-control" name="alamatKantor" placeholder="Alamat Kantor" required />
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="provinsiKantor" className="form-label"><h5>Provinsi</h5></label>
                            <select value={userData.provinsiKantor} onChange={(e) => setUserData({ ...userData, provinsiKantor: e.target.value })} className="form-select" name="provinsiKantor" required >
                                <option selected>Pilih</option>
                                <option value="...">...</option>
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="kotaKantor" className="form-label"><h5>Kota</h5></label>
                            <select value={userData.kotaKantor} onChange={(e) => setUserData({ ...userData, kotaKantor: e.target.value })} className="form-select" name="kotaKantor" required >
                                <option selected>Pilih</option>
                                <option value="...">...</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gambaranInstansi" className="form-label"><h5>Profil/Gambaran Instansi</h5></label>
                        <p>Jelaskan profil/gambaran instansi dalam 1 paragraf singkat</p>
                        <textarea value={userData.gambaranInstansi} onChange={(e) => setUserData({ ...userData, gambaranInstansi: e.target.value })} className="form-control" name="gambaranInstansi" style={{ width: '550px', height: '100px' }} required />
                    </div>

                    <h2>Cakupan Instansi</h2>
                    <div className="mb-3">
                        <label htmlFor="jumlahPenerimaManfaat" className="form-label"><h5>Jumlah Penerima Manfaat</h5></label>
                        <p>Jumlah total seluruh penerima manfaat dari kegiatan yang dilakukan melalui program oleh instansi</p>
                        <input value={userData.jumlahPenerimaManfaat} onChange={(e) => setUserData({ ...userData, jumlahPenerimaManfaat: e.target.value })} type="number" className="form-control" name="jumlahPenerimaManfaat" placeholder="Jumlah Penerima Manfaat" required />
                    </div>

                    <h2>Berkas Instansi</h2>
                    <div className="mb-3">
                        <label htmlFor="companyProfile" className="form-label"><h5>Unggah Berkas Company Profile</h5></label>
                        <p>Pastikan tautan dapat diakses secara publik</p>
                        <p>Syarat dan ketentuan company profile tercantum
                            <Link href="https://bit.ly/template-profil-lembaga-peserta-LEAD">disini</Link>
                        </p>
                        <input value={userData.companyProfile} onChange={(e) => setUserData({ ...userData, companyProfile: e.target.value })} type="url" className="form-control" name="companyProfile" placeholder="Link Company Profile" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="proposalProgram" className="form-label"><h5>Unggah Berkas Proposal Program</h5></label>
                        <p>Pastikan tautan dapat diakses secara publik</p>
                        <input value={userData.proposalProgram} onChange={(e) => setUserData({ ...userData, proposalProgram: e.target.value })} type="url" className="form-control" name="proposalProgram" placeholder="Link Proposal Program" />
                    </div>
                    <button type="submit" className="btn btn-primary">Berikutnya</button>
                </div>
            </form>
        </>
    )
}

export default Home;