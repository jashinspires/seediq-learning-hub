
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ChatHeaderProps {
  onNewChat: () => void;
}

const ChatHeader = ({ onNewChat }: ChatHeaderProps) => {
  return (
    <header className="bg-[#0f1117] border-b border-slate-800 p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-9 w-9 text-slate-400 hover:text-white" />
          <h1 className="text-xl font-medium text-white">SeedIQ Workspace</h1>
        </div>
        <Button
          variant="outline" 
          size="sm"
          onClick={onNewChat}
          className="flex items-center gap-1 bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300"
        >
          <Plus size={16} />
          New Chat
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
