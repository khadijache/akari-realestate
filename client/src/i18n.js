import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // القائمة العلوية
          "home": "Home",
          "properties": "Properties",
          "agencies": "Agencies",
          "contact": "Contact Us",
          "addProperty": "Add Property",
          "login": "Sign In",
          
          // قسم الهيرو والبحث
          "heroTitle": "Find Your Dream Home in Djelfa",
          "view_listings": "VIEW LISTINGS",
          "price": "PRICE RANGE",
          "city": "CITY / REGION",
          "type": "PROPERTY TYPE",
          "search": "Search",
          "select_city" : "Select City",
          
          // خيارات إضافية للبحث
          "djelfa": "Djelfa",
          "hassi_elache": "Hassi Elache",
          "hassi_bahbah": "Hassi Bahbah",
          "any_price": "Any Price",
          "apartment": "Apartment",
          "house": "House",
          "magasin": "Magasin",



          "reviews": "Reviews",
         "bathrooms": "Bathrooms",
         "parking": "Parking",
         "rooms": "Rooms",
         "legal_status": "Legal Status",
         "livret_foncier": "Land Registry (Livret)",
         "acte_notarie": "Notarial Act",
         "book_visit": "Book your visit",
         "cancel_booking": "Cancel Booking",
         "booking_cancelled": "Booking cancelled successfully",
         "booked_date": "Your visit already booked for: ",
         "error_fetching": "Error while fetching property details",
         "agencies_title": "Certified Real Estate Agencies",
         "contact_now": "Contact Now",
         "loading_agencies": "Loading agencies, please wait...",
         "agencies_subtitle": "Connect with the best agents in the region",
         "add-property": "Add-property"

           
        }
      },
      ar: {
        translation: {
          // القائمة العلوية
          "home": "الرئيسية",
          "properties": "العقارات",
          "agencies": "الوكالات العقارية",
          "contact": "اتصل بنا",
          "addProperty": "إضافة عقار",
          "login": "تسجيل الدخول",

          // قسم الهيرو والبحث
          "heroTitle": "اعثر على منزل أحلامك في ولاية الجلفة",
          "view_listings": "عرض العقارات",
          "price": "نطاق السعر",
          "city": "المدينة / المنطقة",
          "type": "نوع العقار",
          "search": "بحث",
          "select_city": "اختر المدينة...",

          // خيارات إضافية للبحث
          "djelfa": "الجلفة",
          "hassi_elache":" حاسي العش",
          "hassi_bahbah": "حاسي بحبح",
          "any_price": "أي سعر",
          "apartment": "شقة",
          "house": "منزل",
          "magasin": "محل",
          "reviews": "تقييمات",
         "bathrooms": "حمامات",
         "parking": "مرآب",
         "rooms": "غرف",
         "legal_status": "الوضعية القانونية",
         "livret_foncier": "دفتر عقاري",
         "acte_notarie": "عقد توثيقي",
         "book_visit": "حجز موعد زيارة",
         "cancel_booking": "إلغاء الحجز",
         "booking_cancelled": "تم إلغاء الحجز بنجاح",
         "booked_date": "تم حجز موعدك بتاريخ: ",
         "error_fetching": "خطأ أثناء جلب بيانات العقار",
         "agencies_title": "الوكالات العقارية",
         "loading_agencies": "جاري تحميل الوكالات من قاعدة البيانات...",
         "agencies_title": "الوكالات العقارية المعتمدة",
         "contact_now": "اتصل الآن",
         "loading_agencies": "جاري تحميل الوكالات...",
         "add-property":" اضافة اعلان"
           
        }
      }
    },
    fallbackLng: "ar", // اللغة الافتراضية العربية
    interpolation: { escapeValue: false }
  });

export default i18n;