import React from "react";
import './PropertyCard.css';
import { truncate } from 'lodash';
import { useNavigate } from "react-router-dom";
// قمنا بحذف استيراد Heart و AiFillHeart لأنكِ لا تريدين القلب في البطاقة الخارجية

const PropertyCard = ({ card }) => {
  const navigate = useNavigate();

  // دالة ذكية لضمان ظهور الصورة من الفايربيس أو المسار المحلي
  const getSafeImage = (img) => {
    if (!img) return "https://via.placeholder.com/400x300?text=ADAR+Real+Estate";
    return img.startsWith('http') ? img : `/images/${img.trim()}`;
  };

  return (
    <div 
      className="flexColStart r-card"
      onClick={() => navigate(`../properties/${card.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* 1. تم حذف مكون <Heart /> تماماً من هنا بناءً على طلبك */}

      {/* 2. عرض الصورة مع معالجة الخطأ */}
      <img 
        src={getSafeImage(card?.image)} 
        alt={card?.title} 
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
        }}
      />

      {/* 3. السعر: حذف رمز $ واستبداله بـ DA بأسلوب ADAR */}
      <span className="secondaryText r-price">
        <span style={{ color: "#f6ad55", fontWeight: "800", fontSize: "1.5rem" }}>
          {card?.price}
        </span>
        <span style={{ fontSize: "0.8rem", marginRight: "5px", color: "#666" }}>
          DA
        </span>
      </span>

      {/* 4. العنوان والوصف بأسلوب مختصر واحترافي */}
      <span className="primaryText" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
        {truncate(card?.title, { length: 20 })}
      </span>
      
      <span className="secondaryText" style={{ fontSize: "0.9rem" }}>
        {truncate(card?.description, { length: 60 })}
      </span>
    </div>
  );
};

export default PropertyCard;