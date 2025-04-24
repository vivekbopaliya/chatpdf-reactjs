import React from "react";
import AiPlanetLogo from "../../AIPlanetLogo.svg"
import { File } from "lucide-react";
import UploadPDF from './upload-pdf'
const Header = ({pdfInfo}) => {

  return (
    <div className="shadow-sm w-screen flex justify-between sm:px-16 px-5 py-2 items-center">
      
          <img
            src={AiPlanetLogo}
            alt="logo"
            className="sm:w-32 w-[104px] sm:h-20 h-[50px] object-contain"
          />
      <main className="sm:gap-12 gap-3 sm:text-base text-xs flex ">

        {pdfInfo.name && (
          <div className="flex gap-2 items-center text-green-400">
            <File className="sm:h-5 sm:w-5 h-4 w-4" />
            <p className="font-medium">{pdfInfo.name}</p>
          </div>
        )}
        <UploadPDF/>
        </main>
    </div>
  );
};

export default Header;
