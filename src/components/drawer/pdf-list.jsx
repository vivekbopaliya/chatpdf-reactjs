import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Files, Calendar, FileText, ArrowLeftRight, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useGetPDFs } from "../../hooks/pdf-hook";
import { Button } from "../ui/button";
import { useLogoutUser } from "../../hooks/auth-hook";

const PDFListDrawer = () => {
  const navigate = useNavigate();
  const { pdfId } = useParams();
  const { data: pdfs, isPending: isPdfLoading } = useGetPDFs();
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutUser();

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

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        navigate("/auth");
      },
    });
  };

  return (
    <div className="justify-start items-center absolute h-screen z-10 left-0 flex sm:ml-8 ml-3">
      <Sheet>
        <SheetTrigger asChild>
          <ArrowLeftRight className="hover:text-green-400 h-6 w-6 hover:h-7 hover:w-7 translate duration-200 ease-in-out cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <FileText className="mr-2" />
              Your Uploaded PDFs
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 flex-1">
            {isPdfLoading ? (
              <div className="flex justify-center p-12">
                <div className="loader"></div>
              </div>
            ) : pdfs.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-lg">
                <p className="text-gray-500">No PDFs uploaded yet</p>
                <Button
                  className="mt-4 bg-black hover:bg-gray-800 text-white transition-colors duration-200"
                  onClick={() => navigate("/pdf/new")}
                >
                  Upload Your First PDF
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {pdfs.map((pdf) => {
                  const isActive = pdf.id === pdfId;
                  return (
                    <div
                      key={pdf.id}
                      onClick={() => handlePDFClick(pdf.id)}
                      className={`border rounded-lg p-3 hover:shadow-md cursor-pointer transition-shadow ${
                        isActive ? "bg-green-50 border-green-400 shadow-md" : ""
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="p-1.5 bg-gray-100 rounded-lg mr-2">
                          <Files className="h-6 w-6 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm truncate">{pdf.name}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-2.5 w-2.5 mr-1" />
                            <span>{formatDate(pdf.uploaded_date)}</span>
                            <span className="mx-1.5">•</span>
                            <span>{pdf.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PDFListDrawer;