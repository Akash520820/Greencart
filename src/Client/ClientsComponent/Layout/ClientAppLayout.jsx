import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Footer from "../Footer";

function ClientAppLayout(){
  return(
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}
export default ClientAppLayout;