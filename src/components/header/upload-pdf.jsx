import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CirclePlus, LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useUploadPDF } from "../../hooks/pdf-hook";

const UploadPDF = () => {
  const [pdf, setPdf] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate: uploadPDF, isPending: loading } = useUploadPDF();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdf(file);
    }
  };

  const handleFileSubmit = () => {
    if (!pdf) return;

    uploadPDF(pdf, {
      onSuccess: (data) => {
        setIsDialogOpen(false);
        setPdf(null);
        navigate(`/pdf/${data.id}`);
      },
      onError: () => {
        setPdf(null);
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogTrigger>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-transparent rounded-lg sm:px-9 px-2 text-sm py-2 border-2 hover:bg-gray-100 border-black font-medium flex gap-2 justify-center items-center"
        >
          <CirclePlus className="sm:h-5 sm:w-5 h-4 w-4" />
          <p className="sm:block hidden ">Upload PDF</p>
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload your PDF</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-8">
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-gray-200 mt-5 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
            >
            Choose a PDF
          </label>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".pdf"
            onChange={handleFile}
          />
          <div className="flex items-center justify-center w-full">
            <span
              className={`w-full bg-white border ${
                pdf !== null ? "border-green-400 " : "border-gray-300"
              } px-4 py-2 rounded-md text-gray-800`}
            >
              <span id="fileName" className="truncate">
                {pdf !== null ? pdf?.name : "NOTE: Only PDFs are allowed."}
              </span>
            </span>
          </div>
        </div>

        <DialogFooter>
          <button
            disabled={pdf === null || loading}
            className="bg-black text-white px-5 w-fit disabled:opacity-65 disabled:cursor-not-allowed mt-2 py-2 rounded-lg flex gap-3"
            onClick={handleFileSubmit}
          >
            Submit
            {loading && <LoaderCircle className="animate-spin" />}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPDF;