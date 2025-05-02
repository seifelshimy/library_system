import React from "react";

export function Card({ children, ...props }) {
  return <div className="rounded-lg border bg-white p-4 shadow-sm" {...props}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="mb-2 font-bold text-lg">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-xl font-semibold">{children}</h3>;
}

export function CardDescription({ children }) {
  return <p className="text-gray-500 text-sm">{children}</p>;
}

export function CardContent({ children }) {
  return <div className="py-2">{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="mt-2 border-t pt-2">{children}</div>;
}