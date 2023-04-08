import '../App.css';

import { Outlet } from "react-router-dom";

const Footer = () => {

    return (
        <>
            <footer id="footer" className="footer-1 footer bg-dark">
                <div className="main-footer widgets-dark typo-light">
                    <div className="container">
                        <div className="row">

                            <div className="col-xs-12 col-sm-6 col-md-4">
                                <div className="widget subscribe no-box">
                                    <h5 className="widget-title"> METEOSTANICE - SKUPINA 9 <span></span></h5>
                                    <p></p>
                                    <p> Při poskytování služeb nám pomáhají soubory cookie. Používáním webu vyjadřujete souhlas. </p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-6 col-md-4 footer-div">
                                <div className="widget no-box">
                                    <h5 className="widget-title"> Rychlé odkazy <span></span></h5>
                                    <ul className="thumbnail-widget">
                                        <li> <div className="thumb-content"> <a href="/"> Domů </a> </div> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-copyright">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12 text-center">
                                <p> Vytvořeno: Ondřej Koriťák, Lukáš Skřivánek, Nikita Potapov, Patrick Zámyslický, Michal Medek, Martin Horčík </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <Outlet />
        </>
    )
};

export default Footer;