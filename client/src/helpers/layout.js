import '../App.css';

import { Outlet, Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
// Bootstrap
import { Nav, Navbar, NavLink } from "react-bootstrap";
// Ikony
import { AiFillHome } from "react-icons/ai";
import { CgUser } from "react-icons/cg";
import { BiLogOut, BiLogIn } from "react-icons/bi";
// Obrázky
import Logo from '../pics/Logo.png'
// Konstanty
ReactSession.setStoreType("localStorage");

const user = ReactSession.get("meteostanice-user");

const Layout = () => {
    return (
        <>
            <Navbar collapseOnSelect expand="xl" bg="dark" variant="dark">
                <Navbar.Brand>
                    {/* <img src={Logo} alt="Logo METEOSTANICE - SKUPINA 9" className='logo' /> */}
                    <span> <b> METEOSTANICE - SKUPINA 9 </b> </span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls={"navbarScroll"} data-bs-target="#navbarScroll" />
                <Navbar.Collapse>
                    <Nav className='ms-auto'>
                        <NavLink eventKey={1} as={Link} to="/"> <AiFillHome /> Domů </NavLink>
                        {user === undefined ?
                            <NavLink eventKey={7} as={Link} to="/login">
                                <span className='layout-divider col-sm-0'></span>
                                <BiLogIn />  Přihlásit se
                            </NavLink> :
                            <>
                                <NavLink eventKey={6} as={Link} to="/profile">
                                    <span className='layout-divider col-sm-0'></span>
                                    <CgUser /> {user.name}
                                </NavLink>
                                <NavLink eventKey={6} as={Link} to="/management">
                                    <span className='layout-divider col-sm-0'></span>
                                    Správa
                                </NavLink>
                                <NavLink eventKey={7} as={Link} to="/signout">
                                    <span className='layout-divider col-sm-0'></span>
                                    <BiLogOut />  Odhlásit se
                                </NavLink>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Outlet />
        </>
    )
};

export default Layout;