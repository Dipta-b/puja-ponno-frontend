import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddProduct = () => {
    const { register, handleSubmit, setValue, watch } = useForm();

    const predefinedCategories = [
        { _id: "pre-1", name: "Puja Packages", slug: "puja-packages" },
        { _id: "pre-2", name: "Daily Puja Items", slug: "daily-puja-items" },
        { _id: "pre-3", name: "Festival Special", slug: "festival-special" },
        { _id: "pre-4", name: "Puja Accessories", slug: "puja-accessories" },
        { _id: "pre-5", name: "Prasad & Items", slug: "prasad-items" },
        { _id: "pre-6", name: "Gift Hampers", slug: "gift-hampers" }
    ];

    const [categories, setCategories] = useState(predefinedCategories);

    const [items, setItems] = useState([{ name: "", quantity: "" }]);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const API = "http://localhost:5000";

    // 🔥 Load categories dynamically
    useEffect(() => {
        fetch(`${API}/categories`)
            .then((res) => res.json())
            .then((data) => {
                const predefinedNames = predefinedCategories.map(p => p.name);
                const uniqueFetched = data.filter(d => !predefinedNames.includes(d.name));
                setCategories([...predefinedCategories, ...uniqueFetched]);
            });
    }, []);

    // 🔥 Image upload (ImageBB)
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

    // 🔥 URL preview
    const handleUrlPreview = () => {
        const url = watch("imageUrl");
        if (!url) return;

        setValue("thumbnail", url);
        setPreview(url);
    };

    // 🔥 Add item field
    const addItem = () => {
        setItems([...items, { name: "", quantity: "" }]);
    };

    // 🔥 Remove item
    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // 🔥 Submit
    const onSubmit = async (data) => {
        try {
            const selectedCategory = categories.find(
                (c) => c.name === data.category
            );

            const productData = {
                ...data,
                categorySlug: selectedCategory?.slug,
                itemsIncluded: items,
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

            if (!res.ok) throw new Error("Failed to add product");

            setMessage("✅ Product added successfully!");
        } catch (err) {
            setMessage("❌ Error adding product");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>

            {message && <p className="text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Name */}
                <input
                    {...register("name", { required: true })}
                    placeholder="Product Name"
                    className="w-full p-2 border rounded"
                />

                {/* Category */}
                <select {...register("category", { required: true })}
                    className="w-full p-2 border rounded">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Price */}
                <input
                    type="number"
                    {...register("price")}
                    placeholder="Price"
                    className="w-full p-2 border rounded"
                />

                {/* Discount */}
                <input
                    type="number"
                    {...register("discountPrice")}
                    placeholder="Discount Price"
                    className="w-full p-2 border rounded"
                />

                {/* Stock */}
                <input
                    type="number"
                    {...register("stock")}
                    placeholder="Stock"
                    className="w-full p-2 border rounded"
                />

                {/* Image URL */}
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

                {/* Upload */}
                <input type="file" onChange={handleFileUpload} />

                {uploading && <p>Uploading...</p>}

                {preview && <img src={preview} className="w-32 mt-2" />}

                {/* Items Included */}
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
                    <button type="button" onClick={addItem} className="mt-2 text-blue-500">
                        + Add Item
                    </button>
                </div>

                {/* Flags */}
                <label className="flex gap-2">
                    <input type="checkbox" {...register("isFeatured")} />
                    Featured
                </label>

                <label className="flex gap-2">
                    <input type="checkbox" {...register("isBestSeller")} />
                    Best Seller
                </label>

                {/* Description */}
                <textarea
                    {...register("description")}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                />

                {/* Purity Note */}
                <input
                    {...register("purityNote")}
                    placeholder="Purity Note"
                    className="w-full p-2 border rounded"
                />

                {/* Submit */}
                <button className="w-full bg-blue-600 text-white py-2 rounded">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;