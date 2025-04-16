import React from "react";
import { Home, Store, Gift, Search, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

interface SidebarProps {
  activeItem?: string;
  onMenuClick?: (menuItem: string) => void;
}

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
}

const Sidebar = ({ activeItem = "home", onMenuClick }: SidebarProps) => {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: "home",
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      path: "/",
    },
    {
      id: "store",
      icon: <Store className="w-5 h-5" />,
      label: "Store",
      path: "/store",
    },
    {
      id: "rewards",
      icon: <Gift className="w-5 h-5" />,
      label: "Daily Rewards",
    },
    {
      id: "profile",
      icon: <Gift className="w-5 h-5" />,
      label: "Profile",
    },
  ];

  const handleClick = (item: NavItem) => {
    if (item.path) {
      navigate(item.path);
    }
    onMenuClick?.(item.id);
  };

  return (
    <div className="w-[280px] h-full bg-[#1E1B26] p-6 flex flex-col gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-[#FFB800]" />
          <h1 className="text-2xl font-bold text-white">Z-Play</h1>
        </div>
        <h1 className="tracking-tight lg:text-5xl text-[#8d8d8d] font-normal leading-4 text-[1xl]">
          A players space for fun
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-white/5 border-white/10 text-white pl-10 placeholder:text-gray-400"
          />
        </div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full flex items-center justify-start gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors",
                      activeItem === item.id && "bg-white/20",
                    )}
                    onClick={() => handleClick(item)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Navigate to {item.label}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-sm text-white/70 text-center">Z-Play v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
