import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { MdLanguage } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(nextLang);
    document.body.dir = nextLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <section className="h-wrapper custom-header">
      <div className="flexCenter innerWidth paddings h-container">
        
        {/* اللوجو - تأكدي من ظهور هذا القسم */}
        <Link to="/" className="logo-adar">
          <img src="./logo2.png" alt="ADAR Logo" width={50} />
          <span className="brand-name">ADAR</span>
        </Link>

        {/* القائمة */}
        <OutsideClickHandler onOutsideClick={() => setMenuOpened(false)}>
          <div 
            className="flexCenter h-menu" 
            style={{ right: menuOpened ? "2rem" : "-100%" }}
          >
            {/* زر الترجمة */}
            <div className="language-selector" onClick={toggleLanguage}>
              <MdLanguage size={22} color="#e9ae5d" />
              <span>{i18n.language === "ar" ? "English" : "عربي"}</span>
            </div>

            <NavLink to="/">{t("home")}</NavLink>
            <NavLink to="/properties">{t("properties")}</NavLink>
            <NavLink to="/agencies">{t("agencies")}</NavLink>
            <a href="mailto:test@test.com">{t("contact")}</a>

            <button className="button login-btn">
              {t("login")}
            </button>
          </div>
        </OutsideClickHandler>

        {/* أيقونة الموبايل */}
        <div className="menu-icon" onClick={() => setMenuOpened((prev) => !prev)}>
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;