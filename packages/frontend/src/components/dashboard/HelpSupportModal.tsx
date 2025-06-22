import React, { useState } from 'react';
import { X, HelpCircle, Building, User, MessageSquare } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    building: '',
    problem: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.building.trim()) {
      newErrors.building = 'Building location is required';
    }
    
    if (!formData.problem.trim()) {
      newErrors.problem = 'Please describe the problem you\'re facing';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('Help request submitted:', formData);
      
      // Reset form and close modal
      setFormData({ name: '', email: '', building: '', problem: '' });
      setErrors({});
      onClose();
      
      // Show success message (you could add a toast notification here)
      alert('Your help request has been submitted successfully! We\'ll get back to you soon.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-slate-200/50 relative animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Help & Support</h2>
              <p className="text-sm text-slate-500">We're here to help you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100/50 rounded-xl transition-colors duration-200"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                Full Name *
              </div>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
              } focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
              } focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50`}
              placeholder="your.email@company.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Building Field */}
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-slate-500" />
                Building/Location *
              </div>
            </label>
            <input
              type="text"
              id="building"
              name="building"
              value={formData.building}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.building ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
              } focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50`}
              placeholder="e.g., Main Office, Building A, Remote"
            />
            {errors.building && (
              <p className="text-red-500 text-xs mt-1">{errors.building}</p>
            )}
          </div>

          {/* Problem Description */}
          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-500" />
                Describe Your Problem *
              </div>
            </label>
            <textarea
              id="problem"
              name="problem"
              rows={4}
              value={formData.problem}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.problem ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
              } focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 resize-none`}
              placeholder="Please describe the issue you're experiencing in detail..."
            />
            {errors.problem && (
              <p className="text-red-500 text-xs mt-1">{errors.problem}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 