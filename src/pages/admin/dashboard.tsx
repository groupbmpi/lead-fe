import InformationBanner from "@/components/InformationBanner";
import NavbarAdmin from "@/components/Navbar/NavbarAdmin";
import { checkAuth } from "@/utils/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAllowed = await checkAuth(['ADMIN', 'SUPERADMIN']);
      setAllowed(isAllowed);

      if (!isAllowed) {
        router.push('/admin-login');
      }
    };
    checkAuthentication();
  });

  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const participantDataDetails = ["position", "latest_education", "confirmation_1", "confirmation_2", "confirmation_3", "total"]
  async function fetchData(status: string, selectedData: string) {
    if (participantDataDetails.includes(selectedData)) {
      const response = await fetch(`${backendUrl}/api/v1/dashboard-summary?` + new URLSearchParams({
        status: status,
        include: "participant_data",
      }), {
        credentials: 'include',
      });
      const res = await response.json();
      return res.data;
    } else {
      const response = await fetch(`${backendUrl}/api/v1/dashboard-summary?` + new URLSearchParams({
        status: status,
        include: selectedData,
      }), {
        credentials: 'include',
      });
      const res = await response.json();
      console.log(res.data);
      return res.data;
    }
  }

  const [status, setStatus] = useState("all");
  const [selectedData, setSelectedData] = useState("type");
  const [chartData, setChartData] = useState<any>();
  useEffect(() => {
    fetchData(status, selectedData)
      .then((data) => {
        if (participantDataDetails.includes(selectedData)) {
          setChartData(transformDataForChart(data.participant_data));
        } else {
          setChartData(transformDataForChart(data));
        }
      })
      .then(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selectedData]);

  const chartDatas = {
    labels: [''],
    datasets: [
      {
        label: "Total",
        data: [''],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  function transformDataForChart(data: any) {

    if (selectedData === "total") {
      chartDatas.labels = ["Total Peserta"];
      chartDatas.datasets[0].data = [data.total];
    } else if (selectedData === "confirmation_1" || selectedData === "confirmation_2" || selectedData === "confirmation_3") {
      for (const key in data[selectedData]) {
        if (key === "1") {
          chartDatas.labels.push("Ya, tentu saya bersedia");
        } else if (key === "2") {
          chartDatas.labels.push("Mungkin perlu rekan pengganti di hari tertentu");
        }
        const info = data[selectedData][key];
        chartDatas.datasets[0].data.push(info.total);
      }
    } else {
      for (const key in data[selectedData]) {
        const info = data[selectedData][key];
        chartDatas.labels.push(key);
        chartDatas.datasets[0].data.push(info.total);
      }
    }
    return chartDatas;
  }

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "Lolos", label: "Lolos" },
    { value: "Wawancara", label: "Wawancara" },
    { value: "Menunggu", label: "Menunggu" },
    { value: "Ditolak", label: "Ditolak" },
  ];

  function getLabelByValue(value: string, options: any[]): string | undefined {
    const foundOption = options.find(option => option.value === value);
    return foundOption ? foundOption.label : foundOption.value;
  }
  const selectedDataOptions = [
    { value: "type", label: "Tipe" },
    { value: "sector", label: "Sektor" },
    { value: "established_year", label: "Tahun Berdiri" },
    { value: "area", label: "Cakupan Wilayah" },
    { value: "address_province", label: "Provinsi Tercakup" },
    { value: "address_regency", label: "Kota Tercakup" },
    { value: "beneficiaries", label: "Target Penerima Manfaat" },
    { value: "fund_source", label: "Sumber Pendanaan" },
    { value: "position", label: "Jabatan Peserta" },
    { value: "latest_education", label: "Pendidikan Terakhir Peserta" },
    { value: "confirmation_1", label: "Kesediaan Mini Training" },
    { value: "confirmation_2", label: "Kesediaan Initial Mentoring" },
    { value: "confirmation_3", label: "Kesediaan Pendampingan Intensif" },
    { value: "information_source", label: "Pusat Informasi LEAD" },
    { value: "desain_program_training", label: "Pengetahuan Desain Program" },
    { value: "total", label: "Total Peserta" },
  ];

  return (
    <>
      <Head>
        <title>LEAD - Dashboard Admin</title>
      </Head>
      {allowed && <NavbarAdmin />}
      <InformationBanner />
      <div className="p-4">
        <h1 className="text-center">Dashboard Summary</h1>
        <div className="d-flex flex-column container-fluid w-75">
          <div className="d-flex flex-column container-fluid p-4 w-75">
            {loading &&
              <div className="d-flex align-items-center justify-content-center">
                <Spinner />
              </div>
            }
            <div className="d-flex mb-4 justify-content-between">
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  {status === "all" ? "Semua" : status}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {statusOptions.map((option) => (
                    <Dropdown.Item
                      key={option.value}
                      active={status === option.value}
                      onClick={() => setStatus(option.value)}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="ml-3">
                <Dropdown.Toggle variant="primary">
                  {selectedData === "type" ? "Tipe" : getLabelByValue(selectedData, selectedDataOptions)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {selectedDataOptions.map((option) => (
                    <Dropdown.Item
                      key={option.value}
                      active={selectedData === option.value}
                      onClick={() => setSelectedData(option.value)}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {!loading && <Pie data={chartData} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard;