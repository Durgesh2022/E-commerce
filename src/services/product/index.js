import Cookies from "js-cookie";

// Service to add a new product
export const addNewProduct = async (formData) => {
  try {
    const response = await fetch("/api/admin/add-product", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Service to get all products (No caching)
export const getAllAdminProducts = async () => {
  try {
    const res = await fetch("/api/admin/all-products", {
      method: "GET",
      cache: "no-store", // No caching to avoid dynamic server usage errors
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Service to update a product
export const updateAProduct = async (formData) => {
  try {
    const res = await fetch("/api/admin/update-product", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      cache: "no-store", // Ensures the fetch is not cached
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

// Service to delete a product
export const deleteAProduct = async (id) => {
  try {
    const res = await fetch(`/api/admin/delete-product?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

// Service to get products by category (No caching)
export const productByCategory = async (id) => {
  try {
    const res = await fetch(`/api/admin/product-by-category?id=${id}`, {
      method: "GET",
      cache: "no-store", // No caching as this is dynamic data
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

// Service to get product by ID (No caching)
export const productById = async (id) => {
  try {
    const res = await fetch(`/api/admin/product-by-id?id=${id}`, {
      method: "GET",
      cache: "no-store", // No caching as this is dynamic data
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};
