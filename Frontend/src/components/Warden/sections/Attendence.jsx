import React, { useEffect, useState } from "react";
import axios from "axios";

function Attendance({isDarkTheme}) {
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);

   // Example flag for theme

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/api/users?role=student`);
        setStudents(response.data);
        const initialStatus = response.data.reduce((acc, student) => {
          acc[student._id] = "";
          return acc;
        }, {});
        setAttendanceStatus(initialStatus);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const checkAttendanceToday = async () => {
      const date = new Date().toISOString().split("T")[0];
      try {
        const attendanceChecks = await Promise.all(
          students.map((student) =>
            axios.get(`${window.location.origin}/api/attendance/today/${student._id}`)
          )
        );

        const hasSubmitted = attendanceChecks.some((response) => response.data.submitted);
        setIsSubmittedToday(hasSubmitted);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (students.length > 0) {
      checkAttendanceToday();
    }
  }, [students]);

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittedToday) {
      alert("Attendance for today has already been taken.");
      return;
    }

    const date = new Date().toISOString().split("T")[0];

    try {
      await Promise.all(
        students.map(async (student) => {
          const status = attendanceStatus[student._id];
          const existingAttendanceResponse = await axios.get(
            `${window.location.origin}/api/attendance/${student._id}/${date}`
          );
          const existingAttendance = existingAttendanceResponse.data;

          if (existingAttendance.length === 0) {
            await axios.post(`${window.location.origin}/api/attendance`, {
              studentId: student._id,
              date,
              status,
            });
          }
        })
      );

      alert("Attendance recorded successfully!");
      setIsSubmittedToday(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = async () => {
    const date = new Date().toISOString().split("T")[0];
    try {
      await Promise.all(
        students.map(async (student) => {
          const existingAttendanceResponse = await axios.get(
            `${window.location.origin}/api/attendance/${student._id}/${date}`
          );
          const existingAttendance = existingAttendanceResponse.data;
          if (existingAttendance.length > 0) {
            setAttendanceStatus((prev) => ({
              ...prev,
              [student._id]: existingAttendance[0].status,
            }));
          }
        })
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateAttendance = async () => {
    const date = new Date().toISOString().split("T")[0];
    try {
      await Promise.all(
        students.map(async (student) => {
          const existingAttendanceResponse = await axios.get(
            `${window.location.origin}/api/attendance/${student._id}/${date}`
          );
          const existingAttendance = existingAttendanceResponse.data;

          if (existingAttendance.length > 0) {
            const attendanceId = existingAttendance[0]._id;
            await axios.put(`${window.location.origin}/api/attendance/${attendanceId}`, {
              status: attendanceStatus[student._id],
            });
          }
        })
      );

      alert("Attendance records updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const darkThemeStyles = {
    container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white",
    header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",
    table: "w-full text-left text-sm  border-collapse rounded-lg shadow-lg",
    rowHover: "hover:bg-gray-700",
    date: "px-6 py-4 border-b border-gray-700",
    statusPresent: "text-green-400",
    statusAbsent: "text-red-400",
    loading: "text-cyan-400 animate-pulse",
    error: "text-red-500",
  };

  const lightThemeStyles = {
    container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
    header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
    table: "w-full text-left text-sm  border-collapse rounded-lg shadow-lg",
    rowHover: "hover:bg-blue-100",
    date: "px-6 py-4 border-b border-gray-300",
    statusPresent: "text-green-700",
    statusAbsent: "text-red-700",
    loading: "text-blue-600 animate-pulse",
    error: "text-red-600",
  };

  const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

  if (loading) {
    return <p className={`text-center ${theme.loading}`}>Loading students...</p>;
  }

  if (error) {
    return <p className={`text-center ${theme.error}`}>{error}</p>;
  }

  return (
     <div  className={`p-10 lg:p-6 h-screen lg:w-full w-screen overflow-hidden ${theme.container}`}>
      <div className="max-w-4xl mx-auto backdrop-blur-md bg-opacity-20 flex flex-col lg:block   justify-center items-center  rounded-2xl p-6 shadow-xl">
        <h2 className={theme.header}>Take Attendance</h2>
        {isSubmittedToday && (
          <div className="mb-4 text-green-500 text-center">
            <strong>Today's attendance has already been taken.</strong>
          </div>
        )}
        <form className="" onSubmit={handleAttendanceSubmit}>
          <table className={`w-full ${theme.table}`}>
            <thead>
              <tr className="text-lg">
                <th className={`${theme.date}`}>Student</th>
                <th className={`${theme.date}`}>Roll Number</th>
                <th className={`${theme.date}`}>Room No.</th>
                <th className={`${theme.date}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className={`transition duration-300 ease-in-out ${theme.rowHover}`}
                >
                  <td className={theme.date}>{student.name}</td>
                  <td className={theme.date}>{student.rollNumber}</td>
                  <td className={theme.date}>{student.roomNumber}</td>
                  <td className={theme.date}>
                    <label className="inline-flex items-center text-white">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        value="Present"
                        checked={attendanceStatus[student._id] === "Present"}
                        onChange={() =>
                          setAttendanceStatus((prev) => ({
                            ...prev,
                            [student._id]: "Present",
                          }))
                        }
                        className="form-radio text-green-500"
                      />
                      <span
                        className={`ml-2 ${
                          isDarkTheme ? "text-white" : "text-gray-800"
                        } transition-all duration-100`}
                      >
                        Present
                      </span>
                    </label>
                    <label className="inline-flex items-center  text-white lg:ml-4">
                      <input
                        type="radio"
                        name={`attendance-${student._id}`}
                        value="Absent"
                        checked={attendanceStatus[student._id] === "Absent"}
                        onChange={() =>
                          setAttendanceStatus((prev) => ({
                            ...prev,
                            [student._id]: "Absent",
                          }))
                        }
                        className="form-radio text-red-500"
                      />
                      <span
                        className={`ml-2 ${
                          isDarkTheme ? "text-white" : "text-gray-800"
                        } transition-all duration-100`}
                      >
                        Absent
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center mt-8">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-8 py-4 rounded-lg shadow-xl hover:bg-blue-600 transition duration-300 ${
                isSubmittedToday ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmittedToday}
            >
              Submit Attendance
            </button>
          </div>
        </form>
        <div className="text-center flex lg:block mt-6">
          <button
            onClick={handleEditClick}
            className="bg-yellow-500 text-white whitespace-nowrap px-8 py-4 rounded-lg shadow-xl hover:bg-yellow-600 transition duration-300"
          >
            Edit Attendance
          </button>
          <button
            onClick={handleUpdateAttendance}
            className="bg-green-500 text-white whitespace-nowrap px-8 py-4 rounded-lg shadow-xl hover:bg-green-600 transition duration-300 ml-4"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
