import { NavLink } from "react-router-dom";
import {
  Home,
  Upload,
  MessageSquare,
  FileText,
  Network,
  GitCompare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Summarize", href: "/summarize", icon: MessageSquare },
  { name: "Papers", href: "/papers", icon: FileText },
  { name: "Citations", href: "/citations", icon: Sparkles },
  { name: "Clusters", href: "/clusters", icon: Network },
  { name: "Compare", href: "/compare", icon: GitCompare },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              ResearchAI
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              Summarizer
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent text-sidebar-foreground",
                isActive &&
                  "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="glass p-3 rounded-lg">
          <p className="text-xs text-sidebar-foreground/70 text-center">
            Powered by Gemini AI
          </p>
        </div>
      </div>
    </aside>
  );
}
