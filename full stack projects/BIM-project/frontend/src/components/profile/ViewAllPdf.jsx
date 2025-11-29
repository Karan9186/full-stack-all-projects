import React, { useEffect, useState } from "react";
import { getAllUserPdf } from "../../services/pdf.service";
import { getLocalStorage } from "../../../../backend/utils/GlobalLocalstorage";
import { LOCAL_STORAGE } from "../../../../backend/utils/constant";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import PDFEditor from "./EditPdf";
import { PDFDocument } from 'pdf-lib';

const ViewAllPdf = () => {
  const getUser = getLocalStorage(LOCAL_STORAGE.USER);
  const [pdfData, setPdfData] = useState([]);
  const [pdfUrl,setPdfUrl]=useState()
  const getAllPdf = async () => {
    const userId = JSON.parse(getUser);
    const response = await getAllUserPdf({ userId: userId?.userId });
    console.log("-=-=", response?.data);
    setPdfData(response?.data);
  };

const extractPdfContent = async (pdfUrl) => {
  const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const textContent = await pdfDoc.getText(); // Get the text content from the PDF
  return textContent;
};


  useEffect(() => {
    getAllPdf();
  }, []);
  return (
    <>
      <br />
      <div className="flex items-center justify-center gap-4">
        <div className="flex gap-5 mt-5 flex-wrap">
          {pdfData?.length > 0 ? (
            <>
              {pdfData.map((v, i) => {
                return (
                  <div
                    key={i}
                    className="w-100 bg-white border border-gray-200 rounded-lg shadow-sm "
                  >
                    <Worker
                      workerUrl={`https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`}
                    >
                      <div style={{ height: "200px", }}>
                        <Viewer
                          fileUrl={`https://iwncbfitrokxvrrorcfx.supabase.co/storage/v1/object/public/pdfs/${v?.file_url}`}
                        />
                      </div>
                    </Worker>

                    <div className="p-5">
                      <button
                        onClick={()=>setPdfUrl(`https://iwncbfitrokxvrrorcfx.supabase.co/storage/v1/object/public/pdfs/${v?.file_url}`)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                      >
                        Edit
                        <svg
                          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <h1>loading..</h1>
          )}
        </div>

      </div>
      {pdfUrl &&
      <PDFEditor fileUrl={pdfUrl}/>
      
      }
    </>
  );
};

export default ViewAllPdf;
