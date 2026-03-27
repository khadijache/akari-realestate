import React, { useState } from "react";
import { Select, Group } from "@mantine/core";
import "./Notaries.css";

const Notaries = () => {
  // بيانات تجريبية للموثقين في ولاية الجلفة
  const allNotaries = [
    {
      id: 1,
      name: "الأستاذ أحمد بوعبد الله",
      city: "djelfa",
      cityName: "الجلفة",
      address: "حي 100 هكتار، بالقرب من المحكمة الجديدة",
      phone: "027 12 34 56",
      image: "https://images.pexels.com/photos/6077368/pexels-photo-6077368.jpeg" // صورة تعبيرية لمكتب
    },
    {
      id: 2,
      name: "الأستاذة مريم رحماني",
      city: "hassi_bahbah",
      cityName: "حاسي بحبح",
      address: "شارع الاستقلال، وسط المدينة",
      phone: "027 98 76 54",
      image: "https://images.pexels.com/photos/4427506/pexels-photo-4427506.jpeg"
    },
    {
      id: 3,
      name: "الأستاذ كمال مسعدي",
      city: "ain_oussera",
      cityName: "عين وسارة",
      address: "طريق الجزائر الوطني رقم 1",
      phone: "027 55 44 33",
      image: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
    },
    {
        id: 4,
        name: "الأستاذ يحيى بن خليفة",
        city: "djelfa",
        cityName: "الجلفة",
        address: "نهج محمد بوضياف، رقم 12",
        phone: "027 11 22 33",
        image: "https://images.pexels.com/photos/3771097/pexels-photo-3771097.jpeg"
      },
  ];

  const djelfaCities = [
    { value: "djelfa", label: "الجلفة" },
    { value: "hassi_bahbah", label: "حاسي بحبح" },
    { value: "ain_oussera", label: "عين وسارة" },
    { value: "birine", label: "بيرين" },
    { value: "charef", label: "شارف" },
  ];

  const [selectedCity, setSelectedCity] = useState(null);

  // منطق الفلترة حسب المدينة فقط
  const filteredNotaries = selectedCity
    ? allNotaries.filter((notary) => notary.city === selectedCity)
    : allNotaries;

  return (
    <div className="n-wrapper paddings">
      <div className="flexColCenter innerWidth n-container">
        <div className="flexColStart n-head">
          <span className="orangeText">شركاؤنا القانونيون</span>
          <span className="primaryText">الموثقون المعتمدون بولاية الجلفة</span>
          <p className="secondaryText">ابحث عن أقرب موثق لإتمام إجراءاتك القانونية بكل أمان</p>
        </div>

        {/* شريط الفلترة بالمدينة */}
        <div className="n-filter-section">
          <Select
            placeholder="فلترة حسب المدينة"
            data={djelfaCities}
            clearable
            searchable
            onChange={setSelectedCity}
            className="n-select"
          />
        </div>

        {/* شبكة عرض الموثقين */}
        <div className="n-grid">
          {filteredNotaries.length > 0 ? (
            filteredNotaries.map((notary) => (
              <div className="n-card" key={notary.id}>
                <img src={notary.image} alt={notary.name} />
                <div className="n-details flexColStart">
                  <span className="n-name">{notary.name}</span>
                  <span className="n-city">📍 {notary.cityName}</span>
                  <span className="secondaryText n-address">{notary.address}</span>
                  <div className="n-contact">
                    <span>📞 {notary.phone}</span>
                  </div>
                  <button className="button n-btn">تواصل الآن</button>
                </div>
              </div>
            ))
          ) : (
            <div className="flexCenter" style={{ width: "100%", marginTop: "2rem" }}>
              <span className="secondaryText">عذراً، لا يوجد موثقون مسجلون في هذه المدينة حالياً.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notaries;