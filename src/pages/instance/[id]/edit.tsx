import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import Head from 'next/head';
import { checkAuth } from '@/utils/auth';

type FormData = Record<string, string>;
const InstanceEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [instanceData, setInstanceData] = useState<FormData>({});

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const fetchInstance = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/instance/${id}`, {
        credentials: 'include',
      });
      const res = await response.json();
      setInstanceData(res.data);
    } catch (error) {
      console.error('Error fetching instance data:', error);
    }
  }

  useEffect(() => {
    fetchInstance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      const response1 = await fetch(`${backendUrl}/api/v1/instance/${id}`, {
        credentials: 'include',
      });
      const instanceData = await response1.json();
      console.log(instanceData.data);
      setInstanceData(instanceData.data);

      const response2 = await fetch(`${backendUrl}/api/v1/me`, {
        credentials: 'include',
      });
      const res = await response2.json();
      const userEmail = res.data.email;

      const response3 = await fetch(`${backendUrl}/api/v1/participant?email=${userEmail}`, {
        credentials: 'include',
      });
      const participantData = await response3.json();
      const participant = participantData?.data;

      if (!participant) {
        console.error('Participant not found');
        return null;
      }

      if (participant.instance_id != id) {
        router.push(`/instance/${id}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setInstanceData({ ...instanceData, [name]: value });
    console.log(instanceData);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const citySet = new Set(selectedCities.map((city) => city.cityName));
    const coveredAreaList = Array.from(citySet);
    if (selectedBeneficiaries.length === 0) {
      return;
    }
    if (selectedFundSources.length === 0) {
      return;
    }
    if (selectedSdgs.length === 0) {
      return;
    }
    if (!instanceData.stable_fund_source) {
      return;
    }
    if (coveredAreaList.length === 0) {
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/v1/instance/${id}`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...instanceData, beneficiaries: selectedBeneficiaries, fund_sources: selectedFundSources, sdgs: selectedSdgs, covered_area_list: coveredAreaList }),
      });
      console.log(JSON.stringify({ ...instanceData, beneficiaries: selectedBeneficiaries, fund_sources: selectedFundSources, sdgs: selectedSdgs, covered_area_list: coveredAreaList }))
      console.log(response.json);
      if (response.ok) {
        router.push(`/instance/${id}`);
      }
    } catch (error) {
      console.error('Error updating instance:', error);
    }
  };

  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<number[]>([]);
  const handleBeneficiaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    const beneficiaryId = Number(value);
    let updatedBeneficiaries = [...selectedBeneficiaries];
    if (checked) {
      if (!updatedBeneficiaries.some(beneficiary => beneficiary === beneficiaryId)) {
        updatedBeneficiaries.push(beneficiaryId);
      }
    } else {
      updatedBeneficiaries = updatedBeneficiaries.filter(beneficiary => beneficiary !== beneficiaryId);
    }
    setSelectedBeneficiaries(updatedBeneficiaries);
  };

  const [selectedFundSources, setSelectedFundSources] = useState<number[]>([]);
  const handleFundSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    const fundSourceId = Number(value);
    let updatedFundSources = [...selectedFundSources];
    if (checked) {
      if (!updatedFundSources.some(fundSource => fundSource === fundSourceId)) {
        updatedFundSources.push(fundSourceId);
      }
    } else {
      updatedFundSources = updatedFundSources.filter(fundSource => fundSource !== fundSourceId);
    }
    setSelectedFundSources(updatedFundSources);
  };

  const [selectedSdgs, setSelectedSdgs] = useState<number[]>([]);
  const handleSdgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    const sdgId = Number(value);
    if (checked && selectedSdgs.length === 2) {
      event.target.checked = false;
      return;
    }
    let updatedSdgs = [...selectedSdgs];
    if (checked) {
      if (!updatedSdgs.some(sdg => sdg === sdgId)) {
        updatedSdgs.push(sdgId);
      }
    } else {
      updatedSdgs = updatedSdgs.filter(sdg => sdg !== sdgId);
    }
    setSelectedSdgs(updatedSdgs);
  };

  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const checkAuthentication = async () => {
      const isAllowed = await checkAuth(['PARTICIPANT']);
      setAllowed(isAllowed);

      if (!isAllowed) {
        router.push('/participant-login');
      }
    };
    checkAuthentication();
  });

  interface City {
    city_id: number;
    name: string;
    province_id: number;
  }

  interface Province {
    province_id: number;
    name: string;
  }

  interface SelectedCity {
    cityName: string;
    provinceId: number;
  }
  const [provinceOptions, setProvinceOptions] = useState<Province[]>([]);
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<SelectedCity[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(11);

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

  return (
    <>
      <Head>
        <title>LEAD - Edit Instance</title>
      </Head>
      {allowed && <NavbarParticipant />}
      {instanceData &&
        <div className="d-flex flex-column min-vh-100">
          <div className="container-fluid w-sm-50 w-100 align-items-center text-center justify-content-center d-flex flex-column flex-grow-1" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <h1>Edit Instance</h1>
            <form onSubmit={handleSubmit} >
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="name" className="form-label">Nama</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="name" value={instanceData.name || ''} disabled />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="email" className="form-label">Email</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="email" value={instanceData.email || ''} disabled />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="established_month" className="form-label">Bulan Berdiri</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="established_month" value={instanceData.established_month || ''} disabled />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="established_year" className="form-label">Tahun Berdiri</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="established_year" value={instanceData.established_year || ''} disabled />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="type" className="form-label">Jenis Instansi</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="type" value={instanceData.type || ''} disabled />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="sector" className="form-label">Jenis Cluster</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="sector" value={instanceData.sector || ''} disabled />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="focus" className="form-label">Fokus Isu</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="focus" value={instanceData.focus || ''} disabled />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="total_beneficiaries" className="form-label">Total Penerima Manfaat</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="total_beneficiaries" disabled value={instanceData.total_beneficiaries || ''} />
                </div>
              </div>

              <h5><b>Alamat</b></h5>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="address_street" className="form-label">Nama Jalan</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="address_street" disabled value={instanceData.address_street || ''} />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="address_district" className="form-label">Nama Kecamatan</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="address_district" disabled value={instanceData.address_district || ''} />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="address_regency" className="form-label">Nama Kota/Kabupaten</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="address_regency" disabled value={instanceData.address_regency || ''} />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="address_province" className="form-label">Nama Provinsi</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="address_province" disabled value={instanceData.address_province || ''} />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="address_postal_code" className="form-label">Kode Pos</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="address_postal_code" disabled value={instanceData.address_postal_code || ''} />
                </div>
              </div>

              <h5><b>Social Media</b></h5>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="social_instagram" className="form-label">Instagram</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="social_instagram" value={instanceData.social_instagram || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="social_website" className="form-label">Website</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="social_website" value={instanceData.social_website || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="social_tiktok" className="form-label">Tiktok</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="social_tiktok" value={instanceData.social_tiktok || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <label htmlFor="social_youtube" className="form-label">Youtube</label>
                </div>
                <div className="col">
                  <input type="text" className="form-control" name="social_youtube" value={instanceData.social_youtube || ''} onChange={handleChange} />
                </div>
              </div>

              <h5><b>Pertanyaan Tambahan Terkait Instansi</b></h5>
              <div className="row mb-3 align-items-left">
                <div className="col-3">
                  <label htmlFor="name" className="form-label">Target Utama Penerima Manfaat</label>
                </div>
                <div className="col-9" style={{ textAlign: 'left' }}>
                  <fieldset>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="1" onChange={handleBeneficiaryChange} name="beneficiary_id" id="beneficiary_id_1" />
                      <label className="form-check-label" htmlFor="beneficiary_id_1">Anak-anak yang pergi dari rumah, tidak berhubungan lagi dengan orangtuanya, tunawisma, pekerja anak di jalan, tinggal dan tidur di jalan-jalan perkotaan. Anak-anak yatim piatu</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="2" onChange={handleBeneficiaryChange} name="beneficiary_id" id="beneficiary_id_2" />
                      <label className="form-check-label" htmlFor="beneficiary_id_2">Guru dan tenaga pendidik</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="3" onChange={handleBeneficiaryChange} name="beneficiary_id" id="beneficiary_id_3" />
                      <label className="form-check-label" htmlFor="beneficiary_id_3">Anak-anak dan remaja di daerah tertinggal, terdepan, dan terluar maupun di kota</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="4" onChange={handleBeneficiaryChange} name="beneficiary_id" id="beneficiary_id_4" />
                      <label className="form-check-label" htmlFor="beneficiary_id_4">Kelompok perempuan rentan (korban eksploitasi dan diskriminasi usia lanjut, disabilitas, dan kemiskinan)</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="5" onChange={handleBeneficiaryChange} name="beneficiary_id" id="beneficiary_id_5" />
                      <label className="form-check-label" htmlFor="beneficiary_id_5">Pelaku usaha mikro kecil dan menengah</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="6" onChange={handleBeneficiaryChange} name="beneficiary_id" id="beneficiary_id_6" />
                      <label className="form-check-label" htmlFor="beneficiary_id_6">Penyandang disabilitas</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="7" onChange={handleBeneficiaryChange} name="beneficiary_id" id="beneficiary_id_7" />
                      <label className="form-check-label" htmlFor="beneficiary_id_7">Kelompok tani, kelompok nelayan, dan buruh pabrik</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="8" onChange={handleBeneficiaryChange} name="beneficiary_id" id="beneficiary_id_8" />
                      <label className="form-check-label" htmlFor="beneficiary_id_8">Pasien kesehatan (penderita tuberkulosis, stunting, malaria, dan lainnya)</label>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="row mb-3 align-items-left">
                <div className="col-3">
                  <label htmlFor="name" className="form-label">Apakah Instansi memiliki sumber pendanaan tetap?
                    <span className='small'>
                      <i>Sumber pendanaan tetap yang dimaksud merujuk pada sumber-sumber pendanaan yang dianggap relatif stabil dan dapat diandalkan dalam jangka waktu tertentu. Sumber pendanaan tetap cenderung memberikan kepastian keuangan kepada instansi, setidaknya untuk periode waktu tertentu dalam menjalankan program</i>
                    </span>
                  </label>
                </div>
                <div className="col-9" style={{ textAlign: 'left' }}>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="stable_fund_source" id="eligible-yes" value="Ya" onChange={handleChange} />
                    <label className="form-check-label" htmlFor="eligible-yes">Ya</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="stable_fund_source" id="eligible-no" value="Tidak" onChange={handleChange} />
                    <label className="form-check-label" htmlFor="eligible-no">Tidak</label>
                  </div>
                </div>
              </div>
              <div className="row mb-3 align-items-left">
                <div className="col-3">
                  <label htmlFor="name" className="form-label">Sumber Pendanaan Instansi</label>
                </div>
                <div className="col-9" style={{ textAlign: 'left' }}>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="1" onChange={handleFundSourceChange} name="fund_sources" id="fund_sources_1" />
                    <label className="form-check-label" htmlFor="fund_sources_1">Perusahaan</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="2" onChange={handleFundSourceChange} name="fund_sources" id="fund_sources_2" />
                    <label className="form-check-label" htmlFor="fund_sources_2">Pemerintah</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="3" onChange={handleFundSourceChange} name="fund_sources" id="fund_sources_3" />
                    <label className="form-check-label" htmlFor="fund_sources_3">Yayasan swasta</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="4" onChange={handleFundSourceChange} name="fund_sources" id="fund_sources_4" />
                    <label className="form-check-label" htmlFor="fund_sources_4">Organisasi internasional</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="5" onChange={handleFundSourceChange} name="fund_sources" id="fund_sources_5" />
                    <label className="form-check-label" htmlFor="fund_sources_5">Kerja sama atau kemitraan</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="6" onChange={handleFundSourceChange} name="fund_sources" id="fund_sources_6" />
                    <label className="form-check-label" htmlFor="fund_sources_6">Organisasi filantropi atau investasi sosial</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="7" onChange={handleFundSourceChange} name="fund_sources" id="fund_sources_7" />
                    <label className="form-check-label" htmlFor="fund_sources_7">Donasi internal atau anggota instansi</label>
                  </div>
                </div>
              </div>
              <div className="row mb-3 align-items-left">
                <div className="col-3">
                  <label htmlFor="name" className="form-label">Sustainable Development Goals
                    <span className='small'> <i>Maksimal 2</i></span>
                  </label>
                </div>
                <div className="col-9" style={{ textAlign: 'left' }}>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="1" onChange={handleSdgChange} name="sdg" id="sdg_1" />
                    <label className="form-check-label" htmlFor="sdg_1">Tanpa kemiskinan</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="2" onChange={handleSdgChange} name="sdg" id="sdg_2" />
                    <label className="form-check-label" htmlFor="sdg_2">Tanpa kelaparan</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="3" onChange={handleSdgChange} name="sdg" id="sdg_3" />
                    <label className="form-check-label" htmlFor="sdg_3">Kesehatan yang baik dan kesejahteraan</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="4" onChange={handleSdgChange} name="sdg" id="sdg_4" />
                    <label className="form-check-label" htmlFor="sdg_4">Pendidikan berkualitas</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="5" onChange={handleSdgChange} name="sdg" id="sdg_5" />
                    <label className="form-check-label" htmlFor="sdg_5">Kesetaraan gender</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="6" onChange={handleSdgChange} name="sdg" id="sdg_6" />
                    <label className="form-check-label" htmlFor="sdg_6">Air bersih dan sanitasi</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="7" onChange={handleSdgChange} name="sdg" id="sdg_7" />
                    <label className="form-check-label" htmlFor="sdg_7">Kesetaraan gender</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="8" onChange={handleSdgChange} name="sdg" id="sdg_8" />
                    <label className="form-check-label" htmlFor="sdg_8">Pertumbuhan ekonomi dan pekerjaan yang layak</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="9" onChange={handleSdgChange} name="sdg" id="sdg_9" />
                    <label className="form-check-label" htmlFor="sdg_9">Industri, inovasi, dan infrastruktur</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="10" onChange={handleSdgChange} name="sdg" id="sdg_10" />
                    <label className="form-check-label" htmlFor="sdg_10">Pengurangan kesenjangan</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="11" onChange={handleSdgChange} name="sdg" id="sdg_11" />
                    <label className="form-check-label" htmlFor="sdg_11">Keberlanjutan kota dan komunitas</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="12" onChange={handleSdgChange} name="sdg" id="sdg_12" />
                    <label className="form-check-label" htmlFor="sdg_12">Konsumsi dan produksi yang bertanggungjawab</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="13" onChange={handleSdgChange} name="sdg" id="sdg_13" />
                    <label className="form-check-label" htmlFor="sdg_13">Aksi terhadap iklim</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="14" onChange={handleSdgChange} name="sdg" id="sdg_14" />
                    <label className="form-check-label" htmlFor="sdg_14">Kehidupan bawah laut</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="15" onChange={handleSdgChange} name="sdg" id="sdg_15" />
                    <label className="form-check-label" htmlFor="sdg_15">Kehidupan di darat</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="16" onChange={handleSdgChange} name="sdg" id="sdg_16" />
                    <label className="form-check-label" htmlFor="sdg_16">Institusi peradilan yang kuat dan kedamaian</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="17" onChange={handleSdgChange} name="sdg" id="sdg_17" />
                    <label className="form-check-label" htmlFor="sdg_17">Kemitraan untuk mencapai tujuan</label>
                  </div>
                </div>
              </div>
              <div className="row mb-3 align-items-left">
                <label htmlFor="address_province" className="form-label col-3">Cakupan Area</label>
                <div className="col-9">
                  {selectedCities.map((city, index) => (
                    <div className="row mb-3" key={index}>
                      <label htmlFor={`address_province_${index}`}>Provinsi {index + 1}</label>
                      <select
                        value={selectedCities[index].provinceId}
                        onChange={(e) => {
                          const updatedCities = [...selectedCities];
                          updatedCities[index].provinceId = Number(e.target.value);
                          setSelectedCities(updatedCities);
                        }}
                        className="form-select"
                        name={`address_province_${index}`}
                        required
                      >
                        {provinceOptions.map((province) => (
                          <option key={province.province_id} value={province.province_id}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor={`address_city_${index}`}>Kota {index + 1}</label>
                      <select
                        value={selectedCities[index].cityName}
                        onChange={(e) => {
                          const updatedCities = [...selectedCities];
                          updatedCities[index].cityName = e.target.value;
                          setSelectedCities(updatedCities);
                        }}
                        className="form-select"
                        name={`address_city_${index}`}
                        required
                      >
                        {cityOptions.filter((city) => city.province_id === selectedCities[index].provinceId).map((city) => (
                          <option key={city.city_id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button className="btn btn-primary" onClick={(e) => {e.preventDefault(); setSelectedCities([...selectedCities, { cityName: 'KABUPATEN SIMEULUE', provinceId: selectedProvinceId }])}}>
                    Tambahkan Kota/Kabupaten Lain
                  </button>
                </div>
              </div>
              <div className="text-center mt-5">
                <p className="text-danger">Pastikan semua kolom (kecuali sosial media) telah terisi!</p>
                <button className="btn btn-primary w-25" type="submit">Simpan</button>
              </div>
            </form>
          </div>
        </div>}
    </>
  )
}

export default InstanceEdit;