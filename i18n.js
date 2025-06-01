import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // load file JSON từ public/locales
  .use(initReactI18next) // hook vào React
  .init({
    supportedLngs: ["en", "jp"],
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common"],
    debug: false, // bật true để log
    backend: {
      // đường dẫn tương đối đến file JSON
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      useSuspense: false, // dễ render fallback hơn
    },
  });

export default i18n;
