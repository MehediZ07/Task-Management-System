import Navbar from "../Components/Navbar";

import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="bg-violet-100 min-h-screen flex flex-col justify-between">
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
}
