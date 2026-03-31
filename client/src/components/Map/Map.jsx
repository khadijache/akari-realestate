import React from 'react'

const Map = ({ address, municipality }) => {
  // نقوم بإنشاء رابط البحث لخرائط جوجل بناءً على العنوان والبلدية في الجلفة
  // نضع hl=ar لضمان أن اللغة هي العربية دائماً
  const searchQuery = encodeURIComponent(`${address}, ${municipality}, Djelfa, Algeria`);
  const googleMapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${searchQuery}&hl=ar&zoom=16`;

  // ملاحظة: إذا لم تملكي مفتاح API حالياً، سنستخدم الحل البديل المجاني (Iframe العادي)
  const freeGoogleMapUrl = `https://maps.google.com/maps?q=${searchQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed&hl=ar`;

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid #ddd' }}>
      <iframe
        title="ADAR Google Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        src={freeGoogleMapUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  )
}

export default Map