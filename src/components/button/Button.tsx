import "./Button.scss";
import josefin_sans from "@/utils/fonts";
import clsx from "clsx";

type PropTypes = {
  children: React.ReactNode;
  size?: "default" | "icon";
  onClick?: () => void;
  className?: string;
  purpose?: "default" | "watchlist" | "rating" | "favorite";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  className,
  size = "default",
  purpose = "default",
  type = "button",
  disabled = false,
  ...props
}: PropTypes) => {
  return (
    <button
      className={clsx(
        "button-wrapper",
        josefin_sans.className,
        className,
        size === "default" && "default-button",
        size === "icon" && "icon-button",
        purpose && `${purpose}-button`
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
