import React from "react";
import { ReactComponent as SunSVGIcon } from "../../assets/sun.svg"; // Adjust path if needed

const SunSVG = ({ size = 30, color = "gray" }) => {
  return <SunSVGIcon width={size} height={size} fill={color} />;
};

export default SunSVG;
