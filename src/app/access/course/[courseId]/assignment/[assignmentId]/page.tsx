"use client";

import NavBar from "~/components/ui/navbar";
import PDFViewer from "./_components/reading_activity/pdf-viewer";

export default function Page() {
  const pdfUrl = 'https://arxiv.org/pdf/1708.08021.pdf'; // Replace with your PDF URL

  return (
    <div>
      <NavBar includeBurger={true} accountLink={"/access/account"} logoLink={"/access"}/>
      <div className="pt-20">
        <PDFViewer file={pdfUrl}/>
      </div>
    </div>
  )
}