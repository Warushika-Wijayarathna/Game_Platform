import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/category"; // Replace with your backend URL if different

// Function to fetch all categories
export const fetchAllCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data; // Assuming the backend returns the categories in the response body
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
