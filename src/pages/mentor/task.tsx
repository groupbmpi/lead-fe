import NavbarMentor from "@/components/Navbar/NavbarMentor";
import { checkAuth, getId } from "@/utils/auth";
import moment from "moment";
import { Moment } from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

interface Task {
  task_id: number;
  mentor_id: number;
  title: string;
  description: string;
  deadline: string;
}

const MentorTask = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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


  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    async function getTasks(): Promise<Task[]> {
      const response = await fetch(`${backendUrl}/api/v1/task`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      return data;
    }
    (async () => {
      try {
        const tasks = await getTasks();
        const filteredTasks = tasks.filter((task) => task.mentor_id === getId());
        setTasks(filteredTasks);
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const [modalContent, setModalContent] = useState<string>('');
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteClick = (title: string, taskId: number) => {
    setModalContent(`Apakah anda yakin ingin menghapus tugas "${title}"?`);
    setSelectedTaskId(taskId);
    setShowModal(true);
  };

  const handleDeleteTask = () => {
    if (selectedTaskId !== null) {
      fetch(`${backendUrl}/api/v1/task/${selectedTaskId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            console.error('Error deleting task.');
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
      setShowModal(false);
    }

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task> | null>(null);
  const handleEditClick = (task: Task) => {
    setEditedTask(task);
    setShowEditModal(true);
  };

  const handleEditTask = async () => {
    if (editedTask !== null) {
      const editedTaskData = {
        title: editedTask.title,
        description: editedTask.description,
        deadline: editedTask.deadline,
      };

      if (!Object.values(editedTaskData).some((field) => field === null)) {
        if (!Object.values(editedTaskData).some((field) => field === "")) {
          if (!Object.values(editedTaskData).some((field) => field === undefined)) {
            try {
              const response = await fetch(`${backendUrl}/api/v1/task/${editedTask.task_id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedTaskData),
                credentials: 'include',
              });

              if (response.ok) {
                setShowEditModal(false);
              } else {
                console.error('Error updating task.');
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTask({ ...editedTask, title: event.target.value });
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTask({ ...editedTask, description: event.target.value });
  };

  const handleDeadlineChange = (value: string | Moment) => {
    if (typeof value !== 'string') {
      setEditedTask({ ...editedTask, deadline: value.toDate().toISOString() });
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [addedTask, setAddedTask] = useState<Partial<Task> | null>(null);
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddTask = async () => {
    if (addedTask !== null) {
      const addedTaskData = {
        mentor_id: getId(),
        title: addedTask.title,
        description: addedTask.description,
        deadline: addedTask.deadline,
      };

      if (!Object.values(addedTaskData).some((field) => field === null)) {
        if (!Object.values(addedTaskData).some((field) => field === "")) {
          if (!Object.values(addedTaskData).some((field) => field === undefined)) {
            try {
              const response = await fetch(`${backendUrl}/api/v1/task`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(addedTaskData),
                credentials: 'include',
              });

              if (response.ok) {
                setAddedTask(null);
                setShowAddModal(false);
              } else {
                console.error('Error adding task.');
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddedTask({ ...addedTask, title: event.target.value });
  };

  const handleAddDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAddedTask({ ...addedTask, description: event.target.value });
  };

  const handleAddDeadlineChange = (value: string | Moment) => {
    if (typeof value !== 'string') {
      setAddedTask({ ...addedTask, deadline: value.toDate().toISOString() });
    }
  };

  return (
    <>
      <Head>
        <title>LEAD - Task</title>
      </Head>
      {allowed && <NavbarMentor />}
      <div className="d-flex flex-column container-fluid p-4">
        <h1 className="mb-3">Tugas</h1>
        <button type="button" className="btn btn-outline-primary w-25" onClick={() => handleAddClick()}>Tambah Tugas Baru</button>
        <table className="table table-striped table-hover table-responsive">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Judul</th>
              <th scope="col">Deskripsi</th>
              <th scope="col">Deadline</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.task_id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <a href={`/mentor/task/${task.task_id}`}>{task.title}</a>
                </td>
                <td>{task.description}</td>
                <td>{new Date(task.deadline).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}</td>
                <td>
                  <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(task)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteClick(task.title, task.task_id)} type="button" className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Hapus Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent ? (
            <>
              <p>{modalContent}</p>
            </>
          ) : (
            <p>Unknown Error</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteTask}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={handleCloseEditModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tugas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <p>Pastikan semua kolom telah terisi</p>
              <label htmlFor="title" className="form-label">
                Judul
              </label>
              <input type="text" className="form-control" id="title"
                value={editedTask?.title ?? ''}
                onChange={handleTitleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Deskripsi
              </label>
              <textarea className="form-control" id="description"
                rows={3}
                value={editedTask?.description ?? ''}
                onChange={handleDescriptionChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="deadline" className="form-label">
                Deadline
              </label>
              <Datetime
                initialValue={moment(editedTask?.deadline).format("MM/DD/YYYY hh:mm A")}
                onChange={handleDeadlineChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddModal} onHide={handleCloseAddModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Tugas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <p>Pastikan semua kolom telah terisi</p>
              <label htmlFor="title" className="form-label">
                Judul
              </label>
              <input type="text" className="form-control" id="title"
                onChange={handleAddTitleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Deskripsi
              </label>
              <textarea className="form-control" id="description"
                rows={3}
                onChange={handleAddDescriptionChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="deadline" className="form-label">
                Deadline
              </label>
              <Datetime
                onChange={handleAddDeadlineChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MentorTask;