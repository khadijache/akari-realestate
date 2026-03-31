 
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiOutlineWhatsApp, AiOutlinePhone } from "react-icons/ai"; 
import { FaBed, FaChartArea, FaRegFileAlt, FaLayerGroup, FaDoorOpen } from "react-icons/fa";
import Map from "../../components/Map/Map";
import "./Property.css";

const Property = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id));

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // معالجة مصفوفة الصور لضمان عدم حدوث خطأ Map
  const allPropertyImages = data ? [
    data.image,
    ...(Array.isArray(data.allImages) 
      ? data.allImages 
      : typeof data.allImages === 'string' 
        ? data.allImages.split(/\s+/).filter(link => link.trim() !== "") 
        : [])
  ].filter(Boolean) : [];

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % allPropertyImages.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + allPropertyImages.length) % allPropertyImages.length);

  // التحكم عبر أزرار اللوحة (الأسهم)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allPropertyImages]);

  if (isLoading) return <div className="ok-wrapper flexCenter"><PuffLoader color="#1f3e72" /></div>;
  if (isError || !data) return <div className="ok-wrapper flexCenter"><span>العقار غير موجود في قاعدة بيانات الجلفة</span></div>;

  const getImg = (img) => img?.startsWith('http') ? img : `/images/${img}`;

  return (
    <div className="ok-wrapper font-arabic" dir="rtl">
      <div className="ok-container paddings innerWidth">
        
        {/* العنوان الموحد (وسط الصفحة) */}
        <div className="ok-header-center">
          <h1>{data?.type || "عرض عقاري"} : {data?.title}</h1>
          <p className="ok-location-subtitle">{data?.municipality} - ولاية الجلفة</p>
        </div>

        <div className="ok-main-layout">
          <div className="ok-content">
            
            {/* معرض الصور مع أزرار التنقل */}
            <div className="ok-gallery">
              <div className="ok-main-img-box">
                <button className="nav-btn next-btn" onClick={nextImage}>❯</button>
                <img 
                  src={getImg(allPropertyImages[activeImageIndex])} 
                  alt="Property" 
                  className="main-img-animation"
                />
                <button className="nav-btn prev-btn" onClick={prevImage}>❮</button>
                <div className="img-counter">{activeImageIndex + 1} / {allPropertyImages.length}</div>
              </div>

              <div className="ok-thumbs">
                {allPropertyImages.map((img, index) => (
                  <img 
                    key={index} 
                    src={getImg(img)} 
                    className={activeImageIndex === index ? "active-thumb" : ""}
                    onClick={() => setActiveImageIndex(index)} 
                  />
                ))}
              </div>
            </div>

            {/* شبكة المواصفات التفصيلية (الواجهات، الطوابق، الوثائق) */}
            <div className="ok-specs-container">
              <h3 className="section-title">المواصفات التقنية والقانونية</h3>
              <div className="ok-specs-grid">
                <div className="spec-item">
                  <FaBed /> <span>الغرف: {data?.bedrooms || 0}</span>
                </div>
                <div className="spec-item">
                  <FaLayerGroup /> <span>الطابق: {data?.floor === 0 ? "أرضي" : data?.floor}</span>
                </div>
                <div className="spec-item">
                  <FaDoorOpen /> <span>الواجهات: {data?.facades || 1}</span>
                </div>
                <div className="spec-item">
                  <FaChartArea /> <span>المساحة: {data?.area}  </span>
                </div>
                <div className="spec-item legal-badge">
                  <FaRegFileAlt /> <span>الوثائق: {
                    data?.documentType === "Act" ? "عقد ملكية" :
                    data?.documentType === "Livret" ? "دفتر عقاري" :"قيد التحقق" 
                  }</span>
                </div>
              </div>
            </div>

            {/* وصف الإعلان */}
            <div className="ok-description">
              <h3 className="section-title">وصف العقار</h3>
              <p>{data?.description}</p>
            </div>
          </div>

          {/* الجانب الأيسر: الاتصال والخريطة */}
          <div className="ok-sidebar">
            <div className="contact-card">
              <h3>تواصل مع صاحب الإعلان</h3>
              <a href={`tel:${data?.phone}`} className="contact-link phone-bg">
                <AiOutlinePhone size={20} /> {data?.phone || "اتصل الآن"}
              </a>
              <a href={`https://wa.me/213${data?.phone}`} className="contact-link whatsapp-bg">
                <AiOutlineWhatsApp size={20} /> مراسلة عبر واتساب
              </a>
              <div className="online-status"> </div>
            </div>

            <div className="map-section">
              <h3 className="section-title">موقع العقار (الجلفة)</h3>
              <div className="map-container-box">
                <Map address={data?.address} municipality={data?.municipality} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;