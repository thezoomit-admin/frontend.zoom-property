"use server";

import { baseApi } from "../../base-api";

export async function submitContactForm(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const createLeadRaw = String(data.createLead ?? "").toLowerCase();
  const createLead =
    createLeadRaw === "1" ||
    createLeadRaw === "true" ||
    createLeadRaw === "yes";

  const payload = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.message,
    subject: data.subject || "Website Enquiry",
    type: createLead ? "Lead" : "General",
    enquiry: data.enquiry,
    area: data.area,
    subArea: data.subArea,
    budget: data.budget,
    source: data.source || "Contact Page",
    createLead,
  };

  const response = await baseApi.post("inquiries/contact", payload);

  if (!response?.success) {
    return { success: false, error: response?.message || "Something went wrong" };
  }

  return { success: true };
}
