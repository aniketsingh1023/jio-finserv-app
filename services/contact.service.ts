const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export const submitContactForm = async (data: ContactFormData) => {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit contact form");
  }

  return result;
};