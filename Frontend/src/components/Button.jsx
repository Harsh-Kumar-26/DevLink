// components/Button.jsx
import { motion } from "framer-motion";

export default function Button({
  children = "Click Me",
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const baseStyle =
    "px-5 py-2.5 rounded-xl font-medium transition-all duration-300 focus:outline-none cursor-pointer";

  let variantStyle = "";

  if (variant === "primary") {
    variantStyle =
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-xl";
  } else if (variant === "secondary") {
    variantStyle =
      "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700";
  } else if (variant === "outline") {
    variantStyle =
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white";
  } else if (variant === "danger") {
  variantStyle =
    "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-xl";
}else if (variant === "green") {
    variantStyle =
    "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-xl";
  }


  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {children}
    </motion.button>
  );
}
