import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [status, setStatus] = useState(false);
  const [result, setResult] = useState("");

  function handleSubject(event) {
    setSubject(event.target.value);
  }

  function handleMsg(event) {
    setMsg(event.target.value);
  }

  function handleFile(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, {
        type: "array",
      });

      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert Excel to array
      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      console.log("Excel data:", rows);

      // Get emails from first column
      const emails = rows
        .map((row) => row[0])
        .filter((email) => email && String(email).includes("@"))
        .map((email) => String(email).trim());

      console.log("Email List:", emails);

      setEmailList(emails);
      setResult(`${emails.length} email(s) loaded successfully.`);
    };

    reader.readAsArrayBuffer(file);
  }

  function send() {
    // Validation
    if (subject.trim() === "") {
      alert("Please enter the email subject.");
      return;
    }

    if (msg.trim() === "") {
      alert("Please enter the email body.");
      return;
    }

    if (emailList.length === 0) {
      alert("Please upload an Excel file containing recipient emails.");
      return;
    }

    setStatus(true);
    setResult("");

      axios.post(`${import.meta.env.VITE_API_URL}/sendemail`, {
        subject: subject,
        message: msg,
        emailList: emailList,
      })
      .then(function (response) {
        if (response.data.success === true) {
          setResult("Emails sent successfully!");
          alert("Emails Sent Successfully");

          // Clear form after successful sending
          setSubject("");
          setMsg("");
          setEmailList([]);
        } else {
          setResult("Failed to send emails.");
          alert("Failed");
        }
      })
      .catch(function (error) {
          console.log("FULL ERROR:", error);
          console.log("STATUS:", error.response?.status);
          console.log("BACKEND DATA:", error.response?.data);

          const backendMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Something went wrong while sending emails.";

          setResult(backendMessage);
          alert(backendMessage);
        })
      .finally(function () {
        setStatus(false);
      });
  }

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Header */}
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">
          Bulk Mail
        </h1>
      </div>

      {/* Description */}
      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">
          We can help your business with sending multiple emails at once
        </h1>
      </div>

      {/* Upload Section */}
      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">
          Send Bulk Emails
        </h1>
      </div>

      {/* Form */}
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-8">

        {/* Subject */}
        <input
          type="text"
          value={subject}
          onChange={handleSubject}
          placeholder="Enter email subject..."
          className="w-[80%] bg-white py-3 px-3 outline-none border border-black rounded-md mb-4"
        />

        {/* Email Body */}
        <textarea
          onChange={handleMsg}
          value={msg}
          className="w-[80%] bg-white h-32 py-2 outline-none px-2 border border-black rounded-md"
          placeholder="Enter the email body..."
        ></textarea>

        {/* Excel Upload */}
        <div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            className="border-4 bg-white border-dashed py-4 px-4 mt-5 mb-5"
          />
        </div>

        {/* Email Count */}
        <p className="font-medium">
          Total Recipients: {emailList.length}
        </p>

        {/* Result Message */}
        {result && (
          <p className="mt-3 font-medium">
            {result}
          </p>
        )}

        {/* Send Button */}
        <button
          onClick={send}
          disabled={status}
          className="mt-4 bg-blue-950 py-2 px-6 text-white font-medium rounded-md"
        >
          {status ? "Sending..." : "Send Emails"}
        </button>
      </div>

      {/* Footer */}
      <div className="bg-blue-950 text-white text-center p-8">
        <p>Bulk Mail Application</p>
      </div>
    </div>
  );
}

export default App;