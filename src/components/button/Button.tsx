import "./Button.scss";
import josefin_sans from "@/utils/fonts";
import clsx from "clsx";

type PropTypes = {
  children: React.ReactNode;
};

const Button = ({ children }: PropTypes) => {
  return (
    <button className={clsx("button-wrapper", josefin_sans.className)}>
      {children}
    </button>
  );
};

export default Button;
