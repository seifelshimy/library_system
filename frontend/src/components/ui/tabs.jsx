import * as React from "react";

export const Tabs = ({ children }) => {
  return <div>{children}</div>;
};

export const TabsList = ({ children }) => {
  return <div className="flex space-x-2 border-b mb-4">{children}</div>;
};

export const TabsTrigger = ({ value, children }) => {
  return <button className="px-4 py-2">{children}</button>;
};

export const TabsContent = ({ value, children }) => {
  return <div className="mt-4">{children}</div>;
};
