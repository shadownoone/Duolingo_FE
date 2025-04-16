import React from "react";
import ReactCountryFlag from "react-country-flag";

export const Flag = ({ code, size = "2em" }) => {
  if (!code) return null;
  return (
    <ReactCountryFlag
      countryCode={code.toUpperCase()} // Đảm bảo mã quốc gia là chữ hoa
      svg // Dùng định dạng SVG
      style={{
        width: size,
        height: size,
      }}
      title={code}
    />
  );
};
