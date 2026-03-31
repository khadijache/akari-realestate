import React, { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import { MdLocationPin } from "react-icons/md"; // أضفنا أيقونة الموقع
import { useNavigate } from "react-router-dom"; // لتفعيل الضغط
import "./Properties.css";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const navigate = useNavigate();

  // 1. حالة الفلتر الجديدة
  const [filter, setFilter] = useState({
    city: "",
    area: "",
    type: "",
    // price: "" // قمنا بتجميد حقل السعر (محذوف من البحث)
  });

  // قائمة المدن المسموحة فقط
  const allowedCities = ["Djelfa", "Hassi Bahbah", "Ain Maabed", "Charef"];
  // قائمة الأحياء الخاصة بالجلفة فقط
  const djelfaAreas = ["100 Logements", "Chaba", "Cite Moustakbel", "Hasi Bahbah Center"];

  // 2. دالة حماية الصور الذكية لضمان ظهور صور الفايربيس (الحل لمشكلتك)
  const getSafeImage = (img) => {
    if (!img) return "https://via.placeholder.com/400x300?text=ADAR+Real+Estate";
    if (img.startsWith('http')) return img; // إذا كان رابط Firebase
    return `/images/${img.trim()}`; // إذا كان مساراً محلياً
  };

  // 3. منطق الفلترة المحدث والدقيق
  const filteredProperties = data?.filter((property) => {
    // فلتر المدينة: حصر في الـallowedCities فقط
    const cityMatch = !filter.city || property.city?.toLowerCase() === filter.city.toLowerCase();

    // فلتر الحي: لا يسمح إلا إذا كانت المدينة الجلفة
    const isDjelfaSelected = filter.city?.toLowerCase() === "djelfa";
    const areaMatch = isDjelfaSelected 
      ? (!filter.area || property.area?.toLowerCase() === filter.area.toLowerCase())
      : true; // إذا لم تكن المدينة الجلفة، لا نطبق فلتر الحي

    // فلتر النوع (شقة، فيلا، محل...)
    const typeMatch = !filter.type || property.type?.toLowerCase() === filter.type.toLowerCase();

    return cityMatch && areaMatch && typeMatch;
  });

  if (isError) return <div className="p-wrapper flexCenter paddings">خطأ في الاتصال بالسيرفر</div>;
  if (isLoading) return <div className="p-wrapper flexCenter paddings" style={{ height: "60vh" }}><PuffLoader color="#4066ff" /></div>;

  return (
    <div className="p-wrapper font-arabic" style={{ direction: 'rtl' }}>
      <div className="p-container paddings innerWidth">
        
        {/* شريط العنوان بستايل ADAR */}
        <div className="p-header flexStart gap-4">
          <MdLocationPin size={30} color="#f6ad55" />
          <h2 className="primaryText text-3xl">العقارات المتاحة في ولاية الجلفة</h2>
        </div>
        
        {/* شريط البحث المحدث (سنقوم بتعديله أدناه) */}
        <SearchBar 
          filter={filter} 
          setFilter={setFilter} 
          allowedCities={allowedCities} 
          djelfaAreas={djelfaAreas} 
          // priceDisabled={true} // قمنا بتجميد شريط السعر من الـ props
        />

        {/* شبكة العقارات ببطاقات محسنة Quality (Shadows, No Dollar) */}
        <div className="p-grid-cards mt-10">
          {filteredProperties && filteredProperties.length > 0 ? (
            filteredProperties.map((card, i) => (
              <div 
                key={i} 
                className="p-card flexColStart gap-2" 
                onClick={() => navigate(`../properties/${card.id}`)}
                style={{cursor: 'pointer'}}
              >
                {/* الصورة - دالة getSafeImage وحماية onError*/ }
                <div className="p-image-box">
                  <img 
                    src={getSafeImage(card.image)} 
                    alt={card.title} 
                    className="w-full h-56 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/400x300?text=Error+Loading+Image";
                    }}
                  />
                </div>
                
                {/* السعر بدون دولار وبستايل برتقالي جودة وادي كنيس */}
                <div className="p-price-tag mt-2">
                  <span className="price">{card.price}</span>
                  <span className="currency"> DA</span>
                </div>
                
                {/* العنوان والموقع */}
                <span className="primaryText text-lg font-bold">{card.title}</span>
                <span className="secondaryText text-sm flexStart gap-1"><MdLocationPin size={16}/> {card.city}, {card.address}</span>
              </div>
            ))
          ) : (
            <div className="flexCenter" style={{marginTop: "3rem", textAlign: "center"}}>
              <h3 className="secondaryText text-xl">لا توجد نتائج تطابق بحثك حالياً في هذه المناطق.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
 