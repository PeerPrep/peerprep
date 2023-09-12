import { IoPeopleCircleSharp } from "react-icons/io5";
import Button from "../button/Button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between bg-neutral p-2 px-12 items-center">
        <div className="text-3xl text-white font-bold flex items-center">
          <Link href="/">
            <IoPeopleCircleSharp className="text-base-100 text-5xl cursor-pointer" />
          </Link>
          PeerPrep
        </div>
        <Button
          className="btn-accent rounded-full btn-sm px-4"
          children={<span>Login</span>}
        />
      </div>
    </nav>
  );
};

export default Navbar;
