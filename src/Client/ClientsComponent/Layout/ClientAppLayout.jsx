import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import BottomNavbar from "../navbar/BottomNavbar";
import Footer from "../Footer";

function ClientAppLayout(){
  return(
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
      <BottomNavbar/>
    </>
  )
}
export default ClientAppLayout;