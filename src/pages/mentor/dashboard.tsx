import NavbarMentor from "@/components/Navbar/NavbarMentor";
import { checkAuth } from "@/utils/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Chip, ChipProps, Pagination } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import React from "react";
import Link from "next/link";
import styles from '@/styles/mentor-dashboard.module.css';
import InformationBanner from './../../components/InformationBanner';

interface ParticipantData {
  instance_id: number;
  name: string;
  email: string;
  type: string;
  status: string;
  [column: string]: any;
}

const MentorDashboard = () => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAllowed = await checkAuth(['MENTOR']);
      setAllowed(isAllowed);

      if (!isAllowed) {
        router.push('/mentor-login');
      }
    };
    checkAuthentication();
  });

  let list = useAsyncList<ParticipantData>({
    async load({ signal }) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      let res = await fetch(`${backendUrl}/api/v1/instance`, {
        method: 'GET',
        credentials: 'include',
        signal,
      });
      if (res.ok){
        let json = await res.json();
        setIsLoading(false);
        return {
          items: json.data,
        };
      } else {
        return {
          items: []
        };
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: ParticipantData, b: ParticipantData) => {
          let first = a[sortDescriptor.column as string];
          let second = b[sortDescriptor.column as string];
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const columns = [
    {
      key: "name",
      label: "NAMA INSTANSI",
    },
    {
      key: "email",
      label: "EMAIL",
    },
    {
      key: "type",
      label: "TIPE",
    },
    {
      key: "status",
      label: "STATUS",
    },
  ];

  const statusColorMap: Record<string, ChipProps["color"]> = {
    Lolos: "success",
    Ditolak: "danger",
    Wawancara: "warning",
    Menunggu: "secondary",
  };

  const renderCell = React.useCallback((data: ParticipantData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof ParticipantData];

    switch (columnKey) {
      case "name":
        return (
          <Link href={`/instance/${data.instance_id}`}>{cellValue}</Link>
        );

      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[data.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );

      default:
        return cellValue;
    }
  }, []);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(list.items.length / rowsPerPage);

  const listOfItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return list.items.slice(start, end);
  }, [page, list.items]);

  return (
    <>
      <Head>
        <title>LEAD - Dashboard Mentor</title>
      </Head>
      {allowed && <NavbarMentor />}
      <InformationBanner />
      <div className="d-flex flex-column container-fluid p-4">
        <h1 className="mb-3">Data Pendaftar</h1>
        <Table sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort} isStriped aria-label="participant list table" bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
                className={styles.removePadding}
              />
            </div>
          }>
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key} allowsSorting allowsResizing>{column.label}</TableColumn>}
          </TableHeader>
          {list.items.length > 0 ?
            <TableBody items={listOfItems}
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." />}>
              {(item: ParticipantData) => (
                <TableRow key={item.instance_id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody> :
            <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
          }
        </Table>
      </div>
    </>
  )
}

export default MentorDashboard;