import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { NavLink, Link } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);

  const getMenuStyles = (menuOpened) => {
    if (document.documentElement.clientWidth <= 800) {
      return { left: !menuOpened && "-100%" }; // تغيير من right لـ left بسبب الـ RTL
    }
  };

  return (
    <section className="h-wrapper">
      <div className="flexCenter paddings innerWidth h-container sticky top-0 z-50 bg-white border-b border-gray-100" 
  style={{ direction: "rtl" }}>
        
        {/* اللوجو (على اليمين) */}
        <Link to="/">
        <div className="logo-circle"> 
          <img src="./logo2.png" alt="لوجو عقاري" width={100} /></div>
        </Link>

        {/* القائمة (تظهر بجانب اللوجو أو على اليسار) */}
        <OutsideClickHandler onOutsideClick={() => setMenuOpened(false)}>
          <div className="flexCenter h-menu" style={getMenuStyles(menuOpened)}>
            <NavLink to="/properties">العقارات</NavLink>
            <NavLink to="/agencies">الوكالات</NavLink>
            <NavLink to="/notaries">الموثقون</NavLink>
            <NavLink to="/login" className="button">سجل الان</NavLink>
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