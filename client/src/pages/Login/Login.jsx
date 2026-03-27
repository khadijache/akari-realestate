import React from 'react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// الاستيرادات من Firebase
import { auth } from "../../firebase"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate(); // نحتاجه للانتقال بين الصفحات

  // --- 1. هنا نكتب الدالة التي كانت مفقودة وتسببت في الصفحة البيضاء ---
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("تم تسجيل الدخول بنجاح:", result.user.displayName);
      navigate("/"); // الانتقال لصفحة عقارات الجلفة الرئيسية بعد النجاح
    } catch (error) {
      console.error("خطأ في تسجيل الدخول بجوجل:", error.message);
      alert("حدث خطأ أثناء الاتصال بجوجل");
    }
  };
  // -------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dir-rtl">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-lg border border-gray-100"
      >
        {/* الهيدر */}
        <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-5">
            <div className='flex items-center gap-2'>
                <div className='p-3 bg-blue-100 rounded-xl'>
                    <LogIn className="text-blue-900" size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">عقارات <span className='text-blue-700'>الجلفة</span></h1>
            </div>
            <Link to="/" className='text-sm text-gray-500 hover:text-blue-700 flex items-center gap-1'>
                الرئيسية
                <ArrowRight size={16}/>
            </Link>
        </div>

        <div className="flex flex-col gap-2 mb-10 text-right">
          <h2 className="text-3xl font-extrabold text-blue-950">مرحباً بعودتك</h2>
          <p className="text-gray-600">سجل الدخول للوصول إلى لوحة تحكم عقاراتك</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-semibold text-gray-800 mr-1 text-right">البريد الإلكتروني</label>
            <div className="flex items-center bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
              <Mail className="text-gray-400 ml-3" size={20} />
              <input type="email" placeholder="example@mail.com" className="bg-transparent outline-none w-full text-gray-800 text-right placeholder:text-gray-300" required />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className='flex items-center justify-between ml-1'>
                <label className="text-sm font-semibold text-gray-800 text-right">كلمة المرور</label>
                <Link to="#" className="text-xs text-blue-700 hover:underline">نسيت كلمة المرور؟</Link>
            </div>
            <div className="flex items-center bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
              <Lock className="text-gray-400 ml-3" size={20} />
              <input type="password" placeholder="••••••••" className="bg-transparent outline-none w-full text-gray-800 text-right placeholder:text-gray-300" required />
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-blue-900 text-white py-4 rounded-xl text-lg font-bold mt-4 shadow-lg shadow-blue-100 hover:bg-blue-950 transition-all flex items-center justify-center gap-2">
            <LogIn size={20} />
            تسجيل الدخول
          </motion.button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-4 text-gray-400 text-sm absolute">أو المتابعة عبر</span>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignIn} // الآن الدالة أصبحت معرفة وسيعمل الزر
            className="flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-800 shadow-sm w-full"
          >
            <img src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5" referrerPolicy="no-referrer" />
            حساب جوجل
          </button>
        </form>

        <p className="text-center text-gray-600 mt-12 border-t border-gray-100 pt-6">
          ليس لديك حساب؟ 
          <Link to="/register" className="text-blue-700 font-bold hover:underline mr-1.5">أنشئ حساباً الآن</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;