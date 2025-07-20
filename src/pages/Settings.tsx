import React, { useState, useEffect } from 'react';
import { Save, TestTube, Key, Mail, Cloud, Shield, Bell } from 'lucide-react';
import { apiService } from '../services/api';

interface SMTPSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromName: string;
}

interface CloudinarySettings {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface GeneralSettings {
  siteName: string;
  adminEmail: string;
  defaultSender: string;
  timezone: string;
  dateFormat: string;
}

interface SecuritySettings {
  jwtExpiresIn: string;
  bcryptRounds: number;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  // Settings state
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'E-Cell Email Service',
    adminEmail: 'admin@kccoe.edu.in',
    defaultSender: 'E-Cell KCCOE',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
  });

  const [smtpSettings, setSMTPSettings] = useState<SMTPSettings>({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'kcecell@kccemsr.edu.in',
    password: '',
    fromName: 'E-Cell',
  });

  const [cloudinarySettings, setCloudinarySettings] = useState<CloudinarySettings>({
    cloudName: '',
    apiKey: '',
    apiSecret: '',
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    jwtExpiresIn: '7d',
    bcryptRounds: 12,
    corsOrigin: 'http://localhost:3000',
    rateLimitWindowMs: 900000,
    rateLimitMaxRequests: 100,
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Bell },
    { id: 'smtp', name: 'SMTP Email', icon: Mail },
    { id: 'cloudinary', name: 'Cloudinary', icon: Cloud },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const timezones = [
    'Asia/Kolkata',
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo',
  ];

  const dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY',
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // In a real app, you would fetch these from the API
      // For now, we'll use the default values
      console.log('Settings loaded');
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const saveSettings = async (settingsType: string) => {
    setSaving(true);
    try {
      // In a real app, you would save these to the API
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`${settingsType} settings saved`);
      alert(`${settingsType} settings saved successfully!`);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setTestingEmail(true);
    try {
      await apiService.sendEmail({
        recipientEmail: testEmail,
        subject: 'Email Configuration Test',
        htmlContent: `
          <h2>Email Configuration Test</h2>
          <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
          <p>If you received this email, your email settings are configured properly.</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        `,
        textContent: 'This is a test email to verify SMTP configuration.',
        campaign: 'settings-test',
      });
      
      alert('Test email sent successfully! Please check your inbox.');
    } catch (error) {
      console.error('Failed to send test email:', error);
      alert('Failed to send test email. Please check your SMTP configuration.');
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your email service settings</p>
      </div>

      <div className="flex space-x-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 max-w-4xl">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                <p className="text-sm text-gray-600">Configure basic application settings</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, adminEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Sender Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.defaultSender}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, defaultSender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={generalSettings.dateFormat}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {dateFormats.map(format => (
                        <option key={format} value={format}>{format}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings('General')}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SMTP Settings */}
          {activeTab === 'smtp' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">SMTP Email Configuration</h3>
                <p className="text-sm text-gray-600">Configure your email server settings</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={smtpSettings.host}
                      onChange={(e) => setSMTPSettings({ ...smtpSettings, host: e.target.value })}
                      placeholder="smtp.gmail.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={smtpSettings.port}
                      onChange={(e) => setSMTPSettings({ ...smtpSettings, port: parseInt(e.target.value) })}
                      placeholder="587"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username/Email
                    </label>
                    <input
                      type="email"
                      value={smtpSettings.user}
                      onChange={(e) => setSMTPSettings({ ...smtpSettings, user: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password/App Password
                    </label>
                    <input
                      type="password"
                      value={smtpSettings.password}
                      onChange={(e) => setSMTPSettings({ ...smtpSettings, password: e.target.value })}
                      placeholder="Enter your app password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      value={smtpSettings.fromName}
                      onChange={(e) => setSMTPSettings({ ...smtpSettings, fromName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="secure"
                      checked={smtpSettings.secure}
                      onChange={(e) => setSMTPSettings({ ...smtpSettings, secure: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                    />
                    <label htmlFor="secure" className="text-sm text-gray-700">
                      Use SSL/TLS
                    </label>
                  </div>
                </div>

                {/* Test Email Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Test Email Configuration</h4>
                  <div className="flex space-x-3">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter test email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={testEmailConnection}
                      disabled={testingEmail}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      {testingEmail ? 'Sending...' : 'Send Test'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings('SMTP')}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save SMTP Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cloudinary Settings */}
          {activeTab === 'cloudinary' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Cloudinary Configuration</h3>
                <p className="text-sm text-gray-600">Configure Cloudinary for image uploads in templates</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cloud Name
                    </label>
                    <input
                      type="text"
                      value={cloudinarySettings.cloudName}
                      onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, cloudName: e.target.value })}
                      placeholder="Your Cloudinary cloud name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={cloudinarySettings.apiKey}
                      onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, apiKey: e.target.value })}
                      placeholder="Your Cloudinary API key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={cloudinarySettings.apiSecret}
                      onChange={(e) => setCloudinarySettings({ ...cloudinarySettings, apiSecret: e.target.value })}
                      placeholder="Your Cloudinary API secret"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">How to get Cloudinary credentials:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Sign up at <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline">cloudinary.com</a></li>
                    <li>Go to your dashboard</li>
                    <li>Copy the Cloud Name, API Key, and API Secret</li>
                    <li>Paste them in the fields above</li>
                  </ol>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings('Cloudinary')}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Cloudinary Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <p className="text-sm text-gray-600">Configure security and authentication settings</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      JWT Token Expiry
                    </label>
                    <select
                      value={securitySettings.jwtExpiresIn}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, jwtExpiresIn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="1h">1 Hour</option>
                      <option value="6h">6 Hours</option>
                      <option value="12h">12 Hours</option>
                      <option value="1d">1 Day</option>
                      <option value="7d">7 Days</option>
                      <option value="30d">30 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Hash Rounds
                    </label>
                    <input
                      type="number"
                      min="8"
                      max="15"
                      value={securitySettings.bcryptRounds}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, bcryptRounds: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CORS Origin
                    </label>
                    <input
                      type="url"
                      value={securitySettings.corsOrigin}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, corsOrigin: e.target.value })}
                      placeholder="http://localhost:3000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate Limit Window (ms)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.rateLimitWindowMs}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, rateLimitWindowMs: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Requests per Window
                    </label>
                    <input
                      type="number"
                      value={securitySettings.rateLimitMaxRequests}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, rateLimitMaxRequests: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex">
                    <Shield className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Security Note</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        These settings affect application security. Higher bcrypt rounds provide better security but slower login times. 
                        Rate limiting helps prevent abuse but may affect legitimate users if set too low.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings('Security')}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Security Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
