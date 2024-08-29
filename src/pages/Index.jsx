import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Avatar from '@radix-ui/react-avatar';

const Index = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Open Form</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar.Root className="w-12 h-12 rounded-full overflow-hidden">
                <Avatar.Image src="/logo.svg" alt="Logo" className="w-full h-full object-cover" />
                <Avatar.Fallback>Logo</Avatar.Fallback>
              </Avatar.Root>
              <div>
                <Dialog.Title className="text-2xl font-bold">Submit Details</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500">
                  Please fill out the form below to submit your details.
                </Dialog.Description>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="full_name" name="full_name" placeholder="John Doe" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" name="address" placeholder="123 Main St, City, Country" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" placeholder="john@example.com" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="space-y-2">
                <label htmlFor="issue" className="block text-sm font-medium text-gray-700">Issue</label>
                <textarea id="issue" name="issue" placeholder="Describe your issue here..." required className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <div className="space-y-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
                <input type="file" id="image" name="image" accept="image/*" className="w-full" />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
            </form>
            <Dialog.Close asChild>
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Index;
