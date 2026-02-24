import React, { useState } from "react"; // تمت إضافة useState هنا لإصلاح الخطأ
import "./Hero.css";
import { HiSearch } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  // حالات لتخزين ما يختاره المستخدم
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [price, setPrice] = useState(""); // حالة السعر الجديد

  const handleSearch = () => {
    // عرض القيم في الكونسول للتأكد
    console.log("المدينة:", selectedCity);
    console.log("النوع:", selectedType);
    console.log("السعر المطلوب:", price);
  };

  return (
    <section className="hero-wrapper">
      <div className="hero-container-bg">
        <div className="flexColCenter paddings innerWidth hero-contents">
          
          <h1 className="hero-main-title">{t("heroTitle")}</h1>
          
          <button className="view-listings-btn">
            {t("view_listings")}
          </button>

          {/* شريط البحث المتقدم */}
          <div className="flexCenter search-bar-advanced">
            
            {/* القسم الأول: المدينة */}
            <div className="search-item">
              <label>{t("city")}</label>
              <select 
                className="search-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">{t("select_city")}</option>
                <option value="djelfa">{t("djelfa")}</option>
                <option value="hassi_bahbah">{t("hassi_bahbah")}</option>
              </select> 
            </div>

            <div className="divider" />

            {/* القسم الثاني: النوع */}
            <div className="search-item">
              <label>{t("type")}</label>
              <select 
                className="search-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">{t("type")}</option>
                <option value="apartment">{t("apartment")}</option>
                <option value="house">{t("house")}</option>
                <option value="magasin">{t("magasin")}</option>
              </select>
            </div>

            <div className="divider" />

            {/* القسم الثالث: السعر (خانة إدخال بسيطة) */}
            <div className="search-item">
              <label>{t("price") || "السعر"}</label>
              <input 
                type="number" 
                placeholder="00.00" 
                className="price-input"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100px",
                  fontSize: "0.9rem"
                }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* زر البحث الجانبي */}
            <button className="search-icon-btn" onClick={handleSearch}>
              <HiSearch size={25} color="white" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;