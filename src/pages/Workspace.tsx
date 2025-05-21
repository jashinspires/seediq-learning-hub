
import { useRef } from "react";
import { Send, Image as ImageIcon, History, MessageSquare, Plus, Settings, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/utils/groqApi";
import ChatHeader from "@/components/workspace/ChatHeader";
import ChatMessages from "@/components/workspace/ChatMessages";
import ChatInput from "@/components/workspace/ChatInput";
import { SidebarProvider } from "@/components/ui/sidebar";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import { useWorkspaceStore } from "@/components/workspace/useWorkspaceStore";

const Workspace = () => {
  const { 
    conversations,
    isLoading,
    messageEndRef,
    messagesContainerRef,
    sendMessage,
    startNewConversation
  } = useWorkspaceStore();
  
  // Filter out system messages for display
  const displayConversations = conversations.filter(msg => msg.role !== 'system');

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#0f1117]">
        <WorkspaceSidebar 
          onNewChat={startNewConversation} 
        />
        
        <div className="flex flex-1 flex-col h-full">
          <ChatHeader onNewChat={startNewConversation} />
          
          <main className="flex-1 overflow-hidden relative bg-[#0f1117]" ref={messagesContainerRef}>
            <div className="h-full flex flex-col">
              <ChatMessages 
                messages={displayConversations}
                isLoading={isLoading}
                messageEndRef={messageEndRef}
              />
              
              <ChatInput 
                onSendMessage={sendMessage}
                isLoading={isLoading}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Workspace;
