import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import {
  Megaphone,
  Eye,
  Edit2,
  Trash2,
  Check,
  X,
  Plus
} from 'lucide-react';

export function SystemAnnouncement() {
  const [isVisible, setIsVisible] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [announcementText, setAnnouncementText] = useState("Scheduled maintenance on Jul 15, 2025 from 00:00–04:00 UTC. The marketplace will be temporarily unavailable.");
  const [draftText, setDraftText] = useState(announcementText);

  const handleSave = () => {
    setAnnouncementText(draftText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftText(announcementText);
    setIsEditing(false);
  };

  if (!isVisible) {
    return (
      <div className="flex flex-col items-center justify-center p-8 w-full bg-white/2 border-[0.8px] border-white/10 border-dashed rounded-[20px]">
        <span className="font-['Inter'] text-[13px] text-white/45 mb-4">No active system announcements.</span>
        <Button variant="ghost" size="sm" icon={Plus} iconPosition="left" onClick={() => setIsVisible(true)}>
          Create Announcement
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start p-6 w-full bg-white/5 border-[0.8px] border-white/10 rounded-[20px] transition-all">
      <div className="flex flex-row items-center gap-3 w-full mb-4">
        <div className="flex justify-center items-center w-9 h-9 bg-primary-green/10 border border-primary-green/20 rounded-xl shrink-0">
          <Megaphone className="w-4.25 h-4.25 text-primary-green" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-['Raleway'] font-bold text-[15px] text-white">System Announcement</h2>
          {!isEditing && (
            <span className={`px-2 py-0.5 rounded-md font-['Inter'] font-bold text-[10px] ${isPreview ? 'bg-secondary-blue/10 text-secondary-blue' : 'bg-primary-green/10 text-primary-green'}`}>
              {isPreview ? 'PREVIEW MODE' : 'ACTIVE'}
            </span>
          )}
        </div>
      </div>

      <div className={`flex flex-col p-4 w-full rounded-xl transition-all ${isEditing ? 'bg-black/40 border-[0.8px] border-primary-green/50' : 'bg-white/3 border-[0.8px] border-white/10'}`}>
        {isEditing ? (
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            className="w-full bg-transparent text-[13px] font-['Raleway'] text-white resize-none outline-none min-h-15"
            placeholder="Enter announcement here..."
            autoFocus
          />
        ) : (
          <p className="font-['Raleway'] text-[13px] text-white leading-relaxed">
            {announcementText}
          </p>
        )}
        
        {!isEditing && (
          <span className="font-['Inter'] text-[11px] text-white/45 mt-1.5">
            Displayed to all users · Last updated recently
          </span>
        )}
      </div>

      <div className="flex flex-row items-center gap-2 mt-4">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-primary-green rounded-lg transition-colors hover:bg-[#63a838]">
              <Check className="w-3 h-3 text-black" />
              <span className="font-['Inter'] font-bold text-[11px] text-black">Save</span>
            </button>
            <button onClick={handleCancel} className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white/3 border-[0.8px] border-white/10 rounded-lg transition-colors hover:bg-white/8">
              <X className="w-3 h-3 text-white/75" />
              <span className="font-['Inter'] font-medium text-[11px] text-white/75">Cancel</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsPreview(!isPreview)} className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 border-[0.8px] rounded-lg transition-colors ${isPreview ? 'bg-secondary-blue/10 border-secondary-blue/20 hover:bg-secondary-blue/20' : 'bg-primary-green/10 border-primary-green/20 hover:bg-primary-green/20'}`}>
              <Eye className={`w-3 h-3 ${isPreview ? 'text-secondary-blue' : 'text-primary-green'}`} />
              <span className={`font-['Inter'] font-bold text-[11px] ${isPreview ? 'text-secondary-blue' : 'text-primary-green'}`}>
                {isPreview ? 'Exit Preview' : 'Preview'}
              </span>
            </button>
            <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white/3 border-[0.8px] border-white/10 rounded-lg transition-colors hover:bg-white/8">
              <Edit2 className="w-3 h-3 text-white/45" />
              <span className="font-['Inter'] font-medium text-[11px] text-white/45">Edit</span>
            </button>
            <button onClick={() => setIsVisible(false)} className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-accent-red/10 border-[0.8px] border-accent-red/20 rounded-lg transition-colors hover:bg-accent-red/20">
              <Trash2 className="w-3 h-3 text-accent-red" />
              <span className="font-['Inter'] font-medium text-[11px] text-accent-red">Remove</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}