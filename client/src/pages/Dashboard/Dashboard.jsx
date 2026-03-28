 import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Home, Heart, Calendar, Settings, LogOut, PlusCircle, Loader2, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { firestoreDB as db, auth } from '../../firebase'; 
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const Dashboard = () => {
  const [myProperties, setMyProperties] = useState([]);
  // --- إضافة حالات (States) لطلبات التواصل ---
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // 1. مراقب العقارات (مرتبة من الأحدث)
    const qProps = query(
      collection(db, 'properties'), 
      where('authorUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeProps = onSnapshot(qProps, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyProperties(data);
      setLoading(false);
    });

    // 2. مراقب طلبات التواصل (الجديد)
    // هذا الكود يبحث في مجموعة 'contacts' عن أي طلب موجه لصاحب الحساب الحالي
    const qContacts = query(
      collection(db, 'contacts'), 
      where('ownerUid', '==', user.uid)
    );

    const unsubscribeContacts = onSnapshot(qContacts, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContactRequests(contactsData);
    });

    // تنظيف المراقبين عند مغادرة الصفحة
    return () => {
      unsubscribeProps();
      unsubscribeContacts();
    };
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-right font-arabic">
        <h2 className="text-2xl font-bold text-blue-900">يرجى تسجيل الدخول أولاً</h2>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-xl">الانتقال لصفحة الدخول</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row-reverse font-arabic">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 hidden md:flex flex-col p-6 gap-8 text-right shadow-sm">
        <div className="flex items-center justify-end gap-2 px-2">
          <span className="text-xl font-bold text-blue-900">لوحة الإدارة</span>
          <div className="w-8 h-8 bg-orange-500 rounded-lg shadow-inner"></div>
        </div>

        <nav className="flex flex-col gap-2">
          <Link to="/dashboard" className="flex items-center justify-end gap-3 p-3 rounded-xl bg-blue-50 text-blue-900 font-bold border-r-4 border-blue-600">
            لوحة التحكم
            <LayoutDashboard size={20} />
          </Link>
          <Link to="/add-property" className="flex items-center justify-end gap-3 p-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-blue-900 transition-colors">
            أضف عقاراً
            <PlusCircle size={20} />
          </Link>
          
          <div className="mt-auto border-t pt-4">
            <button onClick={handleLogout} className="w-full flex items-center justify-end gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer">
              تسجيل الخروج
              <LogOut size={20} />
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 pt-24 flex flex-col gap-10 text-right overflow-y-auto">
        <header className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-blue-900">أهلاً {user?.displayName || 'خديجة'}!</h1>
            <p className="text-gray-500 font-medium">إدارة عقاراتك في ولاية الجلفة.</p>
          </div>
          <Link to="/add-property" className="bg-orange-500 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all font-bold">
            <PlusCircle size={20} />
            إضافة إعلان جديد
          </Link>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-end">
              <span className="text-gray-400 text-sm font-medium">إجمالي عقاراتي</span>
              <div className="text-4xl font-black text-blue-900 mt-2">{myProperties.length}</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-end">
              <span className="text-gray-400 text-sm font-medium">مشاهدات اليوم</span>
              <div className="text-4xl font-black text-green-600 mt-2">{myProperties.length * 5}</div>
            </div>

            {/* بطاقة طلبات التواصل - أصبحت ديناميكية الآن */}
            <div 
              className="bg-blue-900 p-6 rounded-2xl shadow-lg flex flex-col items-end text-white cursor-pointer hover:scale-105 transition-all relative overflow-hidden group"
              onClick={() => navigate('/requests')}
            >
              {/* تأثير النبض في حال وجود طلبات */}
              {contactRequests.length > 0 && (
                <span className="absolute top-2 left-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              )}

              <span className="text-blue-200 text-sm font-medium">طلبات التواصل</span>
              <div className="text-4xl font-black mt-2">{contactRequests.length}</div>
              <p className="text-[10px] mt-2 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">انقر لعرض التفاصيل</p>
            </div>
        </section>

        {/* Property List */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-blue-900 border-r-4 border-orange-500 pr-3">قوائمي النشطة</h2>
          
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
          ) : myProperties.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center gap-4 font-arabic">
              <p className="text-gray-400 text-lg">لم تقم بإضافة أي إعلان في الجلفة أو حاسي بحبح بعد.</p>
              <Link to="/add-property" className="bg-blue-900 text-white px-8 py-2 rounded-lg font-bold">ابدأ الآن</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 font-arabic">
              {myProperties.map((prop) => (
                <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                   <div className="h-48 overflow-hidden relative">
                      <img src={prop.image || 'https://via.placeholder.com/400'} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 bg-blue-900/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                        {prop.municipality || 'الجلفة'}
                      </div>
                   </div>
                   <div className="p-5 flex flex-col gap-3">
                      <h3 className="font-bold text-xl text-blue-900 line-clamp-1">{prop.title}</h3>
                      <div className="flex items-center justify-end gap-2 text-gray-500 text-sm">
                        <span>{prop.address}</span>
                        <MapPin size={16} className="text-orange-500" />
                      </div>
                      <div className="flex justify-between items-center mt-2 border-t pt-4">
                         <div className="text-xl font-bold text-orange-600">{prop.price} <span className="text-xs font-normal">دج</span></div>
                         <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <Phone size={18} />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;