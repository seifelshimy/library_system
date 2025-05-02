
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  // Check for dark mode preference when layout mounts
  useEffect(() => {
    const savedAppearanceSettings = localStorage.getItem('appearanceSettings');
    
    if (savedAppearanceSettings) {
      const { darkMode } = JSON.parse(savedAppearanceSettings);
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
