import { apiClient } from "./apiClient";

// Add type for better error handling
type AuthResponse = {
  statusText: "success" | "error";
  data?: any;
  error?: string;
};

const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });

    return {
      statusText: "success",
      data: response.data,
    };
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error("Signup error:", errorMessage);
    
    // Handle duplicate email specifically
    const userMessage = errorMessage.includes("Unique constraint failed") 
      ? "This email is already registered"
      : "Signup failed. Please try again";

    return {
      statusText: "error",
      error: userMessage,
    };
  }
};

const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });

    return {
      statusText: "success",
      data: response.data,
    };
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error("Login error:", errorMessage);

    // Handle invalid credentials specifically
    const userMessage = errorMessage.includes("Email or Password Invalid")
      ? "Invalid email or password"
      : "Login failed. Please try again";

    return {
      statusText: "error",
      error: userMessage,
    };
  }
};

// Helper function to handle HTML error responses
const extractErrorMessage = (error: any): string => {
  if (typeof error.response?.data === "string") {
    // Handle HTML error responses
    const htmlString = error.response.data;
    const match = htmlString.match(/<pre>Error: (.*?)<br>/);
    return match ? match[1] : "Unknown error occurred";
  }
  
  return error.response?.data?.message || error.message;
};

export default {
  signup,
  login,
};