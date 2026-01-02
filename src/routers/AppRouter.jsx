import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Homepage from "../pages/homepage";
import MainLayout from "../layout/MainLayout";
import RolePage from "../pages/rolepage";
import BuyerRegisterPage from "../pages/buyerRegister";
import SellerRegisterPage from "../pages/sellerRegister";
import LoginPage from "../componenets/auth/loginForm";
import ProfilePage from "../pages/profilePage";
import Dashboard from "../pages/seller/sellerDashboard";
import EditProduct from "../pages/seller/editProduct";
import NewArrival from "../pages/newArrival";
import ProductDetails from "../pages/productDetailsPage";
import Wishlist from "../pages/wishlist"
import Cart from "../pages/cart"
import ShopPage from "../pages/shopPage";
import CheckoutPage from "../pages/checkoutPage";
import DealsPage from "../pages/deals";
import Deals from "../pages/seller/CreateDeals";
import Products from "../pages/producPage"
import Order from "../pages/seller/sellerOrder"
import SellerProfile from "../pages/seller/sellerProfile"

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
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/seller/products/edit/:id" element={<EditProduct />} />
        <Route path="/newArrival/:categoryName" element={<NewArrival />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/createdeals" element={<Deals/>}/>
        <Route path="/order" element={<Order/>}/>
        <Route path="/sellerProfile" element={<SellerProfile/>}/>
        {/*Buyer*/}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/newArrival" element={<NewArrival />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop/:sellerId" element={<ShopPage/>}/>
        <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="/deals" element={<DealsPage/>} />
        <Route path="/products" element={<Products/>}/>
      </Routes>
    </BrowserRouter>
  );
}
