import React, { useState, useEffect } from "react";
import {
  Users,
  Mail,
  FileText,
  TrendingUp,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { apiService } from "../services/api";
import { UserStats, EmailStats } from "../types";
import {
  formatNumber,
  formatPercentage,
  formatRelativeTime,
} from "../utils/helpers";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";

const Dashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [userStatsResponse, emailStatsResponse] = await Promise.all([
        apiService.getUserStats(),
        apiService.getEmailStats("30d"),
      ]);

      setUserStats(userStatsResponse);
      setEmailStats(emailStatsResponse);
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert type="error" title="Error" message={error} />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: formatNumber(userStats?.totalUsers || 0),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "blue",
    },
    {
      title: "Emails Sent",
      value: formatNumber(emailStats?.overview.totalEmailsSent || 0),
      change: "+8%",
      changeType: "positive" as const,
      icon: Mail,
      color: "green",
    },
    {
      title: "Active Templates",
      value: formatNumber(emailStats?.templateStats.length || 0),
      change: "+2",
      changeType: "positive" as const,
      icon: FileText,
      color: "purple",
    },
    {
      title: "Success Rate",
      value: formatPercentage(emailStats?.overview.successRate || 0),
      change: "+2.1%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to E-Cell Email Service
            </h2>
            <p className="text-gray-600 mt-2">
              Manage your email campaigns and user communications from this
              dashboard.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            purple: "bg-purple-100 text-purple-600",
            orange: "bg-orange-100 text-orange-600",
          };

          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Users
          </h3>
          <div className="space-y-3">
            {userStats?.recentUsers?.slice(0, 5).map((user) => (
              <div key={user._id} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {formatRelativeTime(user.createdAt!)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Campaign Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Campaigns
          </h3>
          <div className="space-y-3">
            {emailStats?.campaignStats?.slice(0, 5).map((campaign) => (
              <div
                key={campaign._id}
                className="flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {campaign._id || "Default Campaign"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(campaign.totalRecipients)} recipients
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatNumber(campaign.count)} emails
                    </p>
                    <p className="text-xs text-green-600">
                      {formatPercentage(
                        (campaign.successCount / campaign.totalRecipients) * 100
                      )}{" "}
                      success
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      {userStats?.departmentStats && userStats.departmentStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Users by Department
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userStats.departmentStats.map((dept) => (
              <div
                key={dept._id}
                className="text-center p-4 border border-gray-200 rounded-lg"
              >
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(dept.count)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {dept._id || "Other"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
