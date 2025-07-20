import axios, { AxiosInstance } from 'axios';
import {
  Admin,
  User,
  Template,
  EmailLog,
  UsersResponse,
  TemplatesResponse,
  EmailLogsResponse,
  UserStats,
  EmailStats,
  SendEmailRequest,
  ApiResponse,
} from "../types";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:5002/api",
      timeout: 30000,
    });

        // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("admin_data");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; admin: Admin }> {
    const response = await this.api.post("/auth/login", { email, password });
    return response.data;
  }

  async register(adminData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }): Promise<ApiResponse<Admin>> {
    const response = await this.api.post("/auth/register", adminData);
    return response.data;
  }

  async getProfile(): Promise<{ admin: Admin }> {
    const response = await this.api.get("/auth/me");
    return response.data;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    const response = await this.api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  // User methods
  async getUsers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      department?: string;
      year?: string;
      isSubscribed?: boolean;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {}
  ): Promise<UsersResponse> {
    const response = await this.api.get("/users", { params });
    return response.data;
  }

  async getUser(id: string): Promise<{ user: User }> {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.api.post("/users", userData);
    return response.data;
  }

  async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    const response = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/users/${id}`);
    return response.data;
  }

  async bulkUserOperation(
    operation: string,
    userIds: string[],
    data?: any
  ): Promise<ApiResponse<void>> {
    const response = await this.api.post("/users/bulk", {
      operation,
      userIds,
      data,
    });
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.api.get("/users/stats/overview");
    return response.data;
  }

  // Template methods
  async getTemplates(
    params: {
      page?: number;
      limit?: number;
      type?: string;
      isActive?: boolean;
      search?: string;
    } = {}
  ): Promise<TemplatesResponse> {
    const response = await this.api.get("/templates", { params });
    return response.data;
  }

  async getTemplate(id: string): Promise<{ template: Template }> {
    const response = await this.api.get(`/templates/${id}`);
    return response.data;
  }

  async createTemplate(
    templateData: Partial<Template>
  ): Promise<ApiResponse<Template>> {
    const response = await this.api.post("/templates", templateData);
    return response.data;
  }

  async updateTemplate(
    id: string,
    templateData: Partial<Template>
  ): Promise<ApiResponse<Template>> {
    const response = await this.api.put(`/templates/${id}`, templateData);
    return response.data;
  }

  async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/templates/${id}`);
    return response.data;
  }

  async cloneTemplate(
    id: string,
    name: string
  ): Promise<ApiResponse<Template>> {
    const response = await this.api.post(`/templates/${id}/clone`, { name });
    return response.data;
  }

  async previewTemplate(
    id: string,
    sampleData: Record<string, string>
  ): Promise<{
    preview: {
      subject: string;
      htmlContent: string;
      textContent: string;
    };
  }> {
    const response = await this.api.post(`/templates/${id}/preview`, {
      sampleData,
    });
    return response.data;
  }

  async uploadTemplateImage(
    id: string,
    imageData: string,
    alt: string = ""
  ): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/templates/${id}/images`, {
      imageData,
      alt,
    });
    return response.data;
  }

  async removeTemplateImage(
    templateId: string,
    imageId: string
  ): Promise<ApiResponse<void>> {
    const response = await this.api.delete(
      `/templates/${templateId}/images/${imageId}`
    );
    return response.data;
  }

  // Email methods
  async sendEmail(emailData: SendEmailRequest): Promise<ApiResponse<any>> {
    const response = await this.api.post("/emails/send", emailData);
    return response.data;
  }

  async sendBulkEmail(emailData: SendEmailRequest): Promise<ApiResponse<any>> {
    const response = await this.api.post("/emails/send-bulk", emailData);
    return response.data;
  }

  async getEmailLogs(
    params: {
      page?: number;
      limit?: number;
      campaign?: string;
      templateId?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
    } = {}
  ): Promise<EmailLogsResponse> {
    const response = await this.api.get("/emails/logs", { params });
    return response.data;
  }

  async getEmailLog(id: string): Promise<{ log: EmailLog }> {
    const response = await this.api.get(`/emails/logs/${id}`);
    return response.data;
  }

  async getEmailStats(period: string = "30d"): Promise<EmailStats> {
    const response = await this.api.get("/emails/stats", {
      params: { period },
    });
    return response.data;
  }

  async testEmailConnection(): Promise<ApiResponse<any>> {
    const response = await this.api.get("/emails/test-connection");
    return response.data;
  }

  async resendFailedEmails(logId: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/emails/resend-failed/${logId}`);
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  removeAuthToken(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_data");
  }

  getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();
export default apiService;
