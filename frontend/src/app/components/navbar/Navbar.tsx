import { IoPeopleCircleSharp } from "react-icons/io5";
import Button from "../button/Button";

const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between bg-neutral p-2 px-12 items-center">
        <div className="text-4xl text-white font-bold flex items-center">
          <IoPeopleCircleSharp className="text-base-100 text-5xl" />
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
