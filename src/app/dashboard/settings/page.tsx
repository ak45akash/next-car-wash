'use client';

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaSave, FaCog, FaUser, FaBell, FaLock, FaStore, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    businessName: 'Diamond Steam Car Wash',
    email: 'info@diamondsteamwash.com',
    phone: '+91 98765 43210',
    address: '123 Park Avenue, Ludhiana, Punjab, 141001',
    workingHours: '8:00 AM - 8:00 PM',
    website: 'www.diamondsteamwash.com'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    bookingReminders: true,
    marketingUpdates: false,
    systemAlerts: true
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                id="businessName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={generalSettings.businessName}
                onChange={handleGeneralSettingsChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={generalSettings.email}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={generalSettings.phone}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Business Address</label>
              <textarea
                name="address"
                id="address"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={generalSettings.address}
                onChange={handleGeneralSettingsChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700">Working Hours</label>
                <input
                  type="text"
                  name="workingHours"
                  id="workingHours"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={generalSettings.workingHours}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="text"
                  name="website"
                  id="website"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={generalSettings.website}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 mb-4">Configure how and when you receive notifications.</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <button
                  type="button"
                  className={`${
                    notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={() => handleNotificationToggle('emailNotifications')}
                >
                  <span className="sr-only">Toggle email notifications</span>
                  <span
                    className={`${
                      notificationSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="text-base font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <button
                  type="button"
                  className={`${
                    notificationSettings.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={() => handleNotificationToggle('smsNotifications')}
                >
                  <span className="sr-only">Toggle SMS notifications</span>
                  <span
                    className={`${
                      notificationSettings.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Booking Reminders</h4>
                  <p className="text-sm text-gray-500">Send reminders before scheduled bookings</p>
                </div>
                <button
                  type="button"
                  className={`${
                    notificationSettings.bookingReminders ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={() => handleNotificationToggle('bookingReminders')}
                >
                  <span className="sr-only">Toggle booking reminders</span>
                  <span
                    className={`${
                      notificationSettings.bookingReminders ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Marketing Updates</h4>
                  <p className="text-sm text-gray-500">Receive updates about promotions and offers</p>
                </div>
                <button
                  type="button"
                  className={`${
                    notificationSettings.marketingUpdates ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={() => handleNotificationToggle('marketingUpdates')}
                >
                  <span className="sr-only">Toggle marketing updates</span>
                  <span
                    className={`${
                      notificationSettings.marketingUpdates ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <h4 className="text-base font-medium text-gray-900">System Alerts</h4>
                  <p className="text-sm text-gray-500">Important system notifications</p>
                </div>
                <button
                  type="button"
                  className={`${
                    notificationSettings.systemAlerts ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={() => handleNotificationToggle('systemAlerts')}
                >
                  <span className="sr-only">Toggle system alerts</span>
                  <span
                    className={`${
                      notificationSettings.systemAlerts ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 mb-4">Manage your account security settings.</p>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="current-password"
                    id="current-password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Password
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        );
        
      case 'payments':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 mb-4">Configure payment methods and options for your business.</p>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <FaMoneyBillWave className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium text-gray-900">Cash</h4>
                      <p className="text-sm text-gray-500">Accept cash payments</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-blue-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Enable cash payments</span>
                    <span
                      className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium text-gray-900">Credit/Debit Card</h4>
                      <p className="text-sm text-gray-500">Accept card payments</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-blue-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Enable card payments</span>
                    <span
                      className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.5 9C9.5 8.44772 9.94772 8 10.5 8H13.5C14.0523 8 14.5 8.44772 14.5 9V15C14.5 15.5523 14.0523 16 13.5 16H10.5C9.94772 16 9.5 15.5523 9.5 15V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium text-gray-900">UPI Payments</h4>
                      <p className="text-sm text-gray-500">Accept UPI payments</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-blue-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Enable UPI payments</span>
                    <span
                      className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
            }`}
            onClick={() => setActiveTab('general')}
          >
            <FaStore className="inline-block mr-2" />
            General
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell className="inline-block mr-2" />
            Notifications
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock className="inline-block mr-2" />
            Security
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'payments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
            }`}
            onClick={() => setActiveTab('payments')}
          >
            <FaMoneyBillWave className="inline-block mr-2" />
            Payments
          </button>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
          
          {(activeTab === 'general' || activeTab === 'notifications') && (
            <div className="mt-8 pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaSave className="mr-2 -ml-1 h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 