import { useRegistration } from '@/contexts/RegistrationContext';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { jenisCluster } from '../../../data/jenisCluster';
import { fokusIsu } from '../../../data/fokusIsu';

interface City {
    city_id: number;
    name: string;
    province_id: number;
}

interface Province {
    province_id: number;
    name: string;
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
    const [cityOptions, setCityOptions] = useState<City[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [selectedCluster, setSelectedCluster] = useState<string>('');
    const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fetchProvince = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/v1/province`);
            const res = await response.json();
            setProvinceOptions(res.data);
        } catch (error) {
            console.error('Error fetching province data:', error);
        }
    }

    useEffect(() => {
        fetchProvince();
    }, []);

    const fetchCity = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/v1/city`);
            const res = await response.json();
            console.log(res.data);
            setCityOptions(res.data);
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
                    <title>LEAD - Pendaftaran Instansi</title>
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
                            <input value={userData.emailInstansi} onChange={(e) => setUserData({ ...userData, emailInstansi: e.target.value })} type="email" className="form-control" name="emailInstansi" placeholder="cth: a@gmail.com" required />
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

                        <h2>Alamat Kantor</h2>
                        <div className="mb-3">
                            <label htmlFor="address_street" className="form-label">Jalan</label>
                            <input value={userData.address_street} onChange={(e) => setUserData({ ...userData, address_street: e.target.value })} type="text" className="form-control" name="address_street" placeholder="Nama Jalan" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address_village" className="form-label">Desa/Kelurahan</label>
                            <input value={userData.address_village} onChange={(e) => setUserData({ ...userData, address_village: e.target.value })} type="text" className="form-control" name="address_village" placeholder="Nama Desa/ Kelurahan" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address_district" className="form-label">Kecamatan</label>
                            <input value={userData.address_district} onChange={(e) => setUserData({ ...userData, address_district: e.target.value })} type="text" className="form-control" name="address_district" placeholder="Nama Kecamatan" required />
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="address_province" className="form-label">Provinsi</label>
                                <select
                                    value={userData.address_province}
                                    onChange={(e) => {
                                        const selectedProvinceText = e.target.value;
                                        setSelectedProvince(selectedProvinceText);

                                        const selectedProvince = provinceOptions.find(
                                            (province) => province.name === selectedProvinceText
                                        );

                                        if (selectedProvince) {
                                            setSelectedProvinceId(selectedProvince.province_id);
                                        }

                                        setUserData({ ...userData, address_province: selectedProvinceText });
                                    }}
                                    className="form-select"
                                    name="address_province"
                                    required
                                >
                                    <option disabled selected>Pilih</option>
                                    {provinceOptions.map((province) => (
                                        <option key={province.province_id} value={province.name}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="address_regency" className="form-label">Kota</label>
                                <select
                                    value={userData.address_regency}
                                    onChange={(e) => setUserData({ ...userData, address_regency: e.target.value })}
                                    className="form-select"
                                    name="address_regency"
                                    required
                                >
                                    <option disabled selected>Pilih</option>
                                    {cityOptions
                                        .filter((city) => city.province_id === selectedProvinceId)
                                        .map((city) => (
                                            <option key={city.city_id} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address_postal_code" className="form-label">Kode Pos</label>
                            <input value={userData.address_postal_code} onChange={(e) => setUserData({ ...userData, address_postal_code: e.target.value })} type="text" className="form-control" name="address_postal_code" placeholder="Kode Pos" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="gambaranInstansi" className="form-label">Profil/Gambaran Instansi</label>
                            <p>Jelaskan profil/gambaran instansi dalam 1 paragraf singkat</p>
                            <textarea value={userData.gambaranInstansi} onChange={(e) => setUserData({ ...userData, gambaranInstansi: e.target.value })} className="form-control" name="gambaranInstansi" style={{ width: '550px', height: '100px' }} required/>
                        </div>
                        <h2>Media Sosial</h2>
                        <div className="mb-3">
                            <label htmlFor="instagramInstansi" className="form-label">Link Instagram Instansi</label>
                            <p>Kosongkan jika tidak ada</p>
                            <input value={userData.instagramInstansi} onChange={(e) => setUserData({ ...userData, instagramInstansi: e.target.value })} type="url" className="form-control" name="instagramInstansi" placeholder="https://instagram.com" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="websiteInstansi" className="form-label">Link Website Instansi</label>
                            <p>Kosongkan jika tidak ada</p>
                            <input value={userData.websiteInstansi} onChange={(e) => setUserData({ ...userData, websiteInstansi: e.target.value })} type="url" className="form-control" name="websiteInstansi" placeholder="https://google.com" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tiktokInstansi" className="form-label">Link Tiktok Instansi</label>
                            <p>Kosongkan jika tidak ada</p>
                            <input value={userData.tiktokInstansi} onChange={(e) => setUserData({ ...userData, tiktokInstansi: e.target.value })} type="url" className="form-control" name="tiktokInstansi" placeholder="https://tiktok.com" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="youtubeInstansi" className="form-label">Link Youtube Instansi</label>
                            <p>Kosongkan jika tidak ada</p>
                            <input value={userData.youtubeInstansi} onChange={(e) => setUserData({ ...userData, youtubeInstansi: e.target.value })} type="url" className="form-control" name="youtubeInstansi" placeholder="https://youtube.com" />
                        </div>
                        <h2>Cakupan Instansi</h2>
                        <div className="mb-3">
                            <label htmlFor="cakupanInstansi" className="form-label">Cakupan Jangkauan Program yang Dijalankan Instansi</label>
                            <select value={userData.cakupanInstansi} onChange={(e) => setUserData({ ...userData, cakupanInstansi: e.target.value })} className="form-select" name="cakupanInstansi" required >
                                <option disabled selected>Pilih</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Lebih dari Satu Provinsi">Lebih dari Satu Provinsi</option>
                                <option value="Hanya Satu Provinsi">Hanya Satu Provinsi</option>
                                <option value="Kota/Kabupaten">Kota/Kabupaten</option>
                                <option value="Kecamatan/ Kelurahan/ Lingkup Lebih Kecil">Kecamatan/ Kelurahan/ Lingkup Lebih Kecil</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="jumlahPenerimaManfaat" className="form-label">Jumlah Penerima Manfaat</label>
                            <p>Jumlah total seluruh penerima manfaat dari kegiatan yang dilakukan melalui program oleh instansi</p>
                            <input value={userData.jumlahPenerimaManfaat} onChange={(e) => setUserData({ ...userData, jumlahPenerimaManfaat: e.target.value })} type="number" className="form-control" name="jumlahPenerimaManfaat" placeholder="Jumlah Penerima Manfaat" required />
                        </div>

                        <h2>Berkas Instansi</h2>
                        <div className="mb-3">
                            <label htmlFor="url_company_profile" className="form-label">Unggah Berkas Company Profile</label>
                            <p>Pastikan tautan dapat diakses secara publik dengan format nama dokumen <b>“Company Profile_Nama Instansi”</b></p>
                            <p>Syarat dan ketentuan company profile tercantum
                                <Link href="https://bit.ly/template-profil-lembaga-peserta-LEAD"> disini</Link>
                            </p>
                            <input value={userData.url_company_profile} onChange={(e) => setUserData({ ...userData, url_company_profile: e.target.value })} type="url" className="form-control" name="url_company_profile" placeholder="Link Company Profile" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="url_program_proposal" className="form-label">Unggah Berkas Proposal Program</label>
                            <p>Pastikan tautan dapat diakses secara publik dengan format nama dokumen <b>“Proposal Program_Nama Instansi”</b></p>
                            <input value={userData.url_program_proposal} onChange={(e) => setUserData({ ...userData, url_program_proposal: e.target.value })} type="url" className="form-control" name="url_program_proposal" placeholder="Link Proposal Program" required/>
                        </div>

                        <h2>Terkait LEAD Indonesia</h2>
                        <div className="mb-3">
                            <label htmlFor="information_source" className="form-label">Dari mana Anda mengetahui LEAD Indonesia?</label>
                            <select value={userData.information_source} onChange={(e) => setUserData({ ...userData, information_source: e.target.value })} className="form-select" name="information_source" required >
                                <option disabled selected>Pilih</option>
                                <option value="Instagram @bakriecenter">Instagram @bakriecenter</option>
                                <option value="Website Bakrie Center Foundation">Website Bakrie Center Foundation</option>
                                <option value="Alumni LEAD Indonesia">Alumni LEAD Indonesia</option>
                                <option value="Dihubungi oleh tim Bakrie Center Foundation">Dihubungi oleh tim Bakrie Center Foundation</option>
                                <option value="Teman atau Rekan Kerja">Teman atau Rekan Kerja</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desain_program_training" className="form-label">Apakah Anda pernah mengikuti pelatihan atau memiliki pengetahuan terkait <b>desain program</b> sebelum mendaftar LEAD Indonesia?</label>
                            <select value={userData.desain_program_training} onChange={(e) => setUserData({ ...userData, desain_program_training: e.target.value })} className="form-select" name="desain_program_training" required >
                                <option disabled selected>Pilih</option>
                                <option value="Belum pernah mengetahui">Belum pernah mengetahui</option>
                                <option value="Pernah mempelajari">Pernah mempelajari</option>
                                <option value="Learning by Doing di instansi saat ini"><i>Learning by Doing</i> di instansi saat ini</option>
                                <option value="Memahami betul dan menjadi praktisi dalam bidang desain program">Memahami betul dan menjadi praktisi dalam bidang desain program</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desain_program_knowledge" className="form-label">Apa yang anda ketahui terkait <b>Desain Program</b>?</label>
                            <input value={userData.desain_program_knowledge} onChange={(e) => setUserData({ ...userData, desain_program_knowledge: e.target.value })} type="text" className="form-control" name="desain_program_knowledge" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sustainability_training" className="form-label">Apakah Anda pernah mengikuti pelatihan atau memiliki pengetahuan terkait <b>sustainability</b> atau <b>keberlanjutan</b> sebelum mendaftar LEAD Indonesia?</label>
                            <select value={userData.sustainability_training} onChange={(e) => setUserData({ ...userData, sustainability_training: e.target.value })} className="form-select" name="sustainability_training" required >
                                <option disabled selected>Pilih</option>
                                <option value="Belum pernah mengetahui">Belum pernah mengetahui</option>
                                <option value="Pernah mempelajari">Pernah mempelajari</option>
                                <option value="Learning by Doing di instansi saat ini"><i>Learning by Doing</i> di instansi saat ini</option>
                                <option value="Memahami betul dan menjadi praktisi dalam bidang desain program">Memahami betul dan menjadi praktisi dalam bidang sustainability</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sustainability_knowledge" className="form-label">Apa yang anda ketahui terkait <b>sustainability</b> atau <b>keberlanjutan</b>?</label>
                            <input value={userData.sustainability_knowledge} onChange={(e) => setUserData({ ...userData, sustainability_knowledge: e.target.value })} type="text" className="form-control" name="sustainability_knowledge" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="social_report_training" className="form-label">Apakah Anda pernah mengikuti pelatihan atau memiliki pengetahuan terkait <b>social report</b> atau <b>laporan sosial</b> sebelum mendaftar LEAD Indonesia?</label>
                            <select value={userData.social_report_training} onChange={(e) => setUserData({ ...userData, social_report_training: e.target.value })} className="form-select" name="social_report_training" required >
                                <option disabled selected>Pilih</option>
                                <option value="Belum pernah mengetahui">Belum pernah mengetahui</option>
                                <option value="Pernah mempelajari">Pernah mempelajari</option>
                                <option value="Learning by Doing di instansi saat ini"><i>Learning by Doing</i> di instansi saat ini</option>
                                <option value="Memahami betul dan menjadi praktisi dalam bidang desain program">Memahami betul dan menjadi praktisi dalam bidang social report</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="social_report_knowledge" className="form-label">Apa yang anda ketahui terkait <b>social report</b> atau <b>laporan sosial</b>?</label>
                            <input value={userData.social_report_knowledge} onChange={(e) => setUserData({ ...userData, social_report_knowledge: e.target.value })} type="text" className="form-control" name="social_report_knowledge" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="url_program_report" className="form-label">Unggah Laporan Akhir Tahun atau Laporan Pertanggungjawaban Pelaksanaan Program Instansi</label>
                            <p>Bila instansi Anda tidak memiliki dokumen terkait, silakan lewati bagian ini</p>
                            <p>Pastikan tautan dapat diakses secara publik dengan format nama dokumen <b>"Laporan Akhir_Nama Instansi"</b></p>
                            <input value={userData.url_program_report} onChange={(e) => setUserData({ ...userData, url_program_report: e.target.value })} type="url" className="form-control" name="url_program_report" placeholder="Link Program Report" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="expectation" className="form-label">Jelaskan ekspektasi Anda setelah mengikuti kegiatan LEAD Indonesia?</label>
                            <input value={userData.expectation} onChange={(e) => setUserData({ ...userData, expectation: e.target.value })} type="text" className="form-control" name="expectation" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="other_inquiries" className="form-label">Apakah ada hal lain yang ingin Anda tanyakan atau sampaikan terkait LEAD Indonesia?</label>
                            <input value={userData.other_inquiries} onChange={(e) => setUserData({ ...userData, other_inquiries: e.target.value })} type="text" className="form-control" name="other_inquiries" required />
                        </div>
                        <button type="submit" className="btn btn-primary">Berikutnya</button>
                    </div>
            </form>
        </>
    )
}

export default Home;