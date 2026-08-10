import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { HiMagnifyingGlass, HiPlus } from 'react-icons/hi2';

export function ProjectHeader() {
  return (
    <header className="flex flex-row items-center p-2 w-full gap-2">
      <div className="flex-1 min-w-0">
        <div className="relative w-full">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input 
            type="text" 
            placeholder="Search by project name, genre, skill, owner or key"
            className="w-full rounded-full pl-10 pr-4 py-2.5 text-[12px] text-text-muted"
          />
        </div>
      </div>
      
      <Button className="flex items-center gap-1.75 bg-primary-green rounded-full px-4.25 py-2.25 h-9.5">
        <HiPlus className="w-3 h-3" />
        <span className="text-[12px] font-semibold">Create Project</span>
      </Button>
    </header>
  );
}