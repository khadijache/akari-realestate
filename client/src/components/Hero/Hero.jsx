import React from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-wrapper">
      {/* طبقة الصورة الخلفية */}
       <div className="hero-bg-container">
        <img src="./djelfa-adar.jpg" alt="Djelfa Real Estate" />
        <div className="hero-overlay"></div>
      </div>

      <div className="paddings innerWidth hero-container">
        <div className="flexColCenter hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            دليلك الأول للعقارات في ولاية الجلفة
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hero-subtitle"
          >
            نربطك مباشرة مع أفضل الوكالات العقارية والموثقين المعتمدين
          </motion.p>

          <div className="hero-search-bar" onClick={() => navigate("/properties")}>
            <input type="text" placeholder="ابحث عن أحياء الجلفة، عين وسارة، حاسي بحبح..." readOnly />
            <button className="button">بحث سريع</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;