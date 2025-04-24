'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/contexts/AuthContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from '@/app/dashboard/components/Modal';
import LoadingSpinner from '@/app/dashboard/components/LoadingSpinner';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  status: string;
  image_url?: string;
}

interface DurationFields {
  days: number;
  hours: number;
  minutes: number;
}

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: Service) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  imageSupported: boolean;
}

const formatDuration = (totalMinutes: number): string => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  
  const parts = [];
  
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  
  if (parts.length === 0) {
    return '0 minutes';
  }
  
  if (parts.length === 1) {
    return parts[0];
  }
  
  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  }
  
  return `${parts[0]}, ${parts[1]} and ${parts[2]}`;
};

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel, isEditing = false, imageSupported }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    duration: initialData?.duration || 30,
    price: initialData?.price || 499,
    category: initialData?.category || 'Wash',
    status: initialData?.status || 'Active',
    image_url: initialData?.image_url || ''
  });

  // Convert total minutes to days, hours, minutes
  const [durationFields, setDurationFields] = useState<DurationFields>(() => {
    const totalMinutes = initialData?.duration || 30;
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    return { days, hours, minutes };
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if the database schema supports image_url
  useEffect(() => {
    async function checkImageSupport() {
      try {
        console.log('Checking if database schema supports image_url');
        const response = await fetch('/api/services/schema-check');
        const data = await response.json();
        console.log('Schema check result:', data);
        
        if (!data.supportsImages) {
          console.log('Image uploads not supported due to database schema');
        }
      } catch (error) {
        console.error('Error checking image support:', error);
        // Default to false if there's an error
      }
    }

    // For now, we'll infer support based on whether initialData has image_url
    // This ensures existing data displays correctly
    if (initialData && 'image_url' in initialData) {
      imageSupported = true;
    }

    checkImageSupport(); // Enable the schema-check API endpoint
  }, [initialData, imageSupported]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be less than 2MB');
      return;
    }
    
    setImageFile(file);
    setUploadError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDurationChange = (field: keyof DurationFields, value: string) => {
    const numValue = parseInt(value) || 0;
    const newDurationFields = { ...durationFields, [field]: numValue };
    setDurationFields(newDurationFields);

    // Calculate total minutes
    const totalMinutes = 
      (newDurationFields.days * 24 * 60) + 
      (newDurationFields.hours * 60) + 
      newDurationFields.minutes;

    setFormData(prev => ({
      ...prev,
      duration: totalMinutes
    }));
  };

  const ensureBucketExists = async (client: any): Promise<boolean> => {
    try {
      console.log('Checking if bucket exists: service-images');
      
      const { data: buckets, error: listError } = await client.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return false;
      }
      
      const bucketExists = buckets.some((bucket: any) => bucket.name === 'service-images');
      
      if (!bucketExists) {
        console.log('Bucket does not exist, creating it: service-images');
        
        const { error: createError } = await client.storage.createBucket('service-images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB limit
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          return false;
        }
        
        // Set bucket policy to allow public access
        const { error: policyError } = await client.storage
          .from('service-images')
          .createSignedUrl('test.txt', 60);
        
        if (policyError) {
          console.error('Error setting bucket policy:', policyError);
          return false;
        }
        
        console.log('Bucket created successfully: service-images');
      } else {
        console.log('Bucket already exists: service-images');
      }
      
      return true;
    } catch (error) {
      console.error('Error in ensureBucketExists:', error);
      return false;
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      if (!supabase) {
        const { initSupabaseClient } = await import('@/lib/supabase');
        const client = initSupabaseClient();
        
        if (!client) {
          console.error('Failed to initialize Supabase client');
          throw new Error('Database connection not available. Please try again later.');
        }
        
        const bucketReady = await ensureBucketExists(client);
        if (!bucketReady) {
          throw new Error('Failed to ensure storage bucket exists. Please try again later.');
        }
        
        // Upload using the newly initialized client
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('Uploading to bucket: service-images');
        const { error: uploadError } = await client.storage
          .from('service-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }
        
        const { data } = client.storage.from('service-images').getPublicUrl(filePath);
        return data.publicUrl;
      }

      // Use existing client
      // Ensure bucket exists
      const bucketReady = await ensureBucketExists(supabase);
      if (!bucketReady) {
        throw new Error('Failed to ensure storage bucket exists. Please try again later.');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file to Supabase storage bucket: service-images');
      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      const { data } = supabase.storage.from('service-images').getPublicUrl(filePath);
      console.log('File uploaded successfully, URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage function:', error);
      toast.error('Error uploading image. Please try again.');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    let finalFormData = { ...formData };
    let useImageFallback = false;
    
    // Only try to upload image if schema supports it
    if (imageFile && imageSupported) {
      try {
        setUploading(true);
        const imageUrl = await uploadImage(imageFile);
        
        if (imageUrl) {
          finalFormData.image_url = imageUrl;
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        // Check for bucket-specific issues
        if (error && typeof error === 'object' && 'message' in error && 
            typeof error.message === 'string' && 
            (error.message.includes('Bucket not found') || 
             error.message.includes('storage bucket'))) {
          toast.error('Storage configuration issue. Image will not be added.');
          useImageFallback = true;
        } else {
          toast.error(error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
            ? `Failed to upload image: ${error.message}` 
            : 'Failed to upload image. Please try again.');
          return;
        }
      } finally {
        setUploading(false);
      }
    }
    
    // If bucket issues occurred but we want to proceed anyway
    if (useImageFallback || !imageSupported) {
      // Remove image_url from the data sent to the server if not supported
      if (!imageSupported) {
        const { image_url, ...dataWithoutImage } = finalFormData;
        finalFormData = dataWithoutImage as any;
      } else {
        finalFormData.image_url = ''; 
      }
    }
    
    try {
      console.log('Submitting form data:', finalFormData);
      await onSubmit(finalFormData as Service);
      
      const successMessage = isEditing 
        ? 'Service updated successfully' 
        : 'Service added successfully';
        
      if (useImageFallback && imageSupported) {
        toast.success(successMessage + ' (without image)');
      } else {
        toast.success(successMessage);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Try to extract a more specific error message if possible
      let errorMessage = 'An unexpected error occurred';
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = error.message as string;
      }
      
      // Check for common errors
      if (errorMessage.includes('not initialized') || errorMessage.includes('not available')) {
        errorMessage = 'Database connection issue. Please try again in a moment.';
      } else if (errorMessage.includes('duplicate')) {
        errorMessage = 'A service with this name already exists.';
      } else if (errorMessage.includes('Bucket not found') || errorMessage.includes('storage bucket')) {
        errorMessage = 'Storage configuration issue. Please contact the administrator.';
      } else if (errorMessage.includes('column') || errorMessage.includes('schema cache')) {
        errorMessage = 'Database schema issue. Images may not be supported.';
      }
      
      toast.error(isEditing 
        ? `Failed to update service: ${errorMessage}` 
        : `Failed to add service: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter service name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter service description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
          
          {/* Image Upload Section - Only show if supported */}
          {imageSupported && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
              <div className="mt-1 space-y-4">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Service preview" 
                      className="w-48 h-48 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, image_url: '' }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* File Input */}
                <div className="flex flex-col">
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 max-w-xs"
                  >
                    <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                    {imagePreview ? 'Change image' : 'Upload image'}
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                  
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF up to 2MB
                  </p>
                  
                  {uploadError && (
                    <p className="mt-1 text-xs text-red-500">{uploadError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration*
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={durationFields.days}
                    onChange={(e) => handleDurationChange('days', e.target.value)}
                    min="0"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">days</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={durationFields.hours}
                    onChange={(e) => handleDurationChange('hours', e.target.value)}
                    min="0"
                    max="23"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">hrs</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={durationFields.minutes}
                    onChange={(e) => handleDurationChange('minutes', e.target.value)}
                    min="0"
                    max="59"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">min</span>
                  </div>
                </div>
              </div>
            </div>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className={`block w-full pl-7 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              >
                <option value="Wash">Wash</option>
                <option value="Detailing">Detailing</option>
                <option value="Protection">Protection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          disabled={uploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out flex items-center"
          disabled={uploading}
        >
          {uploading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isEditing ? 'Update Service' : 'Add Service'}
        </button>
      </div>
    </form>
  );
};

// ServiceTableSkeleton component for loading state
const ServiceTableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array(5).fill(0).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-16 w-16 flex-shrink-0 mr-4">
                    <Skeleton height={64} width={64} borderRadius={6} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      <Skeleton width={120} />
                    </div>
                    <div className="text-sm text-gray-500">
                      <Skeleton width={200} />
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <Skeleton width={60} />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Skeleton width={80} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton width={70} height={24} borderRadius={12} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton width={60} height={24} borderRadius={12} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Skeleton width={100} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  onSuccess: (updatedService: Service) => void;
  onError: (error: string) => void;
  imageSupported: boolean;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ isOpen, onClose, service, onSuccess, onError, imageSupported }) => {
  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description,
    duration: service.duration,
    price: service.price,
    category: service.category,
    status: service.status,
    image_url: service.image_url || ''
  });

  // Convert total minutes to days, hours, minutes
  const [durationFields, setDurationFields] = useState<DurationFields>(() => {
    const totalMinutes = service.duration;
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    return { days, hours, minutes };
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(service.image_url || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be less than 2MB');
      return;
    }
    
    setImageFile(file);
    setUploadError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDurationChange = (field: keyof DurationFields, value: string) => {
    const numValue = parseInt(value) || 0;
    const newDurationFields = { ...durationFields, [field]: numValue };
    setDurationFields(newDurationFields);

    // Calculate total minutes
    const totalMinutes = 
      (newDurationFields.days * 24 * 60) + 
      (newDurationFields.hours * 60) + 
      newDurationFields.minutes;

    setFormData(prev => ({
      ...prev,
      duration: totalMinutes
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      // Ensure bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        throw new Error('Failed to check storage buckets');
      }
      
      const bucketExists = buckets.some((bucket: any) => bucket.name === 'service-images');
      
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('service-images', {
          public: true,
          fileSizeLimit: 5242880,
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw new Error('Failed to create storage bucket');
        }
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      const { data } = supabase.storage.from('service-images').getPublicUrl(filePath);
      console.log('File uploaded successfully, URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage function:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    let updatedService = { ...formData, id: service.id };
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Handle image upload if there's a new image
      if (imageFile && imageSupported) {
        try {
          const imageUrl = await uploadImage(imageFile);
          if (imageUrl) {
            updatedService.image_url = imageUrl;
          }
        } catch (error) {
          console.error('Image upload failed:', error);
          if (error && typeof error === 'object' && 'message' in error && 
              typeof error.message === 'string' &&
              (error.message.includes('Bucket not found') || 
              error.message.includes('storage bucket'))) {
            toast.error('Storage configuration issue. Image will not be updated.');
          } else {
            toast.error(error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
              ? `Failed to upload image: ${error.message}` 
              : 'Failed to upload image. Please try again.');
            return;
          }
        }
      }
      
      await onSuccess(updatedService);
      
      toast.success('Service updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating service:', error);
      setSubmitError(error && typeof error === 'object' && 'message' in error 
        ? error.message as string 
        : 'Failed to update service');
      onError(error && typeof error === 'object' && 'message' in error 
        ? error.message as string 
        : 'Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Service">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div className="bg-white rounded-lg">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Service Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Only show image upload if the schema supports it */}
            {imageSupported && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>
                
                {/* Image Preview */}
                <div className="flex items-center space-x-4">
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Service preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          setFormData(prev => ({ ...prev, image_url: '' }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* File Input */}
                  <div className="flex-1">
                    <label 
                      htmlFor="file-upload-edit"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                      {imagePreview ? 'Change image' : 'Upload image'}
                    </label>
                    <input
                      id="file-upload-edit"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF up to 2MB
                    </p>
                    {uploadError && (
                      <p className="mt-1 text-xs text-red-500">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration*
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      value={durationFields.days}
                      onChange={(e) => handleDurationChange('days', e.target.value)}
                      min="0"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      value={durationFields.hours}
                      onChange={(e) => handleDurationChange('hours', e.target.value)}
                      min="0"
                      max="23"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">hrs</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      value={durationFields.minutes}
                      onChange={(e) => handleDurationChange('minutes', e.target.value)}
                      min="0"
                      max="59"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">min</span>
                    </div>
                  </div>
                </div>
              </div>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    min="0"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="Wash">Wash</option>
                  <option value="Detailing">Detailing</option>
                  <option value="Protection">Protection</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status*
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {submitError}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 mt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="xs" className="mr-2" />
                Updating...
              </>
            ) : (
              'Update Service'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { user } = useAuth();
  const [sortField, setSortField] = useState<keyof Service>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [imageSupported, setImageSupported] = useState<boolean>(true);

  // Fetch services from API
  useEffect(() => {
    async function fetchServices() {
      try {
        console.log('Fetching services...');
        setLoading(true);
        
        if (!user) {
          console.log('No user found, redirecting to login');
          router.push('/login');
          return;
        }

        const response = await fetch('/api/services', {
          headers: {
            'Cache-Control': 'no-store'
          }
        });
        
        // Handle potential authentication issues
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication issue detected, redirecting to login');
          router.push('/login');
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch services:', errorData);
          throw new Error(errorData.error || 'Failed to fetch services');
        }
        
        const data = await response.json();
        console.log('Services fetched:', data);
        setServices(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err && typeof err === 'object' && 'message' in err 
          ? err.message as string 
          : 'Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [router, user]);

  // Add a new service
  const handleAddService = async (formData: Service) => {
    try {
      console.log('Submitting new service:', formData);
      
      // Validate the form data before sending
      if (!formData.name || !formData.description) {
        throw new Error('Service name and description are required');
      }
      
      if (formData.duration <= 0) {
        throw new Error('Duration must be greater than 0');
      }
      
      if (formData.price < 0) {
        throw new Error('Price cannot be negative');
      }
      
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Failed to add service. Status:', response.status, 'Response:', responseData);
        throw new Error(responseData.error || `Failed to add service (${response.status})`);
      }

      console.log('Service added successfully:', responseData);
      setServices(prev => [...prev, responseData]);
      setIsAddModalOpen(false);
      toast.success('Service added successfully!');
    } catch (err) {
      console.error('Error in handleAddService:', err);
      setError(err && typeof err === 'object' && 'message' in err 
        ? err.message as string 
        : 'Failed to add service. Please try again.');
      toast.error(err && typeof err === 'object' && 'message' in err 
        ? err.message as string 
        : 'Failed to add service. Please try again.');
    }
  };

  // Reset form function
  const resetForm = () => {
    setCurrentService(null);
  };

  // Update a service
  const handleUpdateService = async (service: Service) => {
    if (!currentService) return;
    
    try {
      setSubmitting(true);
      setUpdateError(null);
      
      console.log('Updating service:', service);
      
      const response = await fetch(`/api/services/${currentService.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update service');
      }

      const updatedServiceData = await response.json();
      console.log('Service updated:', updatedServiceData);
      
      // Update the services list with the updated service
      setServices(services.map(s => 
        s.id === currentService.id ? updatedServiceData : s
      ));
      
      setIsEditModalOpen(false);
      toast.success('Service updated successfully!');
      resetForm();
    } catch (error) {
      console.error('Error updating service:', error);
      setUpdateError(error && typeof error === 'object' && 'message' in error 
        ? error.message as string 
        : 'Failed to update service');
      toast.error(error && typeof error === 'object' && 'message' in error 
        ? error.message as string 
        : 'Failed to update service');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a service
  const handleDeleteService = async () => {
    if (!currentService) return;
    
    try {
      const response = await fetch(`/api/services/${currentService.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      setServices(services.filter(service => service.id !== currentService.id));
      setIsDeleteModalOpen(false);
      setCurrentService(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service. Please try again.');
    }
  };

  // Open edit modal with service data
  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setCurrentService(service);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (service: Service) => {
    setCurrentService(service);
    setIsDeleteModalOpen(true);
  };

  // Filter and sort services based on search term, category filter, and sort settings
  const filteredServices = services
    .filter(service => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterCategory === 'all' || 
        service.category.toLowerCase() === filterCategory.toLowerCase();
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Handle special case for price and duration which are numbers
      if (sortField === 'price' || sortField === 'duration') {
        return sortDirection === 'asc' 
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      }
      
      // For string fields
      const aValue = String(a[sortField]).toLowerCase();
      const bValue = String(b[sortField]).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Sort function
  const handleSort = (field: keyof Service) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: keyof Service }) => {
    if (field !== sortField) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <DashboardLayout adminOnly={false}>
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Service">
          <ServiceForm
            onSubmit={handleAddService}
            onCancel={() => setIsAddModalOpen(false)}
            imageSupported={imageSupported}
          />
        </Modal>
      )}

      {isEditModalOpen && selectedService && (
        <EditServiceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          service={selectedService}
          onSuccess={handleUpdateService}
          onError={(error: unknown) => {
            console.error('Error updating service:', error);
            setUpdateError(error && typeof error === 'object' && 'message' in error 
              ? error.message as string 
              : 'Failed to update service');
            toast.error(error && typeof error === 'object' && 'message' in error 
              ? error.message as string 
              : 'Failed to update service');
          }}
          imageSupported={imageSupported}
        />
      )}

      {isDeleteModalOpen && currentService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Delete Service</h2>
            <p className="text-gray-700">
              Are you sure you want to delete &quot;{currentService?.name}&quot;? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>
        <p className="text-gray-600">View, add, edit or delete the services offered by your car wash.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="wash">Wash</option>
                <option value="detailing">Detailing</option>
                <option value="protection">Protection</option>
              </select>
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="mr-2 -ml-1 h-4 w-4" />
              Add Service
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <ServiceTableSkeleton />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center focus:outline-none" 
                      onClick={() => handleSort('name')}
                    >
                      Service
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center focus:outline-none" 
                      onClick={() => handleSort('duration')}
                    >
                      Duration
                      <SortIcon field="duration" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center focus:outline-none" 
                      onClick={() => handleSort('price')}
                    >
                      Price
                      <SortIcon field="price" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center focus:outline-none" 
                      onClick={() => handleSort('category')}
                    >
                      Category
                      <SortIcon field="category" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center focus:outline-none" 
                      onClick={() => handleSort('status')}
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* Only show image if the service has an image_url property */}
                        {service.image_url ? (
                          <div className="h-16 w-16 flex-shrink-0 mr-4">
                            <img 
                              className="h-16 w-16 rounded-md object-cover" 
                              src={service.image_url} 
                              alt={service.name} 
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center mr-4">
                            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDuration(service.duration)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{service.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openEditModal(service)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(service)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!loading && filteredServices.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No services found matching your search criteria.</p>
          </div>
        )}
        
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredServices.length}</span> of{' '}
              <span className="font-medium">{services.length}</span> services
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 


