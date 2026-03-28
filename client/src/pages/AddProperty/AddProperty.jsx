 import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import "./AddProperty.css";
import { MdOutlineArrowForward } from "react-icons/md"; 

// استيراد الإعدادات الصحيحة من ملف firebase
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
    address: "",
    city: "الجلفة", 
    municipality: "الجلفة",
    country: "الجزائر",
    bathrooms: 0,
    bedrooms: 0,
    parkings: 0,
    lat: 34.6727, 
    lng: 3.2630
  });

  const [images, setImages] = useState([]);

  const djelfaMunicipalities = [
    "الجلفة", "حاسي بحبح", "عين وسارة", "مسعد", "الشارف", 
    "دار الشيوخ", "الإدريسية", "حد الصحاري", "بيرين"
  ];

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    // تحويل القيمة لرقم إذا كان الحقل مخصصاً للأرقام، لضمان صحة البيانات في Firestore
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
        authorName: auth.currentUser.displayName || "مستخدم",
        createdAt: new Date(),
      });

      toast.success("تم إضافة العقار بنجاح في ولاية الجلفة!");
      navigate("/dashboard"); 
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الإضافة: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-property-wrapper paddings innerWidth" style={{ position: 'relative' }}>
      
      {/* 1. زر الرجوع */}
      <div 
        className="flexStart back-button" 
        onClick={() => navigate(-1)} 
        style={{
          cursor: 'pointer',
          gap: '10px',
          marginBottom: '20px',
          color: 'var(--blue)',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content'
        }}
      >
        <MdOutlineArrowForward size={24} />
        <span>العودة للخلف</span>
      </div>

      {/* 2. رأس الصفحة */}
      <div className="flexColCenter pb-8 text-right">
        <h2 className="primaryText">أنشئ إعلانك العقاري</h2>
        <span className="secondaryText">أعلن عن عقارك في ولاية الجلفة ووصل لآلاف المشترين</span>
      </div>

      {/* 3. نموذج الإضافة */}
      <form onSubmit={handleSubmit} className="flexColStart add-form shadow-lg p-10 bg-white rounded-xl">
        
        <label className="font-bold">المعلومات الأساسية</label>
        <input type="text" id="title" placeholder="عنوان الإعلان (مثلاً: شقة للكراء بحاسي بحبح)" onChange={handleChange} required className="w-full p-3 border rounded" />
        <textarea id="description" placeholder="وصف العقار (المساحة، القرب من المرافق...)" onChange={handleChange} required className="w-full p-3 border rounded h-32" />
        
        <div className="flex gap-4 w-full">
          <input type="number" id="price" placeholder="السعر (دج)" min="0" onChange={handleChange} required className="flex-1 p-3 border rounded" />
          
          <select id="municipality" onChange={handleChange} className="flex-1 p-3 border rounded bg-white">
            {djelfaMunicipalities.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <input type="text" id="address" placeholder="العنوان بالتفصيل (الحي، الشارع)" onChange={handleChange} required className="w-full p-3 border rounded" />
        
        {/* التعدادات (منع الأرقام السالبة) */}
        <div className="flexStart gap-8 items-center py-4">
          <div className="flexColStart">
            <label>غرف</label>
            <input type="number" id="bedrooms" min="0" defaultValue="0" onChange={handleChange} className="w-20 p-2 border rounded" />
          </div>
          <div className="flexColStart">
            <label>حمامات</label>
            <input type="number" id="bathrooms" min="0" defaultValue="0" onChange={handleChange} className="w-20 p-2 border rounded" />
          </div>
          <div className="flexColStart">
            <label>مرآب</label>
            <input type="number" id="parkings" min="0" defaultValue="0" onChange={handleChange} className="w-20 p-2 border rounded" />
          </div>
        </div>

        {/* مساحة الخريطة التفاعلية */}
        <div className="map-placeholder w-full h-64 bg-gray-100 rounded-lg flexCenter border-2 border-dashed border-gray-300">
           <span>قريباً: تحديد الموقع على الخريطة التفاعلية للجلفة</span>
        </div>

        <div className="py-4 w-full">
          <label className="block mb-2 font-bold">صور العقار:</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} required className="text-sm" />
        </div>

        <button type="submit" className="button w-full py-4 text-lg" disabled={uploading}>
          {uploading ? "جاري المعالجة والرفع..." : "نشر العقار الآن"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;