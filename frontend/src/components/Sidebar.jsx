
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  BookOpen, 
  Home, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={`bg-sidebar h-screen transition-all duration-300 flex flex-col border-r ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        {!collapsed && <h2 className="font-bold text-lg">Library App</h2>}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <nav className="flex-1 pt-4">
        <NavItem to="/dashboard" icon={<Home size={20} />} text="Dashboard" collapsed={collapsed} />
        <NavItem to="/books" icon={<Book size={20} />} text="Books" collapsed={collapsed} />
        <NavItem to="/borrowed" icon={<BookOpen size={20} />} text="Borrowed" collapsed={collapsed} />
        <NavItem to="/members" icon={<Users size={20} />} text="Members" collapsed={collapsed} />
        <NavItem to="/settings" icon={<Settings size={20} />} text="Settings" collapsed={collapsed} />
      </nav>
    </div>
  );
};



const NavItem = ({ to, icon, text, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 mb-1 mx-2 rounded-md transition-colors ${
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
            : "text-sidebar-foreground hover-sidebar-accent/50 hover-sidebar-accent-foreground"
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {!collapsed && <span>{text}</span>}
    </NavLink>
  );
};

export default Sidebar;
