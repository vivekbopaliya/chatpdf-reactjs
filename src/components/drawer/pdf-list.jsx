import { ArrowLeftRight, Calendar, Files, FileText, LoaderCircle, LogOut, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "../modal/delete-confirmation-modal";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePDF, useGetPDFs } from "../../hooks/pdf-hook";
import { useLogoutUser } from "../../hooks/auth-hook";
import { useState } from "react";

const PDFListDrawer = () => {
  const navigate = useNavigate();
  const { pdfId } = useParams();
  const { data: pdfs, isPending: isPdfLoading } = useGetPDFs();
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutUser();
  const { mutate: deletePDF, isPending: isDeleting } = useDeletePDF();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, pdfId: null, pdfName: "" });

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
        // Redirect to the auth page after logout
        navigate("/auth");
      },
    });
  };

  const handleDeleteClick = (e, pdf) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, pdfId: pdf.id, pdfName: pdf.name });
  };

  const handleDeleteConfirm = () => {
    deletePDF(deleteModal.pdfId, {
      onSuccess: () => {
        setDeleteModal({ isOpen: false, pdfId: null, pdfName: "" });
        if (deleteModal.pdfId === pdfId) {
          // If the deleted PDF is deleted, navigate to the new PDF page
          navigate("/pdf/new");
        }
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, pdfId: null, pdfName: "" });
  };

  return (
    <div className="justify-start items-center absolute h-screen z-10 left-0 flex sm:ml-8 ml-3">
      <Sheet>
        <SheetTrigger asChild>
          <ArrowLeftRight className="hover:text-green-400 h-5 w-5 sm:h-6 sm:w-6 hover:h-6 hover:w-6 transition duration-200 ease-in-out cursor-pointer" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[85vw] max-w-[400px] sm:max-w-[540px] flex flex-col overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center text-base sm:text-lg">
              <FileText className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Your Uploaded PDFs
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 flex-1">
            {isPdfLoading ? (
              <div className="flex justify-center p-8 sm:p-12">
                <div className="loader"></div>
              </div>
            ) : pdfs.length === 0 ? (
              <div className="text-center p-8 sm:p-12 align-middle justify-center border border-dashed rounded-lg">
                <p className="text-gray-500 text-sm sm:text-base">No PDFs uploaded yet!</p>
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
                          <Files className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-xs sm:text-sm truncate">{pdf.name}</h3>
                            <button
                              onClick={(e) => handleDeleteClick(e, pdf)}
                              className="p-1 hover:bg-red-100 rounded-full"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1 flex-wrap">
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
            className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <LogOut className="h-4 w-4" />
            Logout
            {isLoggingOut && <LoaderCircle className="animate-spin h-4 w-4" />}
          </Button>
        </SheetContent>
      </Sheet>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        pdfName={deleteModal.pdfName}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PDFListDrawer;