import Announcements from "@/components/Announcements";
export default function DashboardPage() {
  return (
    <div className="p-4 text-amber-50 flex h-full w-full md:flex-row flex-col gap-4 rounded-tl-2xl border  md:p-10 border-neutral-700 bg-neutral-900">
      {/* Left Side */}
      <div className="w-full lg:w-2/3">
        <div className="flex  gap-4  justify-between flex-wrap">
      
        </div>
      </div>
      {/* Right  Side */}
      <div className="w-full lg:w-1/3">
      <Announcements/></div>
    </div>
  );
}
