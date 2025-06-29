'use client';

import { useState, useEffect } from 'react';
import { FaUserCog, FaUserPlus, FaTrash, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface DisplaySettings {
  showDuration: boolean;
  showCategory: boolean;
}

export default function SettingsPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  
  // Display settings state
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    showDuration: true,
    showCategory: true
  });
  const [displaySettingsLoading, setDisplaySettingsLoading] = useState(false);

  // Fetch users and display settings
  useEffect(() => {
    async function fetchData() {
      await Promise.all([fetchUsers(), fetchDisplaySettings()]);
    }
    
    fetchData();
  }, []);

  // Fetch display settings
  async function fetchDisplaySettings() {
    try {
      console.log('Dashboard Settings Page: Fetching display options setting');
      setDisplaySettingsLoading(true);
      const response = await fetch('/api/settings/display_options');
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.value) {
          let settings;
          if (typeof data.value === 'string') {
            try {
              settings = JSON.parse(data.value);
            } catch (jsonError) {
              console.error('Invalid JSON in dashboard settings display settings:', data.value, jsonError);
              settings = { showDuration: true, showCategory: true };
            }
          } else {
            settings = data.value;
          }
          setDisplaySettings({
            showDuration: settings.showDuration !== false, // default to true
            showCategory: settings.showCategory !== false  // default to true
          });
        }
      }
    } catch (err) {
      console.error('Error fetching display settings:', err);
      // Keep default values if fetch fails
    } finally {
      setDisplaySettingsLoading(false);
    }
  }

  // Update display settings
  async function updateDisplaySettings(newSettings: Partial<DisplaySettings>) {
    try {
      setDisplaySettingsLoading(true);
      const updatedSettings = { ...displaySettings, ...newSettings };
      
      const response = await fetch('/api/settings/display_options', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: updatedSettings }),
      });
      
      if (response.ok) {
        setDisplaySettings(updatedSettings);
      } else {
        throw new Error('Failed to update display settings');
      }
    } catch (err) {
      console.error('Error updating display settings:', err);
      setError('Failed to update display settings. Please try again.');
    } finally {
      setDisplaySettingsLoading(false);
    }
  }

  // Fetch users
  async function fetchUsers() {
    try {
      setLoading(true);
      
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      // Fetch profiles which contain role information
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(profiles || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Add new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail || !newUserPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!supabase) {
      setError('Database connection not available');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      // Sign up the user
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Update the user's role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: newUserRole })
          .eq('id', data.user.id);
          
        if (updateError) throw updateError;
        
        // Add the new user to the list
        const newUser: UserProfile = {
          id: data.user.id,
          email: newUserEmail,
          role: newUserRole,
          created_at: new Date().toISOString()
        };
        
        setUsers([newUser, ...users]);
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('user');
        setShowAddUserForm(false);
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setError(null);
      
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    if (!supabase) {
      setError('Database connection not available');
      return;
    }
    
    try {
      setError(null);
      
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  return (
    <DashboardLayout adminOnly={true}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
        <p className="text-gray-600">Manage user access and system settings</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Display Settings Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Display Settings</h2>
          <p className="text-sm text-gray-600 mt-1">Control what information is shown on service cards</p>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {displaySettings.showDuration ? (
                    <FaEye className="h-5 w-5 text-green-500" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Show Duration</h3>
                  <p className="text-sm text-gray-500">Display service duration on service cards</p>
                </div>
              </div>
              <button
                onClick={() => updateDisplaySettings({ showDuration: !displaySettings.showDuration })}
                disabled={displaySettingsLoading}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  displaySettings.showDuration ? 'bg-blue-600' : 'bg-gray-200'
                } ${displaySettingsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    displaySettings.showDuration ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {displaySettings.showCategory ? (
                    <FaEye className="h-5 w-5 text-green-500" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Show Category</h3>
                  <p className="text-sm text-gray-500">Display service category on service cards</p>
                </div>
              </div>
              <button
                onClick={() => updateDisplaySettings({ showCategory: !displaySettings.showCategory })}
                disabled={displaySettingsLoading}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  displaySettings.showCategory ? 'bg-blue-600' : 'bg-gray-200'
                } ${displaySettingsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    displaySettings.showCategory ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
          <button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaUserPlus className="mr-2 -ml-1 h-4 w-4" />
            Add New User
          </button>
        </div>
        
        {showAddUserForm && (
          <div className="p-4 sm:p-6 border-b bg-gray-50">
            <h3 className="text-md font-medium text-gray-800 mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                >
                  {loading ? 'Adding...' : 'Add User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading && users.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingUser?.id === user.id ? (
                        <>
                          <button
                            onClick={() => updateUserRole(user.id, editingUser.role)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FaEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!loading && users.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No users found.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 