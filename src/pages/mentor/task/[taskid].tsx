import NavbarMentor from '@/components/Navbar/NavbarMentor';
import { checkAuth, getId } from '@/utils/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface Task {
  task_id: number;
  mentor_id: number;
  title: string;
  description: string;
  deadline: string;
}

interface TaskSubmission {
  submission_id: number;
  task_id: number;
  participant_id: number;
  submission_url: string;
  feedback: string | '';
  status: string;
  submission_time: string;
}

interface Participant {
  participant_id: number;
  instance_id: number;
  name: string;
}

const MentorTaskPage = () => {
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();
  const taskId = router.query.taskid;
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

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [task, setTask] = useState<Task>();
  useEffect(() => {
    async function getTask(): Promise<Task> {
      const response = await fetch(`${backendUrl}/api/v1/task/${taskId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      return data;
    }
    (async () => {
      try {
        const taskResponse = await getTask();
        if (taskResponse.mentor_id !== undefined && taskResponse.mentor_id !== getId()) {
          router.push('/mentor/task')
        }
        setTask(taskResponse);
      } catch (error) {
        console.error(error);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>([]);
  useEffect(() => {
    async function getTaskSubmissions(): Promise<any> {
      const response = await fetch(`${backendUrl}/api/v1/taskSubmission/task/${taskId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      return data;
    }
    (async () => {
      try {
        const taskSubmissionsResponse = await getTaskSubmissions();
        if (taskSubmissionsResponse.submissions) {
          setTaskSubmissions(taskSubmissionsResponse.submissions);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const [participants, setParticipants] = useState<Participant[]>([]);
  useEffect(() => {
    async function getParticipants(): Promise<any> {
      const response = await fetch(`${backendUrl}/api/v1/participant?mentor_id=${getId()}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      return data;
    }
    (async () => {
      try {
        const ParticipantsResponse = await getParticipants();
        setParticipants(ParticipantsResponse.data.participants);
      } catch (error) {
        console.error(error);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const isSubmitted = (participantId: number) => {
    return taskSubmissions.some((submission) => submission.participant_id === participantId);
  };

  const isLate = (submission: TaskSubmission) => {
    const submissionTime = new Date(submission.submission_time);
    const deadline = task ? new Date(task.deadline) : new Date();
    return submissionTime > deadline;
  };

  const isReviewed = (submission: TaskSubmission) => {
    return submission.feedback !== null;
  };

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);

  const handleOpenFeedbackModal = (submission: TaskSubmission) => {
    setSelectedSubmission(submission);
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedSubmission(null);
  };

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedSubmission?.submission_id) {
      setSelectedSubmission({ ...selectedSubmission, feedback: event.target.value });
    }
  };

  const handleSubmitFeedback = async () => {
    if (selectedSubmission !== null && selectedSubmission.feedback !== '' && selectedSubmission.feedback !== null) {
      const { submission_id, ...restOfSubmission } = selectedSubmission;
      console.log(restOfSubmission);
      try {
        const response = await fetch(`${backendUrl}/api/v1/taskSubmission/${submission_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(restOfSubmission),
          credentials: 'include',
        });

        if (response.ok) {
          const existingSubmissionIndex = taskSubmissions.findIndex((submission) => submission.submission_id === submission_id);

          if (existingSubmissionIndex !== -1) {
            const updatedSubmission = {
              ...taskSubmissions[existingSubmissionIndex],
              ...restOfSubmission,
            };

            const updatedTaskSubmissions = [...taskSubmissions];
            updatedTaskSubmissions[existingSubmissionIndex] = updatedSubmission;

            setTaskSubmissions(updatedTaskSubmissions);
          } else {
            console.error('Error submitting feedback.');
          }
          handleCloseFeedbackModal();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <>
      <Head>
        <title>LEAD - Task Details</title>
      </Head>
      {allowed && <NavbarMentor />}
      <div className="d-flex flex-column container-fluid p-4">
        <h1>{task?.title}</h1>
        <h4>{task?.description}</h4>
        <h5>Deadline: {task && new Date(task.deadline).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}</h5>
        <table className="table table-striped table-hover table-responsive">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nama Peserta</th>
              <th scope="col">Status Pengumpulan</th>
              <th scope="col">Keterlambatan</th>
              <th scope="col">Status Review</th>
              <th scope="col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {!task && <tr><td colSpan={6}>Loading task information...</td></tr>}
            {!taskSubmissions && <tr><td colSpan={6}>Loading task submissions...</td></tr>}
            {!participants && <tr><td colSpan={6}>Loading participants...</td></tr>}
            {task && taskSubmissions && participants && participants.map((participant, index) => {
              const submitted = isSubmitted(participant.participant_id);
              const submission = taskSubmissions.find((submission) => submission.participant_id === participant.participant_id);
              const late = submitted && submission ? isLate(submission) : false;
              const reviewed = submitted && submission ? isReviewed(submission) : false;

              let statusText = submitted ? "Submitted" : "Not Submitted";
              let reviewText = reviewed ? "Sudah direview" : "Belum direview";

              return (
                <tr key={participant.participant_id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <a href={`/instance/${participant.instance_id}`}>{participant.name}</a>
                  </td>
                  <td>{statusText}</td>
                  <td>{late ? "Ya" : "Tidak"}</td>
                  <td>{reviewText}</td>
                  <td>
                    {submission ? (
                      <button
                        type="button"
                        className={`btn btn-sm btn-primary me-2 ${submitted ? "" : "disabled"}`}
                        onClick={() => handleOpenFeedbackModal(submission)}
                      >
                        Detail
                      </button>
                    ) : (
                      <button type="button" className="btn btn-sm btn-secondary me-2" disabled>
                        Detail
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedSubmission &&
        <Modal show={showFeedbackModal} onHide={handleCloseFeedbackModal} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Detail Pengumpulan Tugas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="submissionUrl">Tautan Submission:</label>
                <p><a href={selectedSubmission.submission_url}>{selectedSubmission.submission_url}</a></p>
              </div>
              <div className="mb-3">
                <label htmlFor="submissionTime">Waktu Submission:</label>
                <p>{new Date(selectedSubmission.submission_time).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="feedback">Feedback:</label>
                <textarea className="form-control" id="feedback" rows={3}
                  value={selectedSubmission.feedback}
                  onChange={handleFeedbackChange}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseFeedbackModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmitFeedback}>
              Simpan Feedback
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  );
}

export default MentorTaskPage;