"use client";

import React, { useState } from "react";
import DirectMessagesList from "@/components/features/messages/DirectMessagesList";
import ProjectMessagesList from "@/components/features/messages/ProjectMessagesList";
import ChatWindow from "@/components/features/messages/ChatWindow";

export default function DashboardMessagesPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const isChatOpen = selectedChatId !== null;

  return (
    <div className="w-full h-full flex flex-col items-center pt-1.75 mt-2.5 lg:mt-23.75 font-sans pb-1 relative flex-1">
      
      {/* Title */}
      <h1 className="font-medium text-[36px] lg:text-[48px] leading-10 lg:leading-14 text-white mb-3.75 z-10 text-center lg:text-left w-full max-w-305.75">
        Messages
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-7 w-full max-w-305.75 z-10 flex-1 h-[75vh] min-h-150">
        
        {/* Direct Messages List (Remember to add empty state and new message button, me) */}
        <DirectMessagesList 
          isChatOpen={isChatOpen} 
          selectedChatId={selectedChatId} 
          onSelectChat={setSelectedChatId} 
        />

        {/* If no chat is open, show the Project Messages column on the right */}
        {!isChatOpen && (
          <ProjectMessagesList />
        )}

        {/* If a chat is selected, replace the Project Messages list with the active Chat Window */}
        {isChatOpen && (
          <ChatWindow 
            chatId={selectedChatId} 
            onClose={() => setSelectedChatId(null)} 
          />
        )}
        
      </div>
    </div>
  );
}