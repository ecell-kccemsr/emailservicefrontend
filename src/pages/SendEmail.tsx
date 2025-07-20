import React, { useState, useEffect, useCallback } from 'react';
import { Send, Users, Eye, X } from 'lucide-react';
import { apiService } from '../services/api';
import { Template, User } from '../types';

interface EmailForm {
  recipientType: 'single' | 'multiple' | 'filtered';
  recipientEmail: string;
  selectedUsers: string[];
  filterDepartment: string;
  filterYear: string;
  filterSubscribed: boolean;
  templateId: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  templateData: Record<string, string>;
  campaign: string;
}

const SendEmail: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [sending, setSending] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [formData, setFormData] = useState<EmailForm>({
    recipientType: 'single',
    recipientEmail: '',
    selectedUsers: [],
    filterDepartment: '',
    filterYear: '',
    filterSubscribed: true,
    templateId: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    templateData: {},
    campaign: 'manual',
  });

  const departments = ['Computer Engineering', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
  const years = ['FE', 'SE', 'TE', 'BE', 'Alumni', 'Faculty'];

  useEffect(() => {
    fetchTemplates();
    fetchUsers();
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users;

    if (formData.filterDepartment) {
      filtered = filtered.filter(user => user.department === formData.filterDepartment);
    }

    if (formData.filterYear) {
      filtered = filtered.filter(user => user.year === formData.filterYear);
    }

    if (formData.filterSubscribed) {
      filtered = filtered.filter(user => user.isSubscribed);
    }

    setFilteredUsers(filtered);
  }, [users, formData.filterDepartment, formData.filterYear, formData.filterSubscribed]);

  useEffect(() => {
    if (formData.recipientType === 'filtered') {
      filterUsers();
    }
  }, [formData.recipientType, filterUsers]);

  const fetchTemplates = async () => {
    try {
      const response = await apiService.getTemplates({ 
        limit: 100, 
        isActive: true 
      });
      setTemplates(response.templates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers({ 
        limit: 1000, 
        isSubscribed: true 
      });
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t._id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData({
        ...formData,
        templateId,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent || '',
        templateData: template.placeholders.reduce((acc, placeholder) => {
          acc[placeholder.key] = placeholder.defaultValue;
          return acc;
        }, {} as Record<string, string>)
      });
    }
  };

  const processTemplate = (content: string): string => {
    let processed = content;
    Object.entries(formData.templateData).forEach(([key, value]) => {
      const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
      processed = processed.replace(regex, value);
    });
    return processed;
  };

  const getRecipientCount = (): number => {
    switch (formData.recipientType) {
      case 'single':
        return formData.recipientEmail ? 1 : 0;
      case 'multiple':
        return formData.selectedUsers.length;
      case 'filtered':
        return filteredUsers.length;
      default:
        return 0;
    }
  };

  const handleSendEmail = async () => {
    setSending(true);
    try {
      const emailData = {
        subject: processTemplate(formData.subject),
        htmlContent: processTemplate(formData.htmlContent),
        textContent: formData.textContent ? processTemplate(formData.textContent) : undefined,
        templateId: formData.templateId || undefined,
        templateData: formData.templateData,
        campaign: formData.campaign,
      };

      if (formData.recipientType === 'single') {
        await apiService.sendEmail({
          recipientEmail: formData.recipientEmail,
          ...emailData,
        });
      } else if (formData.recipientType === 'multiple') {
        const selectedUsersData = users.filter(user => formData.selectedUsers.includes(user._id));
        await apiService.sendBulkEmail({
          recipients: selectedUsersData.map(user => ({ 
            email: user.email, 
            templateData: formData.templateData 
          })),
          ...emailData,
        });
      } else if (formData.recipientType === 'filtered') {
        await apiService.sendBulkEmail({
          recipients: filteredUsers.map(user => ({ 
            email: user.email, 
            templateData: formData.templateData 
          })),
          ...emailData,
        });
      }

      alert(`Email sent successfully to ${getRecipientCount()} recipient(s)!`);
      
      // Reset form
      setFormData({
        recipientType: 'single',
        recipientEmail: '',
        selectedUsers: [],
        filterDepartment: '',
        filterYear: '',
        filterSubscribed: true,
        templateId: '',
        subject: '',
        htmlContent: '',
        textContent: '',
        templateData: {},
        campaign: 'manual',
      });
      setSelectedTemplate(null);
      
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Send Email</h1>
          <p className="text-gray-600">Compose and send emails to your users</p>
        </div>
        <div className="flex items-center space-x-4">
          {getRecipientCount() > 0 && (
            <div className="flex items-center text-green-600">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {getRecipientCount()} recipient{getRecipientCount() !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button
            onClick={() => setPreviewOpen(true)}
            disabled={!formData.subject || !formData.htmlContent}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSendEmail}
            disabled={sending || !formData.subject || !formData.htmlContent || getRecipientCount() === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipients */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Recipients</h3>
            
            <div className="space-y-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="single"
                    checked={formData.recipientType === 'single'}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value as 'single' })}
                    className="mr-2"
                  />
                  Single Recipient
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="multiple"
                    checked={formData.recipientType === 'multiple'}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value as 'multiple' })}
                    className="mr-2"
                  />
                  Select Users
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="filtered"
                    checked={formData.recipientType === 'filtered'}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value as 'filtered' })}
                    className="mr-2"
                  />
                  Filter Users
                </label>
              </div>

              {formData.recipientType === 'single' && (
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}

              {formData.recipientType === 'multiple' && (
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                  {users.map((user) => (
                    <label key={user._id} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        checked={formData.selectedUsers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ 
                              ...formData, 
                              selectedUsers: [...formData.selectedUsers, user._id] 
                            });
                          } else {
                            setFormData({ 
                              ...formData, 
                              selectedUsers: formData.selectedUsers.filter(id => id !== user._id) 
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {user.firstName} {user.lastName} ({user.email})
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {formData.recipientType === 'filtered' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={formData.filterDepartment}
                      onChange={(e) => setFormData({ ...formData, filterDepartment: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>

                    <select
                      value={formData.filterYear}
                      onChange={(e) => setFormData({ ...formData, filterYear: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">All Years</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>

                    <label className="flex items-center px-3">
                      <input
                        type="checkbox"
                        checked={formData.filterSubscribed}
                        onChange={(e) => setFormData({ ...formData, filterSubscribed: e.target.checked })}
                        className="mr-2"
                      />
                      Subscribed only
                    </label>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {filteredUsers.length} users match your criteria
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Content */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Email Content</h3>
            
            <div className="space-y-4">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Template (Optional)
                </label>
                <select
                  value={formData.templateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a template or compose manually</option>
                  {templates.map(template => (
                    <option key={template._id} value={template._id}>
                      {template.name} ({template.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.campaign}
                  onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                  placeholder="e.g., Weekly Newsletter, Event Announcement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* HTML Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HTML Content *
                </label>
                <textarea
                  required
                  rows={12}
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                  placeholder="Enter HTML email content"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
              </div>

              {/* Text Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plain Text Content (Optional)
                </label>
                <textarea
                  rows={6}
                  value={formData.textContent}
                  onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                  placeholder="Plain text version"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Data */}
          {selectedTemplate && selectedTemplate.placeholders.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Template Variables</h3>
              <div className="space-y-3">
                {selectedTemplate.placeholders.map((placeholder) => (
                  <div key={placeholder.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {placeholder.key}
                    </label>
                    <input
                      type="text"
                      value={formData.templateData[placeholder.key] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          [placeholder.key]: e.target.value
                        }
                      })}
                      placeholder={placeholder.description}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Send Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-medium">{getRecipientCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Campaign:</span>
                <span className="font-medium">{formData.campaign || 'Manual'}</span>
              </div>
              {formData.templateId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Template:</span>
                  <span className="font-medium">{selectedTemplate?.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Email Preview</h3>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="text-sm">
                    <strong>Subject:</strong> {processTemplate(formData.subject)}
                  </div>
                </div>
                <div className="p-4">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: processTemplate(formData.htmlContent) 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendEmail;
