import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddProduct = () => {
    const { register, handleSubmit, setValue, watch } = useForm();

    const predefinedCategories = [
        { _id: "pre-1", name: "Puja Packages", nameBn: "পূজা প্যাকেজ", slug: "puja-packages" },
        { _id: "pre-2", name: "Daily Puja Items", nameBn: "নিত্য পূজার সামগ্রী", slug: "daily-puja-items" },
        { _id: "pre-3", name: "Festival Special", nameBn: "উৎসব স্পেশাল", slug: "festival-special" },
        { _id: "pre-4", name: "Puja Accessories", nameBn: "পূজার অনুষঙ্গ", slug: "puja-accessories" },
        { _id: "pre-5", name: "Prasad & Items", nameBn: "প্রসাদ ইত্যাদি", slug: "prasad-items" },
        { _id: "pre-6", name: "Gift Hampers", nameBn: "উপহার সামগ্রী", slug: "gift-hampers" }
    ];

    const [categories, setCategories] = useState(predefinedCategories);

    const [items, setItems] = useState([{ name: "", quantity: "" }]);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const API = "http://localhost:5000";

    // Load categories
    useEffect(() => {
        fetch(`${API}/categories`)
            .then((res) => res.json())
            .then((data) => {
                const predefinedNames = predefinedCategories.map(p => p.name);
                const uniqueFetched = data.filter(d => !predefinedNames.includes(d.name));
                setCategories([...predefinedCategories, ...uniqueFetched]);
            });
    }, []);

    // Image upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
                { method: "POST", body: formData }
            );

            const data = await res.json();
            const url = data.data.url;

            setValue("thumbnail", url);
            setPreview(url);
        } catch (err) {
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    // URL preview
    const handleUrlPreview = () => {
        const url = watch("imageUrl");
        if (!url) return;

        setValue("thumbnail", url);
        setPreview(url);
    };

    const addItem = () => {
        setItems([...items, { name: "", quantity: "" }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // 🔥 FIXED SUBMIT
    const onSubmit = async (data) => {
        try {
            const selectedCategory = categories.find(
                (c) => c.name === data.category
            );

            // 🔥 CLEAN ITEMS (IMPORTANT FIX)
            const cleanItems = items.filter(
                (i) => i.name.trim() !== "" && i.quantity.trim() !== ""
            );

            const productData = {
                ...data,

                // FIX: ensure thumbnail always exists
                thumbnail: data.thumbnail || preview || "",

                categorySlug: selectedCategory?.slug || "",

                itemsIncluded: cleanItems,

                createdAt: new Date(),
            };

            const res = await fetch(`${API}/products`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed");
            }

            setMessage("✅ Product added successfully!");

            // reset (optional but good)
            setItems([{ name: "", quantity: "" }]);
            setPreview("");

        } catch (err) {
            setMessage("❌ " + err.message);
        }
    };

    return (
        <div className="max-w-3xl mx-4 sm:mx-auto mt-28 sm:mt-32 mb-10 p-4 sm:p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>

            {message && <p className="text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <input
                    {...register("name", { required: true })}
                    placeholder="Product Name"
                    className="w-full p-2 border rounded"
                />

                <select
                    {...register("category", { required: true })}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                            {cat.name} {cat.nameBn ? `(${cat.nameBn})` : ""}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    {...register("price")}
                    placeholder="Price"
                    className="w-full p-2 border rounded"
                />

                <input
                    type="number"
                    {...register("discountPrice")}
                    placeholder="Discount Price"
                    className="w-full p-2 border rounded"
                />

                <input
                    type="number"
                    {...register("stock")}
                    placeholder="Stock"
                    className="w-full p-2 border rounded"
                />

                <input
                    {...register("imageUrl")}
                    placeholder="Paste image URL"
                    className="w-full p-2 border rounded"
                />

                <button
                    type="button"
                    onClick={handleUrlPreview}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                    Use URL
                </button>

                <p className="text-center text-gray-400">OR</p>

                <input type="file" onChange={handleFileUpload} />

                {uploading && <p>Uploading...</p>}

                {preview && <img src={preview} className="w-32 mt-2" />}

                <div>
                    <h3 className="font-semibold">Items Included</h3>

                    {items.map((item, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                            <input
                                placeholder="Item name"
                                className="border p-2 w-1/2"
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].name = e.target.value;
                                    setItems(newItems);
                                }}
                            />
                            <input
                                placeholder="Quantity"
                                className="border p-2 w-1/2"
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].quantity = e.target.value;
                                    setItems(newItems);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 text-blue-500"
                    >
                        + Add Item
                    </button>
                </div>

                <label className="flex gap-2">
                    <input type="checkbox" {...register("isFeatured")} />
                    Featured
                </label>

                <label className="flex gap-2">
                    <input type="checkbox" {...register("isBestSeller")} />
                    Best Seller
                </label>

                <textarea
                    {...register("description")}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                />

                <input
                    {...register("purityNote")}
                    placeholder="Purity Note"
                    className="w-full p-2 border rounded"
                />

                <button className="w-full bg-blue-600 text-white py-2 rounded">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;