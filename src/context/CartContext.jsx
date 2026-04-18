import React, { useContext, useState, useEffect, createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user, loading: userLoading } = useContext(AuthContext);

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const API = "http://localhost:5000";

    // ✅ LOAD CART BY EMAIL (IMPORTANT FIX)
    useEffect(() => {
        if (userLoading) return;

        if (!user?.email) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        const fetchCart = async () => {
            try {
                setLoading(true);

                const res = await fetch(`${API}/cart`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                setCartItems(Array.isArray(data.items) ? data.items : []);
            } catch (err) {
                console.error("Cart fetch error:", err);
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user, userLoading]);

    // ✅ SYNC CART BY EMAIL
    const syncCart = async (items) => {
        if (!user?.email) return;

        try {
            await fetch(`${API}/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    items,
                }),
            });
        } catch (err) {
            console.error("Cart sync error:", err);
        }
    };

    // ✅ ADD TO CART (GLOBAL USABLE)
    const addToCart = (product, qty = 1, isUpdate = true) => {
        setCartItems((prev) => {
            const safe = Array.isArray(prev) ? prev : [];
            const updated = [...safe];

            const index = updated.findIndex((i) => i._id === product._id);

            if (index > -1) {
                updated[index] = {
                    ...updated[index],
                    quantity: updated[index].quantity + qty
                };

                if (updated[index].quantity <= 0) {
                    updated.splice(index, 1);
                }
            } else {
                updated.push({ ...product, quantity: qty });
            }

            syncCart(updated);
            if (isUpdate) {
                toast.success(qty > 0 ? "পণ্যটি কার্টে যোগ করা হয়েছে" : "কার্ট আপডেট করা হয়েছে", { id: 'cart' });
            }
            return updated;
        });
    };

    // ✅ REMOVE
    const removeFromCart = (id) => {
        setCartItems((prev) => {
            const updated = prev.filter((i) => i._id !== id);
            syncCart(updated);
            toast.success("পণ্যটি কার্ট থেকে সরানো হয়েছে");
            return updated;
        });
    };

    // ✅ CLEAR
    const clearCart = async () => {
        if (!user?.email) return;

        setCartItems([]);

        try {
            await fetch(`${API}/cart`, {
                method: "DELETE",
                credentials: "include",
            });
            toast.success('সম্পূর্ণ কার্ট ক্লিয়ার করা হয়েছে');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                loading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};