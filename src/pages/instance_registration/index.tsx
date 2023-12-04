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
        pathname: '/instance_summary',
        query: registrationObject,
        });
    };
    return (
      <>
        <form onSubmit={handleSubmit}>
            <Head>
            <title>Pendaftaran Instansi</title>
            </Head>
            <div className="container d-flex flex-column gap-2 align-items-left justify-content-left vh-90">
                <h1>Daftar</h1>
                <h2>Email Pendaftar</h2>
                <div className="mb-3">
                    <label htmlFor="emailPendaftar" className="form-label"><h5>Email pendaftar</h5></label>
                    <p>Hasil copy dari pendaftaran akan dikirimkan ke email pendaftar</p>
                    <input type="text" className="form-control" name="emailPendaftar" placeholder="Email Pendaftar"/>
                </div>

                <h2>Profile Instansi</h2>
                <div className="mb-3">
                    <label htmlFor="namaInstansi" className="form-label"><h5>Nama Instansi</h5></label>
                    <input type="text" className="form-control" name="namaInstansi" placeholder="Nama Instansi"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="emailInstansi" className="form-label"><h5>Email Instansi</h5></label>
                    <input type="text" className="form-control" name="emailInstansi" placeholder="Email Instansi"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tanggalBerdiri" className="form-label"><h5>Bulan/Tahun Instansi</h5></label>
                    <input type="month" className="form-control" name="tanggalBerdiri"/>
                </div>


                <div className="row">
                    <div className="col">
                        <label htmlFor="jenisInstansi" className="form-label"><h5>Jenis Instansi</h5></label>
                        <select className="form-select" name="jenisInstansi">
                            <option selected>Pilih</option>
                            <option value="gerakan">Gerakan</option>
                            <option value="komunitas">Komunitas</option>
                            <option value="yayasan">Yayasan</option>
                        </select>
                    </div>
                    <div className="col">
                        <label htmlFor="jenisInstansi" className="form-label"><h5>Jenis Cluster</h5></label>
                        <select className="form-select" name="jenisCluster">
                            <option selected>Pilih</option>
                            <option value="pendidikan">Pendidikan</option>
                            <option value="kesehatan">Kesehatan</option>
                            <option value="lingkungan">Lingkungan</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="alamatKantor" className="form-label"><h5>Alamat Kantor</h5></label>
                    <input type="text" className="form-control" name="alamatKantor" placeholder="Alamat Kantor"/>
                </div>
                <div className="row">
                    <div className="col">
                        <label htmlFor="provinsiKantor" className="form-label"><h5>Provinsi</h5></label>
                        <select className="form-select" name="provinsiKantor">
                            <option selected>Pilih</option>
                            <option value="...">...</option>
                        </select>
                    </div>
                    <div className="col">
                        <label htmlFor="kotaKantor" className="form-label"><h5>Kota</h5></label>
                        <select className="form-select" name="kotaKantor">
                            <option selected>Pilih</option>
                            <option value="...">...</option>
                        </select>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="gambaranInstansi" className="form-label"><h5>Profil/Gambaran Instansi</h5></label>
                    <p>Jelaskan profil/gambaran instansi dalam 1 paragraf singkat</p>
                    <textarea className="form-control" name="gambaranInstansi" style={{ width: '550px', height: '100px' }}/>
                </div>

                <h2>Cakupan Instansi</h2>
                <h5>Cakupan Jangkauan</h5>
                <div className="row">
                    <div className="col">
                        <label htmlFor="provinsiJangkauan" className="form-label"><h5>Provinsi</h5></label>
                        <select className="form-select" name="provinsiJangkauan">
                            <option selected>Pilih</option>
                            <option value="...">...</option>
                        </select>
                    </div>
                    <div className="col">
                        <label htmlFor="kotaJangkauan" className="form-label"><h5>Kota</h5></label>
                        <select className="form-select" name="kotaJangkauan">
                            <option selected>Pilih</option>
                            <option value="...">...</option>
                        </select>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="jumlahPenerimaManfaat" className="form-label"><h5>Jumlah Penerima Manfaat</h5></label>
                    <p>Jumlah total seluruh penerima manfaat dari kegiatan yang dilakukan melalui program oleh instansi</p>
                    <input type="number" className="form-control" name="jumlahPenerimaManfaat" placeholder="Jumlah Penerima Manfaat"/>
                </div>
                {/* 3 pertanyaan dibawah input typenya apa */}
                <div className="mb-3">
                    <label htmlFor="targetPenerimaManfaat" className="form-label"><h5>Target Penerima Manfaat</h5></label>
                    <p>Jelaskan target sasaran program instansi</p>
                    <p>Contoh jawaban</p>
                    <p>Anak jalanan, Kepala keluarga, Pasien TBC, Gen Z, dst.</p>
                    <input type="text" className="form-control" name="targetPenerimaManfaat" placeholder="Target Penerima Manfaat"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="kotaTercakup" className="form-label"><h5>Kota Tercakup</h5></label>
                    <p>Tambahkan kabupaten dan/atau kota yang tercakup oleh instansi anda. Anda dapat menambahkan lebih dari satu kabupaten dan/atau kota</p>
                    <p>Contoh jawaban</p>
                    <p>Kabupaten Bandung, Kota Tebing Tinggi, Kota Gorontalo, dst.</p>
                    <input type="text" className="form-control" name="kotaTercakup" placeholder="Kota Tercakup"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="provinsiTercakup" className="form-label"><h5>Provinsi Tercakup</h5></label>
                    <p>Tambahkan provinsi yang tercakup oleh instansi anda. Anda dapat menambahkan lebih dari satu kabupaten dan/atau kota</p>
                    <p>Contoh jawaban</p>
                    <p>Provinsi Jawa Barat, Provinsi Sumatera Selatan, dst.</p>
                    <input type="text" className="form-control" name="provinsiTercakup" placeholder="Provinsi Tercakup"/>
                </div>

                <h2>Berkas Instansi</h2>
                <div className="mb-3">
                    <label htmlFor="companyProfile" className="form-label"><h5>Unggah Berkas Company Profile</h5></label>
                    <p>Pastikan tautan dapat diakses secara publik</p>
                    <p>Syarat dan ketentuan company profile tercantum 
                        <Link href= "https://bit.ly/template-profil-lembaga-peserta-LEAD">disini</Link>
                    </p>
                    <input type="url" className="form-control" name="companyProfile" placeholder="Link Company Profile"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="proposalProgram" className="form-label"><h5>Unggah Berkas Proposal Program</h5></label>
                    <p>Pastikan tautan dapat diakses secara publik</p>
                    <input type="url" className="form-control" name="proposalProgram" placeholder="Link Proposal Program"/>
                </div>
                <button type="submit" className="btn btn-primary">Berikutnya</button>
            </div>
        </form>
      </>
    )
}