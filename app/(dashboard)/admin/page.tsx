import Announcements from "@/components/Announcements";
import { SectionCards } from "@/components/sectioncard";
import { Chartcomponent } from "@/components/ui/areachart";
export default function DashboardPage() {
  return (
    <div className="p-4 md:m-1 text-amber-50 flex h-full w-full  md:flex-row  flex-col gap-4 rounded-l-2xl border rounded-r-lg  md:p-10 border-neutral-700 bg-neutral-950">
      {/* Left Side */}
      <div className="w-full lg:w-2/3">
     
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
             
             
            </div>
          </div>
          <div className="m-4 ">
      <Chartcomponent/>
      </div>
      </div>
      {/* Right  Side */}
      <div className="w-full  lg:w-1/3">
      <Announcements/></div>
    </div>
  );
}
