import React from "react";
import { useNavigate } from "react-router-dom";
import { Files, Calendar, FileText, ArrowLeftRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useGetPDFs } from "../../hooks/pdf-hook";

const PDFListDrawer = () => {
  const navigate = useNavigate();

  const {data: pdfs, isPending: isPdfLoading}= useGetPDFs()

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePDFClick = (pdfId) => {
    navigate(`/pdf/${pdfId}`);
  };

  return (
    <div className="justify-start  items-center absolute h-screen   z-10 left-0  flex sm:ml-8 ml-3">

    <Sheet >
      <SheetTrigger asChild>
      <ArrowLeftRight className="hover:text-green-400 h-6 w-6 hover:h-7 hover:w-7 translate duration-200  ease-in-out cursor-pointer" />

      </SheetTrigger>
      <SheetContent  side='left' className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <FileText className="mr-2" />
            Your PDF Documents
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {isPdfLoading ? (
            <div className="flex justify-center p-12">
              <div className="loader"></div>
            </div>
          ) : pdfs.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-lg">
              <p className="text-gray-500">No PDFs uploaded yet</p>
              <button
                className="mt-4 bg-black text-white"
                onClick={() => navigate("/")}
              >
                Upload Your First PDF
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  onClick={() => {handlePDFClick(pdf.id) }}
                  className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Files className="h-8 w-8 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium truncate">{pdf.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(pdf.uploaded_date)}</span>
                        <span className="mx-2">•</span>
                        <span>{pdf.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
    </div>
  );
};

export default PDFListDrawer;