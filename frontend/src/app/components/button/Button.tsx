import React, { ReactNode } from "react";

type ButtonVariant = "primary";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  variant?: ButtonVariant;
}

const Button = ({
  className = "",
  isDisabled = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`btn text-white shadow-sm outline-1 outline-white ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
