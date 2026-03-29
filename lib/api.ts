import { apiRequest } from "./apiClient";

export async function adminLogin(email: string, password: string) {
  return apiRequest("/auth/login", "POST", { email, password });
}

export async function getUsers() {
  return apiRequest("/user", "GET");
}

export async function getUserDetails(id: string) {
  return apiRequest(`/user/${id}`, "GET");
}

export async function UpdateUserStatus(id: string, status: string) {
  return apiRequest(`/user/${id}`, "PUT", { status });
}

export async function getProducts() {
  return apiRequest("/product", "GET");
}

export async function getProductDetails(id: string) {
  return apiRequest(`/product/${id}`, "GET");
}

export async function deleteProduct(id: string) {
  return apiRequest(`/product/${id}`, "DELETE");
}

/**
 * Fetch all reports
 */
export async function getReports() {
  return apiRequest("/report", "GET");
}

/**
 * Fetch report details by ID
 */
export async function getReportDetails(id: string) {
  return apiRequest(`/report/${id}`, "GET");
}

/**
 * Update report status
 * @param id Report ID
 * @param status "pending" | "reviewed" | "closed"
 */
export async function updateReportStatus(id:string, status: string) {
  return apiRequest(`/report/${id}/status`, "PUT", { status });
}