import React from 'react';
import flagsSvg from '../../public/flags.svg'; // Import trực tiếp file SVG

export const Flag = ({ language, width = 84 }) => {
  const height = width * (19.3171 / 24);

  return (
    <svg viewBox={language.viewBox} style={{ height, width }}>
      <image height={flagsSvg.height} href={flagsSvg} width={flagsSvg.width} />
    </svg>
  );
};
