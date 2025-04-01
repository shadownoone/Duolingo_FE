// import languages from "../utils/languages";
// import { Link } from "react-router-dom";
// import bgSnow from "../../src/assets/bg-snow.svg";
// import { LanguageHeader } from "../components/LanguageHeader";

// function LanguageList() {
//   return (
//     <main
//       className="flex min-h-screen flex-col items-center bg-[#235390] text-white"
//       style={{ backgroundImage: `url(${bgSnow.src})` }}
//     >
//       <LanguageHeader />
//       <div className="container flex grow flex-col items-center justify-center gap-20 px-4 py-16">
//         <h1 className="mt-20 text-center text-3xl font-extrabold tracking-tight text-white">
//           I want to learn...
//         </h1>
//         <section className="mx-auto grid w-full max-w-5xl grow grid-cols-1 flex-col gap-x-2 gap-y-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {languages.map((language) => (
//             <Link
//               key={language.name}
//               to="/learn"
//               className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-b-4 border-gray-400 px-5 py-8 text-xl font-bold hover:bg-gray-300 hover:bg-opacity-20"
//             >
//               <Flag language={language} />
//               <span>{language.name}</span>
//             </Link>
//           ))}
//         </section>
//       </div>
//     </main>
//   );
// }

// export default LanguageList;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bgSnow from "../../src/assets/bg-snow.svg";
import { LanguageHeader } from "../components/LanguageHeader";
import { Flag } from "../components/Flag";
import { getAllLanguages } from "../services/Languages/languageService";

function LanguageList() {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await getAllLanguages();
        console.log("API response:", response);

        if (response.code === 0 && response.data) {
          setLanguages(response.data.data);
        } else {
          console.error("Dữ liệu trả về không phải là một mảng:", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách languages:", error);
      }
    };

    fetchLanguage();
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center bg-[#235390] text-white"
      style={{ backgroundImage: `url(${bgSnow.src})` }}
    >
      <LanguageHeader />
      <div className="container flex grow flex-col items-center justify-center gap-20 px-4 py-16">
        <h1 className="mt-20 text-center text-3xl font-extrabold tracking-tight text-white">
          I want to learn...
        </h1>
        <section className="mx-auto grid w-full max-w-5xl grow gap-x-2 gap-y-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {languages.map((language) => (
            <Link
              key={language.language_id}
              to="/learn"
              className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-b-4 border-gray-400 px-5 py-8 text-xl font-bold hover:bg-gray-300 hover:bg-opacity-20"
            >
              {/* Giả sử component Flag có thể xử lý đối tượng language trả về từ API */}
              <Flag language={language} />
              <span>{language.language_name}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

export default LanguageList;
