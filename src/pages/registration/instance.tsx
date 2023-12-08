import { useRegistration } from '@/contexts/RegistrationContext';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { jenisCluster } from '../../../data/jenisCluster';
import { fokusIsu } from '../../../data/fokusIsu';

interface City {
    id: number;
    text: string;
    provinceId: number;
}

interface Province {
    id: number;
    text: string;
}

interface Cluster {
    id: number;
    text: string;
}

interface FokusIsu {
    id: number;
    text: string;
    clusterId: number;
}

const Home = () => {

    const router = useRouter();
    const { userData, setUserData } = useRegistration();
    const [provinceOptions, setProvinceOptions] = useState<Province[]>([]);
    const [cityOptions, setCityOptions] = useState<{ id: number; text: string; provinceId: number }[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [selectedCluster, setSelectedCluster] = useState<string>('');
    const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);

    const fetchProvince = async () => {
        try {
            const response = await fetch('/api/province');
            const data = await response.json();
            setProvinceOptions(data);
        } catch (error) {
            console.error('Error fetching province data:', error);
        }
    }

    useEffect(() => {
        fetchProvince();
    }, []);

    const fetchCity = async () => {
        try {
            const response = await fetch('/api/city');
            const data = await response.json();
            setCityOptions(data);
        } catch (error) {
            console.error('Error fetching city data:', error);
        }
    }

    useEffect(() => {
        fetchCity();
    }, []);

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
                <Head>
                    <title>Pendaftaran Instansi</title>
                </Head>
                <form onSubmit={handleSubmit}>
                    <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
                        <h1>Daftar</h1>
                        <h2>Profile Instansi</h2>
                        <div className="mb-3">
                            <label htmlFor="namaInstansi" className="form-label">Nama Instansi</label>
                            <input value={userData.namaInstansi} onChange={(e) => setUserData({ ...userData, namaInstansi: e.target.value })} type="text" className="form-control" name="namaInstansi" placeholder="Nama Instansi" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="emailInstansi" className="form-label">Email Instansi</label>
                            <input value={userData.emailInstansi} onChange={(e) => setUserData({ ...userData, emailInstansi: e.target.value })} type="text" className="form-control" name="emailInstansi" placeholder="Email Instansi" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tanggalBerdiri" className="form-label">Bulan/Tahun Instansi</label>
                            <input value={userData.tanggalBerdiri} onChange={(e) => setUserData({ ...userData, tanggalBerdiri: e.target.value })} type="month" className="form-control" name="tanggalBerdiri" required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="jenisInstansi" className="form-label">Jenis Instansi</label>
                            <select value={userData.jenisInstansi} onChange={(e) => setUserData({ ...userData, jenisInstansi: e.target.value })} className="form-select" name="jenisInstansi" required >
                                <option disabled selected>Pilih</option>
                                <option value="Gerakan">Gerakan</option>
                                <option value="Komunitas">Komunitas</option>
                                <option value="Yayasan">Yayasan</option>
                            </select>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label htmlFor="jenisCluster" className="form-label">Jenis Cluster</label>
                                <select
                                    value={selectedCluster}
                                    onChange={(e) => {
                                        const selectedClusterText = e.target.value;
                                        setSelectedCluster(selectedClusterText);

                                        const selectedCluster = jenisCluster.find(
                                            (cluster) => cluster.text === selectedClusterText
                                        );

                                        if (selectedCluster) {
                                            setSelectedClusterId(selectedCluster.id);
                                        }

                                        setUserData({ ...userData, jenisCluster: selectedClusterText });
                                    }}
                                    className="form-select"
                                    name="jenisCluster"
                                    required
                                >
                                    <option disabled selected>Pilih</option>
                                    {jenisCluster.map((cluster: Cluster) => (
                                        <option key={cluster.id} value={cluster.text}>
                                            {cluster.text}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col">
                                <label htmlFor="fokusIsu" className="form-label">Fokus Isu</label>
                                <select
                                    value={userData.fokusIsu}
                                    onChange={(e) => setUserData({ ...userData, fokusIsu: e.target.value })}
                                    className="form-select"
                                    name="fokusIsu"
                                    required
                                >
                                    <option disabled selected>Pilih</option>
                                    {fokusIsu
                                        .filter((isu) => isu.clusterId === selectedClusterId)
                                        .map((isu: FokusIsu) => (
                                            <option key={isu.id} value={isu.text}>
                                                {isu.text}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>


                        <div className="mb-3">
                            <label htmlFor="alamatKantor" className="form-label">Alamat Kantor</label>
                            <input value={userData.alamatKantor} onChange={(e) => setUserData({ ...userData, alamatKantor: e.target.value })} type="text" className="form-control" name="alamatKantor" placeholder="Alamat Kantor" required />
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="provinsiKantor" className="form-label">Provinsi</label>
                                <select
                                    value={userData.provinsiKantor}
                                    onChange={(e) => {
                                        const selectedProvinceText = e.target.value;
                                        setSelectedProvince(selectedProvinceText);

                                        const selectedProvince = provinceOptions.find(
                                            (province) => province.text === selectedProvinceText
                                        );

                                        if (selectedProvince) {
                                            setSelectedProvinceId(selectedProvince.id);
                                        }

                                        setUserData({ ...userData, provinsiKantor: selectedProvinceText });
                                    }}
                                    className="form-select"
                                    name="provinsiKantor"
                                    required
                                >
                                    <option disabled selected>Pilih</option>
                                    {provinceOptions.map((province) => (
                                        <option key={province.id} value={province.text}>
                                            {province.text}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="kotaKantor" className="form-label">Kota</label>
                                <select
                                    value={userData.kotaKantor}
                                    onChange={(e) => setUserData({ ...userData, kotaKantor: e.target.value })}
                                    className="form-select"
                                    name="kotaKantor"
                                    required
                                >
                                    <option disabled selected>Pilih</option>
                                    {cityOptions
                                        .filter((city) => city.provinceId === selectedProvinceId)
                                        .map((city) => (
                                            <option key={city.id} value={city.text}>
                                                {city.text}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="gambaranInstansi" className="form-label">Profil/Gambaran Instansi</label>
                            <p>Jelaskan profil/gambaran instansi dalam 1 paragraf singkat</p>
                            <textarea value={userData.gambaranInstansi} onChange={(e) => setUserData({ ...userData, gambaranInstansi: e.target.value })} className="form-control" name="gambaranInstansi" style={{ width: '550px', height: '100px' }} required />
                        </div>
                        <h2>Media Sosial</h2>
                        <div className="mb-3">
                            <label htmlFor="instagramInstansi" className="form-label">Link Instagram Instansi</label>
                            <p>Jika tidak ada isi dengan tanda '-'</p>
                            <input value={userData.instagramInstansi} onChange={(e) => setUserData({ ...userData, instagramInstansi: e.target.value })} type="url" className="form-control" name="instagramInstansi" placeholder="https://instagram.com" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="websiteInstansi" className="form-label">Link Website Instansi</label>
                            <p>Jika tidak ada isi dengan tanda '-'</p>
                            <input value={userData.websiteInstansi} onChange={(e) => setUserData({ ...userData, websiteInstansi: e.target.value })} type="url" className="form-control" name="websiteInstansi" placeholder="https://google.com" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tiktokInstansi" className="form-label">Link Instagram Instansi</label>
                            <p>Jika tidak ada isi dengan tanda '-'</p>
                            <input value={userData.tiktokInstansi} onChange={(e) => setUserData({ ...userData, tiktokInstansi: e.target.value })} type="url" className="form-control" name="tiktokInstansi" placeholder="https://tiktok.com" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="youtubeInstansi" className="form-label">Link Instagram Instansi</label>
                            <p>Jika tidak ada isi dengan tanda '-'</p>
                            <input value={userData.youtubeInstansi} onChange={(e) => setUserData({ ...userData, youtubeInstansi: e.target.value })} type="url" className="form-control" name="youtubeInstansi" placeholder="https://youtube.com" required />
                        </div>
                        <h2>Cakupan Instansi</h2>
                        <div className="mb-3">
                            <label htmlFor="jumlahPenerimaManfaat" className="form-label">Jumlah Penerima Manfaat</label>
                            <p>Jumlah total seluruh penerima manfaat dari kegiatan yang dilakukan melalui program oleh instansi</p>
                            <input value={userData.jumlahPenerimaManfaat} onChange={(e) => setUserData({ ...userData, jumlahPenerimaManfaat: e.target.value })} type="number" className="form-control" name="jumlahPenerimaManfaat" placeholder="Jumlah Penerima Manfaat" required />
                        </div>

                        <h2>Berkas Instansi</h2>
                        <div className="mb-3">
                            <label htmlFor="companyProfile" className="form-label">Unggah Berkas Company Profile</label>
                            <p>Pastikan tautan dapat diakses secara publik</p>
                            <p>Syarat dan ketentuan company profile tercantum
                                <Link href="https://bit.ly/template-profil-lembaga-peserta-LEAD">disini</Link>
                            </p>
                            <input value={userData.companyProfile} onChange={(e) => setUserData({ ...userData, companyProfile: e.target.value })} type="url" className="form-control" name="companyProfile" placeholder="Link Company Profile" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="proposalProgram" className="form-label">Unggah Berkas Proposal Program</label>
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