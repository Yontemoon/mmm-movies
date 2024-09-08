import "./Button.scss";
import josefin_sans from "@/utils/fonts";
import clsx from "clsx";

type PropTypes = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const Button = ({ children, onClick, className }: PropTypes) => {
  return (
    <button
      className={clsx("button-wrapper", josefin_sans.className, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
