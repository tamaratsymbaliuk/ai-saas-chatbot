import React from 'react';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-2 border-b">{children}</div>
);

export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);

export const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-2 border-t">{children}</div>
);

export const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-600">{children}</p>
);
