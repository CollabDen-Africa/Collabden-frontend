import React, { useState, useMemo } from 'react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { HiStar } from "react-icons/hi2";
import { useConnections } from '@/hooks/connections/useConnections';

//Data structure
export interface CollaboratorItemProps {
  id: string | number;
  userId?: string;
  name: string;
  role: string;
  members: number;
  rating: string;
  avatarUrl?: string;
}

export default function CollaboratorItem({ id, userId, name, role, members, rating, avatarUrl }: CollaboratorItemProps) {
  const numRating = parseFloat(rating);
  const fullStars = Math.floor(numRating);

  const [isRequested, setIsRequested] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const {
    useUserConnections,
    usePendingRequests,
    useSendConnectionRequest,
  } = useConnections();

  const { data: connections = [] } = useUserConnections();
  const { data: pendingRequests = [] } = usePendingRequests();
  const sendRequestMutation = useSendConnectionRequest();

  // A collaborator ID is real if it is a non-empty string that looks like a database CUID or UUID
  const targetId = userId || (typeof id === 'string' ? id : undefined);
  const isRealUser = typeof targetId === 'string' && targetId.length > 5;

  const isConnected = useMemo(() => {
    if (!targetId) return false;
    return connections.some((conn) => conn.id === targetId);
  }, [connections, targetId]);

  const isPendingIncoming = useMemo(() => {
    if (!targetId) return false;
    return pendingRequests.some(
      (req) => req.senderId === targetId || req.sender?.id === targetId
    );
  }, [pendingRequests, targetId]);

  const handleConnect = () => {
    if (isConnected || isRequested || isPendingIncoming || sendRequestMutation.isPending || isSimulating) {
      return;
    }

    if (isRealUser && targetId) {
      sendRequestMutation.mutate(
        { receiverId: targetId },
        {
          onSuccess: () => {
            setIsRequested(true);
          },
        }
      );
    } else {
      // Simulate beautiful premium UX for mock/local dashboard collaborator items
      setIsSimulating(true);
      setTimeout(() => {
        setIsSimulating(false);
        setIsRequested(true);
      }, 800);
    }
  };

  const isLoadingState = sendRequestMutation.isPending || isSimulating;

  let buttonText = "Connect";
  let isDisabled = false;

  if (isConnected) {
    buttonText = "Connected";
    isDisabled = true;
  } else if (isLoadingState) {
    buttonText = "Connecting...";
    isDisabled = true;
  } else if (isRequested || isPendingIncoming) {
    buttonText = "Requested";
    isDisabled = true;
  }

  return (
    <div className="flex justify-between items-center w-full p-2 -mx-2 rounded-[16px] hover:bg-white/5 transition-colors cursor-pointer group">
      
      <div className="flex gap-[12px] md:gap-[16px] items-center min-w-0">
        {/* Avatar */}
        <Avatar 
          name={name} 
          src={avatarUrl} 
          className="w-[55px] h-[55px] md:w-[73px] md:h-[73px] text-[20px] md:text-[24px] shrink-0" 
        />
        
        <div className="flex flex-col gap-[6px] min-w-0">
          <h4 className="font-bold text-[16px] leading-[19px] text-foreground truncate">
            {name}
          </h4>
          
          <div className="flex items-center gap-[8px] md:gap-[10px] text-[13px] md:text-[14px] leading-[16px] text-foreground/60 font-medium mt-[-2px]">
            <span className="truncate">{role}</span> 
            <span className="w-[6px] h-[6px] bg-foreground/60 rounded-full shrink-0" /> 
            <span className="whitespace-nowrap">{members} members</span>
          </div>
          
          <div className="flex items-center gap-[4px]">
             <div className="flex">
               {[...Array(5)].map((_, i) => (
                 <HiStar 
                   key={i} 
                   className={`w-[14px] h-[14px] ${i < fullStars ? "text-foreground" : "text-foreground/20"}`} 
                 />
               ))}
             </div>
             <span className="text-[12px] leading-[14px] text-foreground/60 font-medium ml-[2px]">
               {rating}
             </span>
          </div>
        </div>
      </div>

      {/* Connect Button */}
      <div className="shrink-0 ml-2">
        <Button 
          variant={isConnected ? "secondary" : "primary"}
          size="sm" 
          disabled={isDisabled}
          onClick={(e) => {
            e.stopPropagation();
            handleConnect();
          }}
          className="rounded-[15px] px-[16px] py-[8px] h-[32px] w-[95px] font-semibold text-[14px] leading-[16px] shadow-btn-primary group-hover:shadow-btn-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </Button>
      </div>
      
    </div>
  );
}