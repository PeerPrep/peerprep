"use client";

import { usePathname } from "next/navigation";

interface NavbarPaneProps {
  link: string;
  label: string;
}

const NavbarPane = ({ link, label }: NavbarPaneProps) => {
  const pathname = usePathname();
  let active = false;
  if (pathname === link) {
    active = true;
  }
  return (
    <>
      <a
        href={link}
        className={`rounded-sm p-2 px-6 text-lg font-semibold text-white hover:bg-secondary ${
          active && "bg-secondary hover:bg-secondary-focus"
        }`}
      >
        {label}
      </a>
    </>
  );
};
export default NavbarPane;
