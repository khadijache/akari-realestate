import React, { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState(""); 
  const [cityFilter, setCityFilter] = useState(""); 
  const [typeFilter, setTypeFilter] = useState("");

  if (isError) {
    return (
      <div className="wrapper flexCenter" style={{background: "#131110", color: "white", height: "100vh"}}>
        <span>خطأ في جلب البيانات. تأكدي من مسار Firebase!</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "100vh", background: "#131110" }}>
        <PuffLoader color="#4066ff" />
      </div>
    );
  }

  return (
    /* التعديل هنا: الخلفية الزرقاء الداكنة المتدرجة لتطابق الهوية */
    <div style={{ 
      background: "linear-gradient(180deg, #1f3e72 0%, #131110 100%)", 
      minHeight: "100vh", 
      width: "100%",
      paddingTop: "100px" 
    }}>
      <div className="flexColCenter paddings innerWidth properties-container">
        
        {/* عنوان الصفحة الصغير */}
        <div className="flexColCenter s-head" style={{marginBottom: "2rem"}}>
          <span className="orangeText">عقارات الجلفة</span>
          <span style={{color: "white", opacity: 0.8}}>استكشف أفضل المنازل والأراضي في الولاية</span>
        </div>

        <SearchBar 
          filter={filter} 
          setFilter={setFilter} 
          setCityFilter={setCityFilter} 
          setTypeFilter={setTypeFilter} 
        />

        <div className="paddings flexCenter properties" style={{gap: "1.5rem"}}>
          {
            data && data.length > 0 ? (
              data
                .filter((property) => {
                  const title = property.title || "";
                  const matchesText = title.toLowerCase().includes(filter.toLowerCase());
                  const matchesCity = cityFilter === "" || property.city === cityFilter;
                  const matchesType = typeFilter === "" || property.type === typeFilter;

                  return matchesText && matchesCity && matchesType;
                })
                .map((card, i) => (
                  <PropertyCard card={card} key={i} />
                ))
            ) : (
              <div className="flexCenter" style={{color: "white", marginTop: "2rem"}}>
                لا توجد عقارات مطابقة لبحثك حالياً
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Properties;