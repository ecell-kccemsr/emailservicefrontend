export interface Admin {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  lastLogin?: Date;
  createdAt: Date;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department?: string;
  year?: "FE" | "SE" | "TE" | "BE" | "Alumni" | "Faculty";
  phone?: string;
  interests: string[];
  isSubscribed: boolean;
  tags: string[];
  source: "manual" | "event_registration" | "newsletter_signup" | "import";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  _id: string;
  name: string;
  type: "welcome" | "event_invitation" | "thank_you" | "custom";
  subject: string;
  htmlContent: string;
  textContent?: string;
  placeholders: Placeholder[];
  images: TemplateImage[];
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Placeholder {
  key: string;
  description: string;
  defaultValue: string;
}

export interface TemplateImage {
  _id: string;
  cloudinaryId: string;
  url: string;
  alt: string;
}

export interface EmailLog {
  _id: string;
  recipients: EmailRecipient[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: {
    _id: string;
    name: string;
    type: string;
    subject: string;
  };
  templateData?: Record<string, string>;
  sentBy: {
    _id: string;
    name: string;
    email: string;
  };
  campaign?: string;
  tags: string[];
  totalRecipients: number;
  successCount: number;
  failureCount: number;
  openRate: number;
  clickRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailRecipient {
  email: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: "sent" | "failed" | "bounced" | "delivered" | "opened" | "clicked";
  errorMessage?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationInfo & {
    totalUsers: number;
  };
}

export interface TemplatesResponse {
  templates: Template[];
  pagination: PaginationInfo & {
    totalTemplates: number;
  };
}

export interface EmailLogsResponse {
  logs: EmailLog[];
  pagination: PaginationInfo & {
    totalLogs: number;
  };
}

export interface UserStats {
  totalUsers: number;
  subscribedUsers: number;
  unsubscribedUsers: number;
  departmentStats: { _id: string; count: number }[];
  yearStats: { _id: string; count: number }[];
  recentUsers: Partial<User>[];
}

export interface EmailStats {
  overview: {
    totalEmailsSent: number;
    totalRecipients: number;
    successfulEmails: number;
    failedEmails: number;
    successRate: number;
  };
  campaignStats: Array<{
    _id: string;
    count: number;
    totalRecipients: number;
    successCount: number;
  }>;
  templateStats: Array<{
    _id: string;
    templateName: string;
    count: number;
    totalRecipients: number;
    successCount: number;
  }>;
  dailyStats: Array<{
    date: string;
    emailCount: number;
    recipientCount: number;
    successCount: number;
    failureCount: number;
    successRate: string;
  }>;
  period: string;
}

export interface SendEmailRequest {
  recipientEmail?: string;
  recipients?: Array<{
    email: string;
    templateData?: Record<string, string>;
  }>;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: string;
  templateData?: Record<string, string>;
  defaultTemplateData?: Record<string, string>;
  campaign?: string;
  filters?: Record<string, any>;
}
