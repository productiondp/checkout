import React from "react";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="px-6 pt-10 pb-6 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-xl z-40 border-b border-black/[0.02] lg:hidden">
      <div>
        <p className="text-text-secondary text-[11px] font-black uppercase  mb-1">Welcome back</p>
        <h1 className="text-2xl font-black text-text ">
          {title}<span className="text-primary rounded-full inline-block w-1.5 h-1.5 bg-primary ml-1"></span>
        </h1>
      </div>
      <button className="group relative w-12 h-12 flex items-center justify-center bg-background-soft rounded-2xl hover:bg-white hover:shadow-premium transition-all duration-300">
        <Bell size={20} className="text-text group-hover:text-primary transition-colors" />
        <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-background-soft group-hover:border-white transition-colors"></span>
      </button>
    </header>
  );
};

export default Header;
