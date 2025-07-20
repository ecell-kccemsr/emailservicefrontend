import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Copy, Eye, Image } from 'lucide-react';
import { apiService } from '../services/api';
import { Template, Placeholder } from '../types';

interface TemplateFormData {
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  type: 'welcome' | 'event_invitation' | 'thank_you' | 'custom';
  placeholders: string[];
  isActive: boolean;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTemplates, setTotalTemplates] = useState(0);

  // Form state
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    type: 'custom',
    placeholders: [],
    isActive: true,
  });

  const templateTypes: TemplateFormData['type'][] = ['welcome', 'event_invitation', 'thank_you', 'custom'];

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        type: typeFilter,
        isActive: activeFilter ? activeFilter === 'true' : undefined,
      };

      const response = await apiService.getTemplates(params);
      setTemplates(response.templates);
      setTotalPages(response.pagination.totalPages);
      setTotalTemplates(response.pagination.totalTemplates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, searchTerm, typeFilter, activeFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const templateData = {
        ...formData,
        placeholders: formData.placeholders.map(p => ({ 
          key: p, 
          description: p, 
          defaultValue: '' 
        }))
      };

      if (editingTemplate) {
        await apiService.updateTemplate(editingTemplate._id, templateData);
      } else {
        await apiService.createTemplate(templateData);
      }
      
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({
        name: '',
        subject: '',
        htmlContent: '',
        textContent: '',
        type: 'custom',
        placeholders: [],
        isActive: true,
      });
      fetchTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent || '',
      type: template.type,
      placeholders: template.placeholders.map(p => p.key),
      isActive: template.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await apiService.deleteTemplate(templateId);
        fetchTemplates();
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handleClone = async (template: Template) => {
    try {
      const clonedData = {
        name: `${template.name} (Copy)`,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent || '',
        type: template.type,
        placeholders: template.placeholders,
        isActive: false,
      };
      
      await apiService.createTemplate(clonedData);
      fetchTemplates();
    } catch (error) {
      console.error('Failed to clone template:', error);
    }
  };

  const extractPlaceholders = (content: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = content.match(regex);
    return matches ? Array.from(new Set(matches)) : [];
  };

  const updatePlaceholders = () => {
    const htmlPlaceholders = extractPlaceholders(formData.htmlContent);
    const subjectPlaceholders = extractPlaceholders(formData.subject);
    const allPlaceholders = Array.from(new Set([...htmlPlaceholders, ...subjectPlaceholders]));
    setFormData({ ...formData, placeholders: allPlaceholders });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600">Manage your email templates</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Types</option>
            {templateTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('');
              setActiveFilter('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : (
          templates.map((template) => (
            <div key={template._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {template.subject}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        template.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {template.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Placeholders */}
                {template.placeholders.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Placeholders:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.placeholders.slice(0, 3).map((placeholder, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {placeholder.key}
                        </span>
                      ))}
                      {template.placeholders.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{template.placeholders.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleClone(template)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Clone Template"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-2 text-indigo-400 hover:text-indigo-600"
                    title="Edit Template"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="p-2 text-red-400 hover:text-red-600"
                    title="Delete Template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalTemplates)} of {totalTemplates} templates
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
      )}

      {/* Template Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as TemplateFormData['type'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {templateTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      updatePlaceholders();
                    }}
                    placeholder="Use {{placeholder}} for dynamic content"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HTML Content
                  </label>
                  <textarea
                    required
                    rows={15}
                    value={formData.htmlContent}
                    onChange={(e) => {
                      setFormData({ ...formData, htmlContent: e.target.value });
                      updatePlaceholders();
                    }}
                    placeholder="Enter HTML content... Use {{placeholder}} for dynamic content"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plain Text Content (Optional)
                  </label>
                  <textarea
                    rows={8}
                    value={formData.textContent}
                    onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                    placeholder="Plain text version of your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {formData.placeholders.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detected Placeholders:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.placeholders.map((placeholder, index) => (
                        <span key={index} className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          {placeholder}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active template
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTemplate(null);
                      setFormData({
                        name: '',
                        subject: '',
                        htmlContent: '',
                        textContent: '',
                        type: 'custom',
                        placeholders: [],
                        isActive: true,
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingTemplate ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
