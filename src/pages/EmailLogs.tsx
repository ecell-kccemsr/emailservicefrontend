import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Download, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiService } from '../services/api';
import { EmailLog } from '../types';

const EmailLogs: React.FC = () => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');
  const [templateFilter, setTemplateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // Preview modal
  const [previewLog, setPreviewLog] = useState<EmailLog | null>(null);

  const fetchEmailLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        campaign: campaignFilter,
        templateId: templateFilter,
        status: statusFilter,
        startDate,
        endDate,
      };

      const response = await apiService.getEmailLogs(params);
      setEmailLogs(response.logs);
      setTotalPages(response.pagination.totalPages);
      setTotalLogs(response.pagination.totalLogs);
    } catch (error) {
      console.error('Failed to fetch email logs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, campaignFilter, templateFilter, statusFilter, startDate, endDate]);

  useEffect(() => {
    fetchEmailLogs();
  }, [fetchEmailLogs]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'failed':
      case 'bounced':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportLogs = async () => {
    try {
      const allLogsParams = {
        page: 1,
        limit: 1000,
        campaign: campaignFilter,
        templateId: templateFilter,
        status: statusFilter,
        startDate,
        endDate,
      };
      
      const response = await apiService.getEmailLogs(allLogsParams);
      const csvContent = [
        ['Date', 'Campaign', 'Template', 'Recipients', 'Subject', 'Success Rate'],
        ...response.logs.map(log => [
          formatDate(log.createdAt),
          log.campaign || 'Manual',
          log.templateId?.name || 'Custom',
          log.recipients.length.toString(),
          log.subject,
          `${((log.successCount / log.totalRecipients) * 100).toFixed(1)}%`
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'email-logs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Logs</h1>
          <p className="text-gray-600">View and manage email sending history</p>
        </div>
        <button
          onClick={exportLogs}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          
          <input
            type="text"
            placeholder="Campaign"
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="End Date"
          />

          <button
            onClick={() => {
              setSearchTerm('');
              setCampaignFilter('');
              setTemplateFilter('');
              setStatusFilter('');
              setStartDate('');
              setEndDate('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Email Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emailLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {formatDate(log.createdAt)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.campaign || 'Manual'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {log.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-1" />
                          {log.recipients.length}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.templateId?.name || (
                          <span className="text-gray-400 italic">Custom</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.failureCount === 0 ? 'text-green-600 bg-green-100' : 
                          log.successCount === 0 ? 'text-red-600 bg-red-100' : 
                          'text-yellow-600 bg-yellow-100'
                        }`}>
                          {log.failureCount === 0 ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span className="ml-1">Sent</span>
                            </>
                          ) : log.successCount === 0 ? (
                            <>
                              <XCircle className="h-4 w-4" />
                              <span className="ml-1">Failed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4" />
                              <span className="ml-1">Partial</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {((log.successCount / log.totalRecipients) * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.successCount}/{log.totalRecipients}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setPreviewLog(log)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalLogs)} of {totalLogs} logs
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Email Preview Modal */}
      {previewLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Email Details</h3>
                <button
                  onClick={() => setPreviewLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Email Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Campaign:</span>
                    <span className="ml-2 text-sm text-gray-900">{previewLog.campaign || 'Manual'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Sent:</span>
                    <span className="ml-2 text-sm text-gray-900">{formatDate(previewLog.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Recipients:</span>
                    <span className="ml-2 text-sm text-gray-900">{previewLog.recipients.length}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Template:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {previewLog.templateId?.name || 'Custom'}
                    </span>
                  </div>
                </div>

                {/* Recipients List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recipients:</h4>
                  <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                    {previewLog.recipients.map((recipient, index) => (
                      <div key={index} className="flex justify-between items-center py-1 text-sm">
                        <span>{recipient.email}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(recipient.status)}`}>
                          {recipient.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Content */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="text-sm">
                      <strong>Subject:</strong> {previewLog.subject}
                    </div>
                  </div>
                  {previewLog.htmlContent && (
                    <div className="p-4 max-h-96 overflow-y-auto">
                      <div dangerouslySetInnerHTML={{ __html: previewLog.htmlContent }} />
                    </div>
                  )}
                  {previewLog.textContent && (
                    <div className="p-4 border-t bg-gray-50">
                      <div className="text-sm font-medium text-gray-700 mb-2">Plain Text Version:</div>
                      <div className="text-sm text-gray-900 whitespace-pre-wrap">
                        {previewLog.textContent}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailLogs;
