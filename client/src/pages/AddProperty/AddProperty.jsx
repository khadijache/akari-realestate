import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import "./AddProperty.css";
import { MdOutlineArrowForward, MdVerifiedUser, MdAssignment } from "react-icons/md"; 

import { firestoreDB, storage, auth } from "../../firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddProperty = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "Apartment", // الافتراضي شقة
    documentType: "Act", // الافتراضي عقد ملكية
    area: "", // المساحة
    floor: 0, // الطابق
    address: "",
    city: "Djelfa", 
    municipality: "الجلفة",
    bathrooms: 0,
    bedrooms: 0,
    parkings: 0,
  });

  const [images, setImages] = useState([]);

  const djelfaMunicipalities = [
    "الجلفة", "حاسي بحبح", "عين وسارة", "مسعد", "الشارف", 
    "دار الشيوخ", "الإدريسية", "حد الصحاري", "بيرين", "عين معبد"
  ];

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    const finalValue = type === "number" ? parseInt(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [id]: finalValue }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("يرجى اختيار صورة واحدة على الأقل");
    if (!auth.currentUser) return toast.error("يجب تسجيل الدخول أولاً");

    setUploading(true);
    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `properties/${Date.now()}-${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );

      await addDoc(collection(firestoreDB, "properties"), {
        ...formData,
        image: imageUrls[0],
        allImages: imageUrls,
        authorUid: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "مستخدم ADAR",
        verified: false, // قيمة افتراضية للتحقق لاحقاً من الإدارة
        createdAt: new Date(),
      });

      toast.success("تم إرسال العقار للمراجعة بنجاح!");
      navigate("/dashboard"); 
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-property-wrapper paddings innerWidth font-arabic" dir="rtl">
      
      <div className="flexStart back-button" onClick={() => navigate(-1)} style={{cursor: 'pointer', gap: '10px', marginBottom: '20px', color: '#1f3e72'}}>
        <MdOutlineArrowForward size={24} style={{transform: 'rotate(180deg)'}}/>
        <b>الرجوع للوحة التحكم</b>
      </div>

      <div className="flexColCenter pb-8">
        <h2 className="primaryText">إضافة عقار جديد <MdVerifiedUser color="#28a745"/></h2>
        <span className="secondaryText">أدخل معلومات دقيقة لزيادة فرصة قبول إعلانك في ولاية الجلفة</span>
      </div>

      <form onSubmit={handleSubmit} className="add-form shadow-lg p-10 bg-white rounded-xl">
        
        {/* قسم 1: نوع العقار والقانونية */}
       <div className="form-section">
            <h3 className="orangeText mb-4 flexStart gap-2"><MdAssignment/> التفاصيل القانونية والنوع</h3>
            <div className="flex gap-4 w-full mb-4">
                <select id="type" onChange={handleChange} className="flex-1 p-3 border rounded">
                    <option value="Apartment">شقة</option>
                    <option value="Villa">فيلا</option>
                    <option value="Land">أرض</option>
                    <option value="Shop">محل تجاري</option>
                </select>

                <select id="documentType" onChange={handleChange} className="flex-1 p-3 border rounded">
                    <option value="Act">عقد ملكية موثق</option>
                    <option value="Livret">دفتر عقاري</option>
                    <option value="Paper">أوراق عرفية</option>
                </select>
            </div>
        </div>

        {/* قسم 2: معلومات الإعلان */}
        <div className="form-section mt-6">
            <input type="text" id="title" placeholder="عنوان جذاب (مثال: محل تجاري في وسط حاسي بحبح)" onChange={handleChange} required className="w-full p-3 border rounded mb-4" />
            <textarea id="description" placeholder="وصف مفصل (القرب من الطريق، المرافق، حالة الواجهة...)" onChange={handleChange} required className="w-full p-3 border rounded h-32 mb-4" />
        </div>
        
        {/* قسم 3: الأسعار والموقع */}
        <div className="flex gap-4 w-full mb-4">
          <input type="number" id="price" placeholder="السعر الإجمالي (دج)" onChange={handleChange} required className="flex-1 p-3 border rounded" />
          <input type="number" id="area" placeholder="المساحة (م²)" onChange={handleChange} required className="flex-1 p-3 border rounded" />
        </div>

        <div className="flex gap-4 w-full mb-4">
          <select id="municipality" onChange={handleChange} className="flex-1 p-3 border rounded bg-white">
            {djelfaMunicipalities.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input type="number" id="floor" placeholder="الطابق" onChange={handleChange} className="flex-1 p-3 border rounded" />
        </div>

        <input type="text" id="address" placeholder="العنوان الدقيق" onChange={handleChange} required className="w-full p-3 border rounded mb-6" />
        
        {/* المرافق */}
        <div className="flexStart gap-8 bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flexColStart">
            <label>غرف</label>
            <input type="number" id="bedrooms" min="0" onChange={handleChange} className="w-20 p-2 border rounded" />
          </div>
          <div className="flexColStart">
            <label>حمام</label>
            <input type="number" id="bathrooms" min="0" onChange={handleChange} className="w-20 p-2 border rounded" />
          </div>
          <div className="flexColStart">
            <label>مرآب</label>
            <input type="number" id="parkings" min="0" onChange={handleChange} className="w-20 p-2 border rounded" />
          </div>
        </div>

        <div className="py-4 w-full border-t">
          <label className="block mb-2 font-bold">صور حقيقية للعقار (صور واضحة تزيد المصداقية):</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} required className="text-sm" />
        </div>

        <button type="submit" className="button w-full py-4 text-xl" disabled={uploading} style={{backgroundColor: '#1f3e72'}}>
          {uploading ? "جاري الرفع والتحقق..." : "نشر الإعلان في ADAR"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;