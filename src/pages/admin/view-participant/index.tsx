import NavbarAdmin from '@/components/Navbar/NavbarAdmin';
import { Modal, Button } from 'react-bootstrap'
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import React, { useState, useEffect } from 'react';
import { checkAuth } from '@/utils/auth';
import { useAsyncList } from '@react-stately/data';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination } from "@nextui-org/react";
import styles from '@/styles/admin-view-participant.module.css';

interface Participant {
  instanceName: string;
  participant_id: string;
  name: string;
  email: string;
  position: string;
  latest_education: string;
  education_background: string;
  focus: string;
  whatsapp_number: string;
  [column: string]: any;
}

const ParticipantListPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [allowed, setAllowed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<Participant | null>(null);
  const [participantToDelete, setParticipantToDelete] = useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  type LabelValuePairProps = {
    label: string;
    value: string;
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAllowed = await checkAuth(['ADMIN']);
      setAllowed(isAllowed);

      if (!isAllowed) {
        router.push('/admin-login');
      }
    };
    checkAuthentication();
  });

  let list = useAsyncList<Participant>({
    async load({ signal }) {
      let response = await fetch(`${backendUrl}/api/v1/participant`, {
        credentials: 'include',
        signal,
      });

      if (response.ok) {
        const res = await response.json();
        const participantsData = res.data?.participants || [];
        
        const participantsWithInstanceName = await Promise.all(participantsData.map(async (participant: { instance_id: any; }) => {
          const instanceResponse = await fetch(`${backendUrl}/api/v1/instance/${participant.instance_id}`, {
            credentials: 'include',
            signal,
          });

          if (instanceResponse.ok) {
            const instanceRes = await instanceResponse.json();
            const instanceName = instanceRes.data?.name || 'Unknown';
            return { ...participant, instanceName };
          } else {
            console.error('Error fetching instance for participant:', instanceResponse.status);
            return { ...participant };
          }
        }));

        setParticipants(participantsWithInstanceName);
        if (participantsWithInstanceName) {
          setIsLoading(false);
          return {
            items: participantsWithInstanceName
          };
        } else {
          return {
            items: []
          };
        }
      } else {
        return {
          items: []
        };
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: Participant, b: Participant) => {
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
      key: "instanceName",
      label: "NAMA INSTANSI",
    },
    {
      key: "name",
      label: "NAMA PESERTA",
    },
    {
      key: "email",
      label: "EMAIL",
    },
    {
      key: "position",
      label: "JABATAN",
    },
    {
      key: "whatsapp_number",
      label: "WHATSAPP",
    },
  ];

  const renderCell = React.useCallback((data: Participant, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof Participant];

    switch (columnKey) {
      case "name":
        return (
          <Link href={`/admin/view_participant/${data.participant_id}`}>{cellValue}</Link>
        );

      default:
        return cellValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(list.items.length / rowsPerPage);

  const listOfItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return list.items.slice(start, end);
  }, [page, list.items]);

  const handleDelete = async (participantId: string) => {
    const participantToDelete = participants.find(p => p.participant_id === participantId);
    setModalContent(participantToDelete || null);
    setShowModal(true);
    try {
      const response = await fetch(`${backendUrl}/api/v1/participant/${participantId}`, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // console.log(`Participant with ID ${participantId} deleted successfully`);
      } else {
        console.error('Failed to delete participant');
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
  };


  const confirmDelete = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/participant/${participantToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // console.log(`Participant with ID ${participantToDelete} deleted successfully`);
        const updatedParticipants = participants.filter(p => p.participant_id !== participantToDelete);
        setParticipants(updatedParticipants);
      } else {
        console.error('Failed to delete participant');
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
    setShowModal(false);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const LabelValuePair = ({ label, value }: LabelValuePairProps) => (
    <p style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ flex: '0 0 45%', fontWeight: 'bold' }}>{label}</span>
      <span style={{ flex: '0 0 50%' }}>: {value}</span>
    </p>
  );

  return (
    <>
      <Head>
        <title>LEAD - Lihat Daftar Peserta</title>
      </Head>
      {allowed && <NavbarAdmin />}
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
            {(item: Participant) => (
              <TableRow key={item.participant_id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody> :
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        }
      </Table>
      <Modal show={showModal} onHide={closeModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Apakah anda yakin ingin menghapus peserta?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent ? (
            <>
              <p>Nama Peserta: {modalContent.name}</p>
              <p>Email Peserta: {modalContent.email}</p>
            </>
          ) : (
            <p>Data dengan email tersebut tidak ditemukan</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ParticipantListPage;
