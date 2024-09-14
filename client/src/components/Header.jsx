import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import useLogout from "../hooks/useLogout";
import Modal from "./Modal";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Button from "./Button";

export default function Header() {
  const [open, setIsOpen] = useState(false);
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.success("Successfully logged out");
    navigate("/login");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="bg-base-100 shadow-md p-4 flex flex-col md:flex-row justify-between items-center z-10">
      <Modal open={open}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Logout</h3>
          <p className="py-2">Are you sure you want to logout?</p>
          <p className="py-2 text-sm text-gray-500">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              <Button
                className="btn btn-error m-2 text-white"
                name="Logout"
                onClick={handleLogout}
              />
              <Button
                className="btn m-2"
                name="Close"
                onClick={() => setIsOpen(false)}
              />
            </form>
          </div>
        </div>
      </Modal>
      <Link to="/" className="text-2xl font-bold text-primary mb-2 md:mb-0">
        Chat App
      </Link>
      <div className="flex items-center space-x-2">
        <span className="mr-4">
          <ThemeToggle />
        </span>
        {auth.accessToken && (
          <Button
            className="btn btn-outline btn-error hover:text-white"
            onClick={() => setIsOpen(true)}
            name="Logout"
          />
        )}
      </div>
    </header>
  );
}
