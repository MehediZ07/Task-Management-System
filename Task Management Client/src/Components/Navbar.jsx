import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  return (
    <div className="navbar bg-violet-100 text-black">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-violet-100 rounded-box z-[1] mt-3 w-52 p-2 shadow space-y-4"
          >
            {!user ? (
              <>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                        : "bg-violet-200 px-4 py-2 rounded-lg"
                    }
                  >
                    Home
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                        : "bg-violet-200 px-4 py-2 rounded-lg"
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/addtask"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                        : "bg-violet-200 px-4 py-2 rounded-lg"
                    }
                  >
                    Add Task
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                        : "bg-violet-200 px-4 py-2 rounded-lg"
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-lg text-violet-600 ">
          {user?.displayName}
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-2 font-semibold">
          {!user ? (
            <>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                      : "bg-violet-200 px-4 py-2 rounded-lg"
                  }
                >
                  Home
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                      : "bg-violet-200 px-4 py-2 rounded-lg"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/addtask"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                      : "bg-violet-200 px-4 py-2 rounded-lg"
                  }
                >
                  Add Task
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                      : "bg-violet-200 px-4 py-2 rounded-lg"
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        <ul className="flex gap-2 items-center font-semibold">
          {!user ? (
            <>
              {" "}
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                      : "bg-violet-200 px-4 py-2 rounded-lg"
                  }
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-violet-200 px-4 py-2 rounded-lg border-b-4 solid border-violet-500"
                      : "bg-violet-200 px-4 py-2 rounded-lg"
                  }
                >
                  Signup
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <button
                onClick={logOut}
                className=" bg-[#faa2a0] hover:bg-[#f99796] text-white rounded-lg px-4 py-2"
              >
                Logout
              </button>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
