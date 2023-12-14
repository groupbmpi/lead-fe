import { useRegistration } from '@/contexts/RegistrationContext';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const SummaryRegistration = () => {
  const { userData, setUserData } = useRegistration();
  const router = useRouter();
  const [confirmedData, setConfirmedData] = useState(false);
  const [confirmedConcept, setConfirmedConcept] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  type LabelValuePairProps = {
    label: string;
    value: string;
  };

  useEffect(() => {
    if (!userData || Object.keys(userData).length === 0) {
      router.push('/registration/instance');
    }
  }, [userData, router]);

  useEffect(() => {
    setButtonDisabled(!(confirmedData && confirmedConcept && userData.namaPeserta1));
  }, [confirmedData, confirmedConcept, userData.namaPeserta1]);

  const handleConfirmationDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmedData(e.target.checked);
  };

  const handleConfirmationConceptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmedConcept(e.target.checked);
  };

  function translateNumberToMonthName(monthNumber: string) {
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const index = parseInt(monthNumber) - 1;
    return monthNames[index];
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/');
  };
  const handleButtonClick = async () => {
    if (confirmedData && confirmedConcept && userData.namaPeserta1) {
      const parts = userData.tanggalBerdiri.split("-");
      userData.established_year = parts[0];
      userData.established_month = translateNumberToMonthName(parts[1]);
      const participants = [];
      participants.push({
        name: userData.namaPeserta1,
        position: userData.posisiPeserta1,
        latest_education: userData.pendidikanPeserta1,
        education_background: userData.jurusanPeserta1,
        focus: userData.fokusIsuPeserta1,
        whatsapp_number: userData.whatsappPeserta1,
        email: userData.emailPeserta1,
        joining_reason: userData.alasanPeserta1,
        url_id_card: userData.ktpPeserta1,
        url_cv: userData.cvPeserta1,
        confirmation_1: userData.miniTrainingPeserta1,
        confirmation_2: userData.initMentoringPeserta1,
        confirmation_3: userData.pendampinganPeserta1
      })
      if (userData.namaPeserta2) {
        participants.push({
          name: userData.namaPeserta2,
          position: userData.posisiPeserta2,
          latest_education: userData.pendidikanPeserta2,
          education_background: userData.jurusanPeserta2,
          focus: userData.fokusIsuPeserta2,
          whatsapp_number: userData.whatsappPeserta2,
          email: userData.emailPeserta2,
          joining_reason: userData.alasanPeserta2,
          url_id_card: userData.ktpPeserta2,
          url_cv: userData.cvPeserta2,
          confirmation_1: userData.miniTrainingPeserta2,
          confirmation_2: userData.initMentoringPeserta2,
          confirmation_3: userData.pendampinganPeserta2
        })
      }

      // hardcode batch data
      userData.batch = "5";

      const combinedData = {
        ...userData,
        participants,
      };
      console.log(combinedData);
      try {
        const response = await fetch(`${backendUrl}/api/v1/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(combinedData),
        });
        if (response.ok) {
          const email = userData.email;
          const response = await fetch(`${backendUrl}/api/v1/register/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email}),
          });
          if (response.ok) {
            setShowModal(true);
          }
        }
      } catch (error) {
        console.error('Error registering:', error);
      }
    }
  };

  const LabelValuePairInstance = ({ label, value }: LabelValuePairProps) => (
    <p style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ flex: '0 0 40%' }}>{label}</span>
      <span style={{ flex: '0 0 50%' }}>: {value}</span>
    </p>
  );

  const LabelValuePair = ({ label, value }: LabelValuePairProps) => (
    <p style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ flex: '0 0 50%' }}>{label}</span>
      <span style={{ flex: '0 0 50%' }}>: {value}</span>
    </p>
  );

  const renderParticipant1Data = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <LabelValuePair label="Nama Peserta" value={userData.namaPeserta1} />
        <LabelValuePair label="Email Peserta" value={userData.emailPeserta1} />
        <LabelValuePair label="Posisi Peserta dalam Instansi" value={userData.posisiPeserta1} />
        <LabelValuePair label="Pendidikan Terakhir Peserta" value={userData.pendidikanPeserta1} />
        <LabelValuePair label="Jurusan Pendidikan Terakhir Peserta" value={userData.jurusanPeserta1} />
        <LabelValuePair label="Fokus Isu Peserta" value={userData.fokusIsuPeserta1} />
        <LabelValuePair label="No Whatsapp Peserta" value={userData.whatsappPeserta1} />
        <LabelValuePair label="Bersedia mengikuti Mini Training LEAD Indonesia?" value={userData.miniTrainingPeserta1 == '1' ? 'Ya, Saya bersedia' : 'Mungkin perlu rekan pengganti di hari tertentu'} />
        <LabelValuePair label="Bersedia mengikuti Initial Training LEAD Indonesia?" value={userData.initMentoringPeserta1 == '1' ? 'Ya, Saya bersedia' : 'Mungkin perlu rekan pengganti di hari tertentu'} />
        <LabelValuePair label="Bersedia mengikuti Pendampingan Intensif bersama Para Mentor LEAD Indonesia?" value={userData.pendampinganPeserta1 == '1' ? 'Ya, Saya bersedia' : 'Mungkin perlu rekan pengganti di hari tertentu'} />
        <Link className="btn btn-info text-white" href="/registration/participant-1">Ubah</Link>
      </div>
    );
  };

  const renderParticipant2Data = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <LabelValuePair label="Nama Peserta" value={userData.namaPeserta2} />
        <LabelValuePair label="Email Peserta" value={userData.emailPeserta2} />
        <LabelValuePair label="Posisi Peserta dalam Instansi" value={userData.posisiPeserta2} />
        <LabelValuePair label="Pendidikan Terakhir Peserta" value={userData.pendidikanPeserta2} />
        <LabelValuePair label="Jurusan Pendidikan Terakhir Peserta" value={userData.jurusanPeserta2} />
        <LabelValuePair label="Fokus Isu Peserta" value={userData.fokusIsuPeserta2} />
        <LabelValuePair label="No Whatsapp Peserta" value={userData.whatsappPeserta2} />
        <LabelValuePair label="Bersedia mengikuti Mini Training LEAD Indonesia?" value={userData.miniTrainingPeserta2 == '1' ? 'Ya, Saya bersedia' : 'Mungkin perlu rekan pengganti di hari tertentu'} />
        <LabelValuePair label="Bersedia mengikuti Initial Training LEAD Indonesia?" value={userData.initMentoringPeserta2 == '1' ? 'Ya, Saya bersedia' : 'Mungkin perlu rekan pengganti di hari tertentu'} />
        <LabelValuePair label="Bersedia mengikuti Pendampingan Intensif bersama Para Mentor LEAD Indonesia?" value={userData.pendampinganPeserta2 == '1' ? 'Ya, Saya bersedia' : 'Mungkin perlu rekan pengganti di hari tertentu'} />
        <Link className="btn btn-info text-white" href="/registration/participant-2">Ubah</Link>
      </div>
    );
  };

  const fullAddress = `${userData.address_street}, ${userData.address_village}, ${userData.address_district}, ${userData.address_regency}, ${userData.address_province}, ${userData.address_postal_code}`;

  return (
    <>
      <Head>
        <title>LEAD - Ringkasan Pendaftaran</title>
      </Head>
      <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <h2>Ringkasan</h2>
        <hr />
        <h3>Instansi</h3>
        <hr />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <LabelValuePairInstance label="Nama Instansi" value={userData.name} />
          <LabelValuePairInstance label="Email Instansi" value={userData.email} />
          <LabelValuePairInstance label="Tahun/Bulan Berdiri Instansi" value={userData.tanggalBerdiri} />
          <LabelValuePairInstance label="Jenis Instansi" value={userData.type} />
          <LabelValuePairInstance label="Jenis Cluster" value={userData.sector} />
          <LabelValuePairInstance label="Fokus Isu" value={userData.focus} />
          <LabelValuePairInstance label="Alamat Lengkap" value={fullAddress} />
          <LabelValuePairInstance label="Cakupan Jangkauan Program" value={userData.area} />
          <LabelValuePairInstance label="Jumlah Penerima Manfaat" value={userData.total_beneficiaries} />
          <LabelValuePairInstance label="Instagram Instansi" value={userData.social_instagram} />
          <LabelValuePairInstance label="Website Instansi" value={userData.social_website} />
          <LabelValuePairInstance label="Tiktok Instansi" value={userData.social_tiktok} />
          <LabelValuePairInstance label="Youtube Instansi" value={userData.social_youtube} />
          <LabelValuePairInstance label="Company Profile" value={userData.url_company_profile} />
          <LabelValuePairInstance label="Proposal Program" value={userData.url_program_proposal} />
          <LabelValuePairInstance label="Sumber Informasi LEAD Indonesia" value={userData.information_source} />
          <LabelValuePairInstance label="Pelatihan/Pengetahuan tentang Desain Program" value={userData.desain_program_training} />
          <LabelValuePairInstance label="Yang Diketahui tentang Desain Program" value={userData.desain_program_knowledge} />
          <LabelValuePairInstance label="Pelatihan/Pengetahuan tentang Sustainability" value={userData.sustainability_training} />
          <LabelValuePairInstance label="Yang Diketahui tentang Sustainability" value={userData.sustainability_knowledge} />
          <LabelValuePairInstance label="Pelatihan/Pengetahuan tentang Social Report" value={userData.social_report_training} />
          <LabelValuePairInstance label="Yang Diketahui tentang Social Report" value={userData.social_report_knowledge} />
          <LabelValuePairInstance label="Program Report" value={userData.url_program_report} />
          <LabelValuePairInstance label="Ekspektasi terhadap LEAD Indonesia" value={userData.expectation} />
          <LabelValuePairInstance label="Pertanyaan untuk LEAD Indonesia" value={userData.other_inquiries} />
          <Link className="btn btn-info text-white" href="/registration/instance">Ubah</Link>
        </div>
        <h3 style={{ marginTop: '20px' }}>Peserta</h3>
        <hr />
        <div className="row">
          <div className="col">
            <h5>Peserta I</h5>
            {userData.namaPeserta1 ? renderParticipant1Data() : (
              <div className="d-flex flex-column">
                <Link className="btn btn-primary" href="/registration/participant-1">Tambah</Link>
              </div>
            )}
          </div>
          <div className="col">
            <h5>Peserta II</h5>
            {userData.namaPeserta2 ? renderParticipant2Data() : (
              <div className="d-flex flex-column">
                <Link className="btn btn-primary" href="/registration/participant-2">Tambah</Link>
              </div>
            )}
          </div>
        </div>
        <div>
          <input
            type="checkbox"
            id="confirmData"
            name="confirmData"
            checked={confirmedData}
            onChange={handleConfirmationDataChange}
            className='me-1'
          />
          <label htmlFor="confirmData">Saya konfirmasi bahwa semua informasi yang saya berikan di atas adalah akurat dan terkini</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="confirmConcept"
            name="confirmConcept"
            checked={confirmedConcept}
            onChange={handleConfirmationConceptChange}
            className='me-1'
          />
          <label htmlFor="confirmConcept">Saya sudah membaca dan memahami
            <span> <Link href="https://bit.ly/LEADBCF-2023">Concept Note</Link></span>
          </label>
        </div>
        <button className="btn btn-primary" onClick={handleButtonClick} disabled={buttonDisabled}>
          Daftar
        </button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Pendaftaran Berhasil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Cek email instansi anda untuk informasi berikutnya</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SummaryRegistration;