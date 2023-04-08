import '../App.css';

import { useState } from "react";
import { ReactSession } from 'react-client-session';

const CookiesInfo = () => {
    ReactSession.setStoreType("localStorage");

    const cookies = ReactSession.get("cookies");

    const [render, setRender] = useState(!cookies);

    function setCookies() {
        ReactSession.set("cookies", true);
        setRender(false)
    }

    if (render) {
        return (
            <div className="cookie-consent-banner">
                <div className="cookie-consent-banner__inner">
                    <div className="cookie-consent-banner__copy">
                        <div className="cookie-consent-banner__header"> TAHLE STRÁNKA POUŽÍVÁ SOUBORY COOKIE </div>
                        <div className="cookie-consent-banner__description">
                            Při poskytování služeb nám pomáhají soubory cookie. Používáním webu vyjadřujete souhlas.
                        </div>
                    </div>

                    <div className="cookie-consent-banner__actions">
                        <a href="#" onClick={() => {setCookies()}} className="cookie-consent-banner__cta">
                            Rozumím!
                        </a>
                    </div>
                </div>
            </div>

        )
    }
}

export default CookiesInfo;