'use client'

import DocumentTable from "@/components/table/document-table";

interface Document {
  co_tipo_doc: string
  nom_archivo: string
}

interface DocumentTableProps {
  documents: Document[]
}

function DashboardContainer({documents}: DocumentTableProps) {

  const handleUpdate = () => {
    // Call API to update documents here
    console.log("Updating documents...");
    // Example: fetch('/api/update-documents', { method: 'POST', body: JSON.stringify(documents) });
  }

  const handleDownload = () => {
    // Call API to download documents here
    console.log("Downloading documents...");
    // Example: fetch('/api/download-documents', { method: 'POST', body: JSON.stringify(documents) });
  }

  return (
    <div className="container mx-auto flex flex-col gap-5">
     <h1>Dashboard</h1>
      <DocumentTable documents={documents} onEdit={handleUpdate} onDownload={handleDownload}/>
    </div>
  )
}

export default DashboardContainer;
