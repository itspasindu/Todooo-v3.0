import React from 'react';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  resetSuccess: boolean;
}

export function PasswordResetModal({
  isOpen,
  onClose,
  resetEmail,
  setResetEmail,
  onSubmit,
  resetSuccess,
}: PasswordResetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Reset your password
        </h3>
        {resetSuccess ? (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Check your email for password reset instructions.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              required
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}