import React from 'react';
import { Building2, Sparkles } from 'lucide-react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-gold/20 blur-[8px] rounded-full animate-pulse" />
      <Building2 className="w-full h-full text-gold relative z-10" />
      <Sparkles className="absolute -top-1 -right-1 w-1/2 h-1/2 text-gold animate-pulse delay-75" />
      <Sparkles className="absolute -bottom-1 -left-1 w-1/3 h-1/3 text-gold/60 animate-pulse delay-150" />
    </div>
  );
}
