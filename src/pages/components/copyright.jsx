import { useNavigate } from "react-router-dom";
import mainStore from "../../store/store";

const CopyrightFooter = () => {
  return (
    <footer className="copyright text-center py-2">
      <p class="text-lg font-semibold">
        © {new Date().getFullYear()} TAK8 Car Rental. All Rights Reserved.
      </p>
      <p className="text-sm mt-2 flex justify-center items-center gap-2">
        <span class="colorYellow">Powered by </span>
        <a href="https://anata.digital/" className="underline font-bold text-yellow-400 flex items-center" target="_blank" rel="noopener noreferrer">
         
          Anata Digital
        </a>
      </p>
    </footer>
  );
};

export default CopyrightFooter;