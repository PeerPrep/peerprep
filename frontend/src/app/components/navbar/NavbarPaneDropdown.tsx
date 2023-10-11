"use client";

import { usePathname, useRouter } from "next/navigation";
import { RiArrowDropDownLine } from "@react-icons/all-files/ri/RiArrowDropDownLine";
import { useCallback, useState } from "react";

interface NavElement {
  link: string;
  label: string;
}
interface NavbarPaneDropdownProps {
  navElements: NavElement[];
  mainLabel: string;
}

const handleBlur = () => {
  const elem: any = document.activeElement;
  if (elem) {
    elem?.blur();
  }
};

const NavbarPaneDropdown = ({
  navElements,
  mainLabel,
}: NavbarPaneDropdownProps) => {
  const pathname = usePathname();
  const first_path = pathname.split("/")[1];
  const [isMainActive, setIsMainActive] = useState(false);

  const isAlwaysActive = () => {
    if (first_path.toLowerCase() === mainLabel.toLowerCase()) {
      return true;
    }
    return false;
  };

  return (
    <div className="dropdown dropdown-hover">
      <label tabIndex={0}>
        <div
          className={`relative flex items-center justify-center gap-1 rounded-sm p-2 px-6 text-white hover:bg-secondary ${
            (isAlwaysActive() || isMainActive) &&
            "bg-secondary hover:bg-secondary-focus"
          }`}
        >
          <RiArrowDropDownLine className="absolute left-2 text-4xl" />
          <span className="ml-6 text-lg font-semibold">{mainLabel}</span>
        </div>
      </label>
      <ul
        tabIndex={0}
        onMouseEnter={() => setIsMainActive(true)}
        onMouseLeave={() => setIsMainActive(isAlwaysActive())}
        className="menu dropdown-content btn-primary z-[1] w-48 shadow"
      >
        {navElements.map((navElement, i) => {
          const { link, label } = navElement;
          let active = false;
          if (pathname === link) {
            active = true;
          }
          return (
            <li key={i}>
              <a
                href={link}
                onClick={() => {
                  handleBlur();
                }}
                className={`flex rounded-none text-lg ${
                  active && "bg-secondary hover:bg-secondary-focus"
                }`}
              >
                <span className="font-medium text-white">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default NavbarPaneDropdown;
