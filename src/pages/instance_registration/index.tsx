import { Console } from 'console';
import Head from 'next/head'
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
        pathname: '/instance_summary',
        query: registrationObject,
        });
    };
    return (
      <>
        <form onSubmit={handleSubmit}>
            <Head>
            <title>LEAD Indonesia</title>
            </Head>
            <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
                <h1>Daftar</h1>
                <h2>Email Pendaftar</h2>
                <h5>Email Pendaftar</h5>
                <p>Hasil copy dari pendaftaran akan dikirimkan ke email pendaftar</p>
                <input type="email" name="emailPendaftar"/>

                <h2>Profile Instansi</h2>
                <h5>Nama Instansi</h5>
                <input type="text" name="namaInstansi"/>
                <h5>Email Instansi</h5>
                <input type="text" name="emailInstansi"/>
                <h5>Bulan/Tahun Berdiri Instansi</h5>
                <input type="date" name="tanggalBerdiri"/>
                <div className="d-flex flex-row gap-5">
                    <div className="d-flex flex-column">
                        <h5>Jenis Instansi</h5>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" name="jenisInstansi">
                            <option selected>Pilih</option>
                            <option value="gerakan">Gerakan</option>
                            <option value="komunitas">Komunitas</option>
                            <option value="yayasan">Yayasan</option>
                        </select>
                    </div>
                    <div className="d-flex flex-column">
                        <h5>Jenis Cluster</h5>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" name="jenisCluster">
                            <option selected>Pilih</option>
                            <option value="pendidikan">Pendidikan</option>
                            <option value="kesehatan">Kesehatan</option>
                            <option value="lingkungan">Lingkungan</option>
                        </select>
                    </div>                
                </div>
                <h5>Alamat Lengkap Kantor</h5>
                <input type="text" name="alamatKantor"/>
                <div className="d-flex flex-row gap-5">
                    <div className="d-flex flex-column">
                        <h5>Provinsi</h5>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" name="provinsiKantor">
                            {/* not done */}
                            <option selected>Pilih</option>
                        </select>
                    </div>
                    <div className="d-flex flex-column">
                        <h5>Kota</h5>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" name="kotaKantor">
                            {/* not done */}
                            <option selected>Pilih</option>
                        </select>
                    </div>                
                </div>
                <h5>Jelaskan profil/gambaran instansi dalam 1 paragraf singkat</h5>
                <input type="text" name="gambaranInstansi"/>

                <h2>Cakupan Instansi</h2>
                <h5>Cakupan Jangkauan</h5>
                <div className="d-flex flex-row gap-5">
                    <div className="d-flex flex-column">
                        <h5>Provinsi</h5>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" name="provinsiJangkauan">
                            {/* not done */}
                            <option selected>Pilih</option>
                        </select>
                    </div>
                    <div className="d-flex flex-column">
                        <h5>Kota</h5>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" name="kotaJangkauan">
                            {/* not done */}
                            <option selected>Pilih</option>
                        </select>
                    </div>                
                </div>
                <h5>Jumlah Penerima Manfaat</h5>
                <p>Jumlah total seluruh penerima manfaat dari kegiatan yang dilakukan melalui program oleh instansi</p>
                <input type="number" name="penerimaManfaat"/>
                {/* 3 pertanyaan dibawah input typenya apa */}
                <h5>Target Penerima Manfaat</h5>
                <p>Jelaskan target sasaran program instansi</p>
                <p>Contoh jawaban</p>
                <p>Anak jalanan, Kepala keluarga, Pasien TBC, Gen Z, dst.</p>
                <input type="text" name="targetPenerimaManfaat"/>
                <h5>Kabupaten/Kota yang Tercakup</h5>
                <p>Tambahkan kabupaten dan/atau kota yang tercakup oleh instansi anda. Anda dapat menambahkan lebih dari satu kabupaten dan/atau kota</p>
                <p>Contoh jawaban</p>
                <p>Kabupaten Bandung, Kota Tebing Tinggi, Kota Gorontalo, dst.</p>
                <input type="text" name="kotaTercakup"/>
                <h5>Provinsi yang tercakup</h5>
                <p>Tambahkan provinsi yang tercakup oleh instansi anda. Anda dapat menambahkan lebih dari satu kabupaten dan/atau kota</p>
                <p>Contoh jawaban</p>
                <p>Anak jalanan, Kepala keluarga, Pasien TBC, Gen Z, dst.</p>
                <input type="text" name="provinsiTercakup"/>

                <h2>Berkas Instansi</h2>
                <h5>Unggah Berkas Company Profile</h5>
                <p>Pastikan tautan dapat diakses secara publik</p>
                <p>Syarat dan ketentuan company profile tercantum <a href= "https://bit.ly/template-profil-lembaga-peserta-LEAD">disini</a></p>
                <input type="url" name="companyProfile"/>
                <h5>Unggah Berkas Proposal Program</h5>
                <p>Pastikan tautan dapat diakses secara publik</p>
                <input type="url" name="proposalProgram"/>

                <button type="submit" className="btn btn-primary">Berikutnya</button>
            </div>
        </form>
      </>
    )
}