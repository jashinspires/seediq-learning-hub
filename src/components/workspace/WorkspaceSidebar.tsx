
import { Plus, MessageSquare, User, Settings } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkspaceSidebarProps {
  onNewChat: () => void;
}

const WorkspaceSidebar = ({ onNewChat }: WorkspaceSidebarProps) => {
  // This would normally come from a database or state management
  const recentChats = [
    { id: 1, title: "Quantum physics questions" },
    { id: 2, title: "JavaScript programming help" },
    { id: 3, title: "History essay brainstorming" },
    { id: 4, title: "Math problem solutions" },
  ];

  return (
    <Sidebar variant="floating" className="border-r border-slate-800">
      <SidebarHeader className="py-6">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 font-normal bg-slate-800 border-0 hover:bg-slate-700 text-white"
          onClick={onNewChat}
        >
          <Plus size={18} />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[60vh]">
              <SidebarMenu>
                {recentChats.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton tooltip={chat.title} className="gap-3 text-slate-300 hover:text-white">
                      <MessageSquare size={18} />
                      <span className="text-sm">{chat.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Profile" className="gap-3 text-slate-300">
              <User size={18} />
              <span className="text-sm">Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" className="gap-3 text-slate-300">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default WorkspaceSidebar;
