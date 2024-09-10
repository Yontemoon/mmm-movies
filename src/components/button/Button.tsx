import "./Button.scss";
import josefin_sans from "@/utils/fonts";
import clsx from "clsx";

type PropTypes = {
  children: React.ReactNode;
  type?: "default" | "icon";
  onClick?: () => void;
  className?: string;
  purpose?: "default" | "watchlist" | "rating" | "favorite";
};

const Button = ({
  children,
  onClick,
  className,
  type = "default",
  purpose = "default",
}: PropTypes) => {
  return (
    <button
      className={clsx(
        "button-wrapper",
        josefin_sans.className,
        className,
        type === "default" && "default-button",
        type === "icon" && "icon-button",
        purpose && `${purpose}-button`
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
