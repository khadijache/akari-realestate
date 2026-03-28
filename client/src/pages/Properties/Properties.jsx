import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // أضفنا هذا لتفعيل الضغط على البطاقة
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import "./Properties.css";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const navigate = useNavigate(); // لتفعيل التنقل عند الضغط
  
  const [filter, setFilter] = useState({
    city: "",
    area: "",
    type: "",
    price: ""
  });

  // 1. حماية: دالة ذكية للتعامل مع الصور (Firebase vs Local)
  // هذه الدالة ستحل مشكلة أخطاء 404 في الـ Console
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=Akari+Real+Estate";
    
    // إذا كان الرابط يبدأ بـ http (رابط إنترنت أو فايربيس) استخدمه مباشرة
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // إذا كان مجرد اسم ملف (مثل pic.jpg)، نضع صورة افتراضية محترفة بدلاً من الخطأ
    return "https://via.placeholder.com/400x300?text=Image+Not+Found";
  };

  // منطق الفلترة المحدث
  const filteredProperties = data?.filter((property) => {
    const matchCity = !filter.city || 
      property.city?.toLowerCase() === filter.city.toLowerCase();

    const matchArea = !filter.area || 
      property.address?.toLowerCase().includes(filter.area.toLowerCase());

    const matchType = !filter.type || 
      property.type?.toLowerCase() === filter.type.toLowerCase();

    const matchPrice = !filter.price || 
      (Number(property.price) <= Number(filter.price));

    return matchCity && matchArea && matchType && matchPrice;
  });

  if (isError) return <div className="wrapper flexCenter"><span>خطأ في الاتصال بالخادم</span></div>;
  if (isLoading) return <div className="wrapper flexCenter" style={{height: "60vh"}}><PuffLoader color="#4066ff" /></div>;

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        
        <h2 className="primaryText">العقارات المتاحة في ولاية الجلفة</h2>
        
        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {filteredProperties && filteredProperties.length > 0 ? (
            filteredProperties.map((card, i) => (
              
              // 2. تعديل: وضع تصميم البطاقة مباشرة هنا (لأنه لا يوجد PropertyCard)
              // أضفنا onClick لتفعيل الانتقال لصفحة التفاصيل
              <div 
                key={i} 
                className="flexColStart r-card" 
                onClick={() => navigate(`../properties/${card.id}`)} // حل مشكلة الصفحة البيضاء
                style={{cursor: 'pointer'}} // لجعل الماوس يتغير عند الحوم
              >
                <img 
                  // استخدام الدالة الذكية التي أنشأناها في الأعلى
                  src={getImageUrl(card.image)} 
                  alt={card.title || "عقار"} 
                  className="w-full h-48 object-cover rounded-xl"
                  // حل أخير في حال فشل تحميل الصورة تماماً
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://via.placeholder.com/400x300?text=Error+Loading+Image";
                  }}
                />
                
                <span className="secondaryText r-price">
                  <span style={{ color: "orange" }}>$</span>
                  <span>{card.price}</span>
                </span>
                <span className="primaryText">{card.title}</span>
                <span className="secondaryText">{card.address}</span>
              </div>

            ))
          ) : (
            <div className="flexCenter" style={{marginTop: "2rem", textAlign: "center"}}>
              <h3 className="secondaryText">لا توجد نتائج تطابق بحثك حالياً في هذه المنطقة.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;