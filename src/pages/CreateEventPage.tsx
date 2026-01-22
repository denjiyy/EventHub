import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Lock, Upload, X } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useCreateEvent } from '../hooks/useEvents';

export function CreateEventPage() {
  const navigate = useNavigate();
  const { addToast, isAuthenticated } = useApp();

  // Use React Query hooks
  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data || [];
  const createEventMutation = useCreateEvent();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pt-24 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">You need to sign in to create events.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    city: '',
    category: categories.length > 0 ? categories[0]._id : '',
    price: 0,
    capacity: 100,
    image: ''
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Update category when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0]._id }));
    }
  }, [categories, formData.category]);

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
  };
  
  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.city || !formData.category) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    
    try {
      // Combine date and time into ISO string
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      const fullLocation = `${formData.location}, ${formData.city}`;
      
      await createEventMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: dateTime,
        location: fullLocation,
        price: formData.price,
        capacity: formData.capacity,
        ticketsAvailable: formData.capacity,
        image: formData.image || undefined,
      });
      
      addToast('Event created successfully!', 'success');
      navigate('/events');
    } catch (error: any) {
      addToast(error.message || 'Failed to create event', 'error');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/events')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-lg text-gray-600">Share your event with the community</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Image URL
                <span className="text-gray-500 font-normal ml-2">(Optional)</span>
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  {formData.image && (
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
                
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover"
                      onError={() => {
                        setImagePreview('');
                        addToast('Invalid image URL', 'error');
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm font-medium">Image Preview</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">Enter an image URL to see preview</p>
                    <p className="text-gray-500 text-xs mt-1">Supports JPG, PNG, WebP from any URL</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    placeholder="Amazing Summer Music Festival"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
                    placeholder="Tell people what makes your event special..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length} characters
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Venue <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      placeholder="Convention Center"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      placeholder="New York"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Set to 0 for free events</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/events')}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createEventMutation.isPending}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {createEventMutation.isPending ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}