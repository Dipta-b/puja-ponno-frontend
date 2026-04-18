import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Wallet, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout() {

  const { cartItems, clearCart } = useCart();

  const [deliveryArea, setDeliveryArea] = useState('inside');
  const [paymentMethod, setPaymentMethod] = useState('bkash');

  // 🧾 USER INPUT STATES (IMPORTANT)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const deliveryCharge = deliveryArea === 'inside' ? 60 : 120;

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal + deliveryCharge;

  // ===============================
  // 💳 SSL PAYMENT FUNCTION (HERE)
  // ===============================
  const handlePayment = async () => {
    try {

      if (!cartItems.length) {
        return alert("Cart is empty");
      }

      if (!name || !phone || !address) {
        return alert("Please fill all fields");
      }

      const res = await fetch("http://localhost:5000/payment/create-payment", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cartItems,
          phone,
          address,
          deliveryArea
        })
      });

      const data = await res.json();

      if (data.gatewayUrl) {
        // 🔥 redirect to SSLCommerz
        window.location.href = data.gatewayUrl;
      } else {
        alert("Payment init failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-matte-sandal pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="font-heading text-3xl md:text-4xl text-sindoor-red mb-8 text-center">
          নিরাপদ চেকআউট
        </h1>

        <div className="space-y-8">

          {/* DELIVERY INFO */}
          <motion.div className="bg-white/60 p-6 rounded-2xl">

            <h2 className="font-bengali text-xl mb-4">ডেলিভারি তথ্য</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                className="p-3 border rounded-xl"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="মোবাইল নাম্বার"
                className="p-3 border rounded-xl"
              />
            </div>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ঠিকানা"
              className="w-full mt-3 p-3 border rounded-xl"
              rows={3}
            />

          </motion.div>

          {/* ORDER SUMMARY */}
          <motion.div className="bg-sindoor-red/5 p-6 rounded-2xl">

            <h2 className="font-bengali text-xl mb-4">অর্ডার সারসংক্ষেপ</h2>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>৳{deliveryCharge}</span>
            </div>

            <div className="flex justify-between font-bold mt-3">
              <span>Total</span>
              <span>৳{total}</span>
            </div>

          </motion.div>

          {/* PAY BUTTON */}
          <motion.button
            onClick={handlePayment}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-sindoor-red to-golden-orange text-white rounded-xl font-bengali font-semibold text-lg flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            অর্ডার কনফার্ম করুন
          </motion.button>

        </div>
      </div>
    </div>
  );
}