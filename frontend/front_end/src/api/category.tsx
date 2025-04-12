const API_URL = "http://localhost:8080/api/v1/category";

interface ResponseDTO<T> {
    code: string;
    message: string;
    data: T;
}

export interface Category {
    id: number;
    name: string;
    active: boolean;
}

export const saveCategory = (
    category: { name: string; active: boolean }
): Promise<ResponseDTO<Category>> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${API_URL}/add`;
        const token = localStorage.getItem("token"); // Retrieve the token

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`); // Include the token

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response: ResponseDTO<Category> = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        console.error("Error parsing response:", error);
                        reject(error);
                    }
                } else {
                    console.error("HTTP error! Status:", xhr.status);
                    reject(new Error(`HTTP error! Status: ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => {
            console.error("Network error occurred");
            reject(new Error("Network error occurred"));
        };

        xhr.send(JSON.stringify(category));
    });
};

export const loadAllCategories = (): Promise<ResponseDTO<Category[]>> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${API_URL}/all`;
        const token = localStorage.getItem("token");

        xhr.open("GET", url, true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const responseText = xhr.responseText;
                        console.log("Raw API Response:", responseText);
                        const apiResponse = JSON.parse(responseText);

                        // Adjust this based on the actual API response structure
                        const categories: Category[] = apiResponse.data || apiResponse.result || apiResponse;

                        const response: ResponseDTO<Category[]> = {
                            code: "SUCCESS",
                            message: "Categories loaded successfully",
                            data: categories,
                        };
                        resolve(response);
                    } catch (error) {
                        console.error("Error parsing response:", error);
                        reject(error);
                    }
                } else {
                    console.error("HTTP error! Status:", xhr.status);
                    reject(new Error(`HTTP error! Status: ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => {
            console.error("Network error occurred");
            reject(new Error("Network error occurred"));
        };

        xhr.send();
    });
};

export const updateCategory = (editingCategoryId: string, categoryData: Category): void => {
    const xhr = new XMLHttpRequest();

    loadAllCategories()
        .then(response => {
            const categories = response.data;
            const categoryToUpdate = categories.find(category => category.id === Number(editingCategoryId));

            if (!categoryToUpdate) {
                console.error("Category not found");
                return;
            }

            // Update the category data
            categoryData.id = categoryToUpdate.id;
            categoryData.name = categoryToUpdate.name;
            categoryData.active = categoryToUpdate.active;
        })
        .catch(error => {
            console.error("Error loading categories:", error);
        });

    const url = `${API_URL}/update`;
    const token = localStorage.getItem("token");

    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("Category updated successfully");
            } else {
                console.error("HTTP error! Status:", xhr.status);
            }
        }
    };

    xhr.onerror = () => {
        console.error("Network error occurred");
    };

    xhr.send(JSON.stringify(categoryData));
};

export const deactivateCategory = (categoryId: number): Promise<ResponseDTO<Category>> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${API_URL}/deactivate/${categoryId}`;
        const token = localStorage.getItem("token");

        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response: ResponseDTO<Category> = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        console.error("Error parsing response:", error);
                        reject(error);
                    }
                } else {
                    console.error("HTTP error! Status:", xhr.status);
                    reject(new Error(`HTTP error! Status: ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => {
            console.error("Network error occurred");
            reject(new Error("Network error occurred"));
        };

        xhr.send();
    });
}
