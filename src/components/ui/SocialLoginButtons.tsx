import React from 'react';
import { LogIn, Github } from 'lucide-react';

export function SocialLoginButtons() {
  return (
    <div className="flex gap-4 justify-center">
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <LogIn size={20} />
        <span>Google</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <Github size={20} />
        <span>GitHub</span>
      </button>
    </div>
  );
}