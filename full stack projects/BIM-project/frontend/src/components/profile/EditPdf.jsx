import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import axios from "axios"
const PDFEditor = ({ fileUrl }) => {
  const [pdfDocument, setPdfDocument] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      setPdfDocument(blob);
    };

    fetchPdf();
  }, [fileUrl]);

  const handlePDFtoDoc = async () => {
    try {
      // Send the PDF URL to CloudConvert API to start the conversion
      const jobResponse = await axios.post(
        'https://api.cloudconvert.com/v2/jobs',
        {
          tasks: {
            // Create the task for the PDF to DOCX conversion
            'convert-pdf': {
              operation: 'convert',
              input: 'download',
              file: fileUrl,
              output_format: 'docx',
            },
          },
        },
        {
          headers: {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjk4YTIxMDEwNDE2MzAyMjZiZDVhMDhjNDM1ZDVlMWMyMTA4NzIyNTYzYzFiNjRkZWZhMTRkNDIxMjEwMDkyMGE1Y2VjYmJjN2UwM2Q1YjEiLCJpYXQiOjE3NDA4MDcxMzYuNTE3OTMxLCJuYmYiOjE3NDA4MDcxMzYuNTE3OTMzLCJleHAiOjQ4OTY0ODA3MzYuNTE0ODAzLCJzdWIiOiI3MTIwMTcxOSIsInNjb3BlcyI6W119.o1TXD3f3l2ylZ1qZsji8a5oMRlWiIbUQUltoT_yRF5lOlDpMiogWb2kpfjzYabv50nuPb4eTK-D6E1x2_5bhgBWa2wm6-dIdhZvG8vDMdBZ4TomlrtZ_GaBP2b8go4mSIj8W_wMSw8QSjLPklHq8Ed5Ej9h4LUvUmkh9Qsulf7lN_hJCZv0NPNk6YCuAWmEsWpL0VDhCHlqFse-ML5lbpgDg_oiNBJy0gLTPFtc6aSkY06znnWDkutgmJ4m1L7uhN28yIMmsLQcW3Eho0xSPndfT0eENyZcvye4249qvMj2aiXX-uiaN-e-6JKsHXv8xVoZvDApSSV9VxU2ujus_diSY3yyeimj6I_S1zID1d4_CIZgpaUIUnm40ao1_5_6NzpsjVdQ7T5gE1eEfM9HcE3wZbsuY0eWExMH-fMysPJIVhlInsWa-eoIGtPvg32ZHQe-RMiLFiauTBKd8BNwyCc4y-etkZdxoSVC8HQizWnDh2xHiA8O55zO0di4CyYyV_KrzFwZ8jhNPb4kuU3Blvu8hKQCvxaFB1wwoTz9a2wbl_HObuYqyhShxT2KMsyXAQPpnGiJu0qCufbUMRf8maKFONgQU_e1e_R5R2FUPm65-Av1humXjGw9ebr8t4z7nqsBkKPLMdhfdCN2OQU4d0cnFRwMl8XNoFdnZRdI_0Z8`,
            'Content-Type': 'application/json',
          },
        }
      );

      // CloudConvert will provide a URL to download the converted DOCX file
      console.log("sdfsdf==sd===", jobResponse);
    } catch (error) {
      console.error("Error converting file:", error);
    }
  };
  return (
    <div style={{ height: "100vh" }}>
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`}
      >
        {pdfDocument && <Viewer fileUrl={URL.createObjectURL(pdfDocument)} />}
      </Worker>
      <br />
      <br />
      <br />
      <br />
      <br />
      <button onClick={handlePDFtoDoc} className="bg-red-300 pointer">continue</button>
    </div>
  );
};

export default PDFEditor;
