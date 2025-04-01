import Announcements from "@/components/Announcements";
import { SectionCards } from "@/components/sectioncard";
export default function DashboardPage() {
  return (
    <div className="p-4 text-amber-50 flex h-full w-full md:flex-row flex-col gap-4 rounded-tl-2xl border  md:p-10 border-neutral-700 bg-neutral-900">
      {/* Left Side */}
      <div className="w-full lg:w-2/3">
     
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
               
              </div>
             
            </div>
          </div>
      
      </div>
      {/* Right  Side */}
      <div className="w-full lg:w-1/3">
      <Announcements/></div>
    </div>
  );
}
