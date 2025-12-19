import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Homepage from "../pages/homepage";
import MainLayout from "../layout/MainLayout";
import RolePage from "../pages/rolepage";
import BuyerRegisterPage from "../pages/buyerRegister";
import SellerRegisterPage from "../pages/sellerRegister";
import LoginPage from "../componenets/auth/loginForm";
import ProfilePage from "../pages/profilePage";
import Dashboard from "../pages/seller/sellerDashboard"
import EditProduct from "../pages/seller/editProduct"
import NewArrival from "../pages/newArrival"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Homepage />
            </MainLayout>
          }
        />
        {/*Authentication */}
        <Route path="/role" element={<RolePage />} />
        <Route path="/register1" element={<BuyerRegisterPage />} />
        <Route path="/register2" element={<SellerRegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/*Seller */}
        <Route path="/dashboard/*" element={<Dashboard/>} />
         <Route
          path="/seller/products/edit/:id"
          element={<EditProduct />}/>
          <Route path="/newArrival" element={<NewArrival/>}/>
          <Route path="/newArrival/:categoryName" element={<NewArrival />} />
        {/*Buyer*/}

      </Routes>
    </BrowserRouter>
  );
}
