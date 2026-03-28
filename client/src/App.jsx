 import { db, auth } from './firebase'; // أضفنا auth هنا
import { Suspense, useState, useEffect } from "react"; // أضفنا useEffect
import { onAuthStateChanged } from "firebase/auth"; // مراقب حالة المستخدم
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import { MantineProvider } from '@mantine/core';

// الاستيرادات الخاصة بالصفحات
import Login from "./pages/Login/Login";
import Website from "./pages/Website";
import Properties from "./pages/Properties/Properties";
import Agencies from "./pages/Agencies/Agencies";
import Property from "./pages/Property/Property";
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
import AddProperty from "./pages/AddProperty/AddProperty";
import Notaries from "./pages/Notaries/Notaries";
import Register from "./pages/Register/Register"; 
import Dashboard from './pages/Dashboard/Dashboard';
import Layout from "./components/Layout/Layout";
import UserDetailContext from "./context/UserDetailContext";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const queryClient = new QueryClient();
  
  // 1. تعريف حالة المستخدم (user) وحالة التحميل
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
  });

  // 2. مراقبة حالة تسجيل الدخول من Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. منع الرندرة قبل التأكد من حالة المستخدم
  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>جاري التحميل...</div>;

  return (
    <MantineProvider theme={{ dir: 'rtl' }}> 
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div dir="rtl"> 
              <Suspense fallback={<div>جاري التحميل...</div>}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Website />} />
                    
                    <Route path="/properties">
                      <Route index element={<Properties />} />
                      <Route path=":propertyId" element={<Property />} />
                    </Route>

                    {/* مسارات محمية: تفتح فقط إذا كان user موجود */}
                    <Route 
                      path="/dashboard" 
                      element={user ? <Dashboard /> : <Navigate to="/login" />} 
                    />
                    <Route 
                      path="/add-property" 
                      element={user ? <AddProperty /> : <Navigate to="/login" />} 
                    />

                    {/* مسارات عامة */}
                    <Route path="/agencies" element={<Agencies />} /> 
                    <Route path="/notaries" element={<Notaries />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/favourites" element={<Favourites />} />

                    {/* مسارات الحساب: تمنع الدخول لصفحة Login إذا كان مسجلاً بالفعل */}
                    <Route 
                      path="/login" 
                      element={!user ? <Login /> : <Navigate to="/dashboard" />} 
                    />
                    <Route 
                      path="/register" 
                      element={!user ? <Register /> : <Navigate to="/dashboard" />} 
                    />
                  </Route>
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserDetailContext.Provider>
    </MantineProvider>
  );
}

export default App;