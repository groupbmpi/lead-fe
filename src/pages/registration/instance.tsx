import { useRegistration } from '@/contexts/RegistrationContext';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { jenisCluster } from '../../../data/jenisCluster';
import { fokusIsu } from '../../../data/fokusIsu';
import NavbarGuest from '@/components/Navbar/NavbarGuest';

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
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(11);
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(1);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/province`);
        const res = await response.json();
        setProvinceOptions(res.data);
      } catch (error) {
        console.error('Error fetching province data:', error);
      }
    }
    const fetchCity = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/city`);
        const res = await response.json();
        setCityOptions(res.data);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    }
    fetchProvince();
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
      <NavbarGuest />
      <form onSubmit={handleSubmit}>
        <div className="container d-flex flex-column gap-2 align-items-left justify-content-left p-4">
          <h1>Pendaftaran</h1>
          <span className='text-danger'><i>Jangan memuat ulang/refresh halaman selama pengisian formulir!</i></span>
          <h2>Profile Instansi</h2>
          <div className="mb-3">
            <label htmlFor="namaInstansi" className="form-label">Nama Instansi</label>
            <input value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} type="text" className="form-control" name="name" placeholder="Nama Instansi" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Instansi</label>
            <input value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} type="email" className="form-control" name="email" placeholder="cth: a@gmail.com" required />
          </div>
          <div className="mb-3">
            <label htmlFor="tanggalBerdiri" className="form-label">Bulan/Tahun Instansi</label>
            <input value={userData.tanggalBerdiri} onChange={(e) => setUserData({ ...userData, tanggalBerdiri: e.target.value })} type="month" className="form-control" name="tanggalBerdiri" required />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Jenis Instansi</label>
            <select value={userData.type} onChange={(e) => setUserData({ ...userData, type: e.target.value })} className="form-select" name="type" required >
              <option selected value="Gerakan">Gerakan</option>
              <option value="Komunitas">Komunitas</option>
              <option value="Yayasan">Yayasan</option>
            </select>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="sector" className="form-label">Jenis Cluster</label>
              <select
                value={userData.sector}
                onChange={(e) => {
                  const currentlySelectedCluster = jenisCluster.find(
                    (cluster) => cluster.text === e.target.value
                  );
                  if (currentlySelectedCluster) {
                    setSelectedClusterId(currentlySelectedCluster.id);
                  }
                  setUserData({ ...userData, sector: e.target.value });
                }}
                className="form-select"
                name="sector"
                required
              >
                {jenisCluster.map((cluster: Cluster) => (
                  <option key={cluster.id} value={cluster.text} selected={cluster.id === 1}>
                    {cluster.text}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label htmlFor="focus" className="form-label">Fokus Isu</label>
              <select
                value={userData.focus}
                onChange={(e) => setUserData({ ...userData, focus: e.target.value })}
                className="form-select"
                name="focus"
                required
              >
                {fokusIsu
                  .filter((isu) => isu.clusterId === selectedClusterId)
                  .map((isu: FokusIsu) => (
                    <option key={isu.id} value={isu.text} selected={isu.id === 101}>
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
                  const currentlySelectedProvince = provinceOptions.find(
                    (province) => province.name === e.target.value
                  );
                  if (currentlySelectedProvince) {
                    setSelectedProvinceId(currentlySelectedProvince.province_id);
                  }
                  setUserData({ ...userData, address_province: e.target.value });
                }}
                className="form-select"
                name="address_province"
                required
              >
                {provinceOptions.length > 0 && provinceOptions.map((province) => (
                  <option key={province.province_id} value={province.name} selected={province.province_id === 11}>
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
                {cityOptions.length > 0 && cityOptions
                  .filter((city) => city.province_id === selectedProvinceId)
                  .map((city) => (
                    <option key={city.city_id} value={city.name} selected={city.city_id === 1101}>
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
            <label htmlFor="description" className="form-label">Profil/Gambaran Instansi</label>
            <p>Jelaskan profil/gambaran instansi dalam 1 paragraf singkat</p>
            <textarea rows={3} value={userData.description} onChange={(e) => setUserData({ ...userData, description: e.target.value })} className="form-control w-100" name="description" required />
          </div>
          <h2>Media Sosial</h2>
          <div className="mb-3">
            <label htmlFor="social_instagram" className="form-label">Link Instagram Instansi</label>
            <p>Kosongkan jika tidak ada</p>
            <input value={userData.social_instagram} onChange={(e) => setUserData({ ...userData, social_instagram: e.target.value })} type="url" className="form-control" name="social_instagram" placeholder="https://instagram.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="social_website" className="form-label">Link Website Instansi</label>
            <p>Kosongkan jika tidak ada</p>
            <input value={userData.social_website} onChange={(e) => setUserData({ ...userData, social_website: e.target.value })} type="url" className="form-control" name="social_website" placeholder="https://google.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="social_tiktok" className="form-label">Link Tiktok Instansi</label>
            <p>Kosongkan jika tidak ada</p>
            <input value={userData.social_tiktok} onChange={(e) => setUserData({ ...userData, social_tiktok: e.target.value })} type="url" className="form-control" name="social_tiktok" placeholder="https://tiktok.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="social_youtube" className="form-label">Link Youtube Instansi</label>
            <p>Kosongkan jika tidak ada</p>
            <input value={userData.social_youtube} onChange={(e) => setUserData({ ...userData, social_youtube: e.target.value })} type="url" className="form-control" name="social_youtube" placeholder="https://youtube.com" />
          </div>
          <h2>Cakupan Instansi</h2>
          <div className="mb-3">
            <label htmlFor="area" className="form-label">Cakupan Jangkauan Program yang Dijalankan Instansi</label>
            <select value={userData.area} onChange={(e) => setUserData({ ...userData, area: e.target.value })} className="form-select" name="area" required >
              <option value="Nasional" selected>Nasional</option>
              <option value="Lebih dari Satu Provinsi">Lebih dari Satu Provinsi</option>
              <option value="Hanya Satu Provinsi">Hanya Satu Provinsi</option>
              <option value="Kota/Kabupaten">Kota/Kabupaten</option>
              <option value="Kecamatan/Kelurahan/Lingkup Lebih Kecil">Kecamatan/Kelurahan/Lingkup Lebih Kecil</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="total_beneficiaries" className="form-label">Jumlah Penerima Manfaat</label>
            <p>Jumlah total seluruh penerima manfaat dari kegiatan yang dilakukan melalui program oleh instansi</p>
            <input value={userData.total_beneficiaries} onChange={(e) => setUserData({ ...userData, total_beneficiaries: e.target.value })} type="number" className="form-control" name="total_beneficiaries" placeholder="Jumlah Penerima Manfaat" required />
          </div>
          <h2>Berkas Instansi</h2>
          <div className="mb-3">
            <label htmlFor="url_company_profile" className="form-label">Unggah Berkas Company Profile</label>
            <p>Pastikan tautan dapat diakses secara publik dengan format nama dokumen <b>“Company Profile_Nama Instansi”</b></p>
            <p>Syarat dan ketentuan company profile tercantum
              <span> <Link href="https://bit.ly/template-profil-lembaga-peserta-LEAD">disini</Link></span>
            </p>
            <input value={userData.url_company_profile} onChange={(e) => setUserData({ ...userData, url_company_profile: e.target.value })} type="url" className="form-control" name="url_company_profile" placeholder="Link Company Profile" required />
          </div>
          <div className="mb-3">
            <label htmlFor="url_program_proposal" className="form-label">Unggah Berkas Proposal Program</label>
            <p>Pastikan tautan dapat diakses secara publik dengan format nama dokumen <b>“Proposal Program_Nama Instansi”</b></p>
            <input value={userData.url_program_proposal} onChange={(e) => setUserData({ ...userData, url_program_proposal: e.target.value })} type="url" className="form-control" name="url_program_proposal" placeholder="Link Proposal Program" required />
          </div>
          <h2>Terkait LEAD Indonesia</h2>
          <div className="mb-3">
            <label htmlFor="information_source" className="form-label">Dari mana Anda mengetahui LEAD Indonesia?</label>
            <select value={userData.information_source} onChange={(e) => setUserData({ ...userData, information_source: e.target.value })} className="form-select" name="information_source" required >
              <option selected value="Instagram @bakriecenter">Instagram @bakriecenter</option>
              <option value="Website Bakrie Center Foundation (http://bcf.or.id/)">Website Bakrie Center Foundation (http://bcf.or.id/)</option>
              <option value="Alumni LEAD Indonesia">Alumni LEAD Indonesia</option>
              <option value="Dihubungi oleh tim Bakrie Center Foundation">Dihubungi oleh tim Bakrie Center Foundation</option>
              <option value="Teman atau rekan kerja">Teman atau rekan kerja</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="desain_program_training" className="form-label">Apakah Anda pernah mengikuti pelatihan atau memiliki pengetahuan terkait <b>desain program</b> sebelum mendaftar LEAD Indonesia?</label>
            <select value={userData.desain_program_training} onChange={(e) => setUserData({ ...userData, desain_program_training: e.target.value })} className="form-select" name="desain_program_training" required >
              <option selected value="Belum pernah mengetahui">Belum pernah mengetahui</option>
              <option value="Pernah mempelajari">Pernah mempelajari</option>
              <option value="Learning by Doing di instansi saat ini">Learning by Doing di instansi saat ini</option>
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
              <option selected value="Belum pernah mengetahui">Belum pernah mengetahui</option>
              <option value="Pernah mempelajari">Pernah mempelajari</option>
              <option value="Learning by Doing di instansi saat ini">Learning by Doing di instansi saat ini</option>
              <option value="Memahami betul dan menjadi praktisi dalam bidang sustainability">Memahami betul dan menjadi praktisi dalam bidang sustainability</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="sustainability_knowledge" className="form-label">Apa yang anda ketahui terkait <b>sustainability</b> atau <b>keberlanjutan</b>?</label>
            <input value={userData.sustainability_knowledge} onChange={(e) => setUserData({ ...userData, sustainability_knowledge: e.target.value })} type="text" className="form-control" name="sustainability_knowledge" required />
          </div>
          <div className="mb-3">
            <label htmlFor="social_report_training" className="form-label">Apakah Anda pernah mengikuti pelatihan atau memiliki pengetahuan terkait <b>social report</b> atau <b>laporan sosial</b> sebelum mendaftar LEAD Indonesia?</label>
            <select value={userData.social_report_training} onChange={(e) => setUserData({ ...userData, social_report_training: e.target.value })} className="form-select" name="social_report_training" required >
              <option selected value="Belum pernah mengetahui">Belum pernah mengetahui</option>
              <option value="Pernah mempelajari">Pernah mempelajari</option>
              <option value="Learning by Doing di instansi saat ini">Learning by Doing di instansi saat ini</option>
              <option value="Memahami betul dan menjadi praktisi dalam bidang social report">Memahami betul dan menjadi praktisi dalam bidang social report</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="social_report_knowledge" className="form-label">Apa yang anda ketahui terkait <b>social report</b> atau <b>laporan sosial</b>?</label>
            <input value={userData.social_report_knowledge} onChange={(e) => setUserData({ ...userData, social_report_knowledge: e.target.value })} type="text" className="form-control" name="social_report_knowledge" required />
          </div>
          <div className="mb-3">
            <label htmlFor="url_program_report" className="form-label">Unggah Laporan Akhir Tahun atau Laporan Pertanggungjawaban Pelaksanaan Program Instansi</label>
            <p>Bila instansi Anda tidak memiliki dokumen terkait, silakan lewati bagian ini</p>
            <p>Pastikan tautan dapat diakses secara publik dengan format nama dokumen <b>&quot;Laporan Akhir_Nama Instansi&quot;</b></p>
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