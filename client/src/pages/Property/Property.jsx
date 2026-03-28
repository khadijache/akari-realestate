import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty, removeBooking } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import "./Property.css";

import { FaShower, FaFileContract } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom, MdVerifiedUser } from "react-icons/md";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";
import BookingModal from "../../components/BookingModal/BookingModal";
import UserDetailContext from "../../context/UserDetailContext.js";
import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import Heart from "../../components/Heart/Heart";
import { useTranslation } from "react-i18next";

const Property = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );

  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((booking) => booking?.id !== id),
      }));
      toast.success(t("booking_cancelled"), { position: "bottom-right" });
    },
  });

  // 1. حاجز الحماية الأول: أثناء تحميل البيانات
  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings" style={{ height: "60vh" }}>
          <PuffLoader color="#e9ae5d" />
        </div>
      </div>
    );
  }

  // 2. حاجز الحماية الثاني: في حال عدم وجود بيانات (يمنع الصفحة البيضاء)
  if (isError || !data) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings" style={{ height: "60vh", textAlign: "center" }}>
          <span className="secondaryText">عذراً، لم يتم العثور على بيانات هذا العقار أو حدث خطأ في الاتصال.</span>
        </div>
      </div>
    );
  }

  // دالة ذكية لمعالجة روابط الصور (تدعم الفايربيس والروابط المحلية)
  const getSafeImage = (img) => {
    if (!img) return "https://via.placeholder.com/800x400?text=No+Image+Found";
    if (img.startsWith('http')) return img; // رابط خارجي أو فايربيس
    return `/images/${img.trim()}`; // رابط محلي
  };

  return (
    <div className="wrapper font-arabic" style={{ direction: 'rtl' }}>
      <div className="flexColStart paddings innerWidth property-container">
        
        {/* زر الإعجاب */}
        <div className="like">
          <Heart id={id}/>
        </div>

        {/* صورة العقار مع معالجة ذكية للأخطاء */}
        <img 
          src={getSafeImage(data?.image)} 
          alt={data?.title} 
          className="property-image" 
          style={{ 
            width: "100%", 
            height: "450px", 
            objectFit: "cover", 
            borderRadius: "20px",
            marginTop: "1rem" 
          }}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Available";
          }}
        />

        <div className="flexCenter property-details">
          
          {/* القسم الأيمن: التفاصيل (تم عكس الترتيب ليتناسب مع العربية) */}
          <div className="flexColStart left" style={{ flex: 1.5 }}>
            
            <div className="flexStart head" style={{ width: "100%", justifyContent: "space-between", alignItems: "center" }}>
              <div className="flexColStart">
                <h1 className="primaryText" style={{ fontSize: "2.2rem" }}>{data?.title}</h1>
                <div className="flexStart rating" style={{ gap: "5px", color: "#ffd700" }}>
                  {[...Array(5)].map((_, i) => <AiFillStar key={i} size={20} />)}
                  <span className="secondaryText">(4.8 {t("reviews")})</span>
                </div>
              </div>
              <span className="orangeText" style={{ fontSize: "2rem", fontWeight: "900" }}>
                {data?.price} <span style={{ fontSize: "1rem" }}>DA</span>
              </span>
            </div>

            {/* المرافق مع حماية Optional Chaining */}
            <div className="flexStart facilities" style={{ gap: "1.5rem", marginTop: "1.5rem" }}>
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms || 0} {t("bathrooms")}</span>
              </div>
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.parkings || 0} {t("parking")}</span>
              </div>
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities?.bedrooms || 0} {t("rooms")}</span>
              </div>
            </div>

            {/* الوصف */}
            <p className="secondaryText" style={{ textAlign: "right", marginTop: "1.5rem", lineHeight: "1.8", fontSize: "1.1rem" }}>
              {data?.description}
            </p>

            {/* الموقع الجغرافي */}
            <div className="flexStart address-box" style={{ gap: "1rem", marginTop: "2rem", background: "#f8f9fa", padding: "1rem", borderRadius: "10px", width: "100%" }}>
              <MdLocationPin size={25} color="#e9ae5d" />
              <span className="secondaryText" style={{ fontWeight: "bold" }}>
                {data?.address}, {data?.city}, {data?.country}
              </span>
            </div>

            {/* أزرار الحجز */}
            <div className="booking-actions" style={{ width: "100%", marginTop: "2rem" }}>
              {bookings?.map((booking) => booking.id).includes(id) ? (
                <>
                  <Button
                    variant="outline"
                    w={"100%"}
                    color="red"
                    onClick={() => cancelBooking()}
                    disabled={cancelling}
                  >
                    <span>{t("cancel_booking")}</span>
                  </Button>
                  <span className="secondaryText" style={{ marginTop: "10px", display: "block", textAlign: "center" }}>
                    {t("booked_date")} {bookings?.filter((booking) => booking?.id === id)[0]?.date}
                  </span>
                </>
              ) : (
                <button
                  className="button"
                  style={{ width: "100%", padding: "1rem", fontSize: "1.2rem" }}
                  onClick={() => {
                    validateLogin() && setModalOpened(true);
                  }}
                >
                  {t("book_visit")}
                </button>
              )}
            </div>

            <BookingModal
              opened={modalOpened}
              setOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>

          {/* القسم الأيسر: الخريطة */}
          <div className="map" style={{ flex: 1, minWidth: "300px" }}>
            <Map
              address={data?.address}
              city={data?.city}
              country={data?.country}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;