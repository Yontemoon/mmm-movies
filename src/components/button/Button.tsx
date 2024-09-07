import "./Button.scss";
import josefin_sans from "@/utils/fonts";
import clsx from "clsx";

type PropTypes = {
  children: React.ReactNode;
  onClick?: () => void;
};

const Button = ({ children, onClick }: PropTypes) => {
  return (
    <button
      className={clsx("button-wrapper", josefin_sans.className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
