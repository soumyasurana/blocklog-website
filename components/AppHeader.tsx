//old website
import Link from "next/link";
import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="bg-[#111318] border-b border-[#3A494A]/15 flex justify-between items-center w-full px-6 h-14 z-50 shrink-0">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-lg font-black text-[#00F5FF] tracking-tighter">
          BlockLog
        </Link>
        <nav className="hidden md:flex gap-6 items-center font-['Inter'] font-medium text-sm tracking-tight">
          <Link href="/dashboard/logs" className="text-[#00F5FF] border-b-2 border-[#00F5FF] pb-1">
            Explorer
          </Link>
          <Link href="/dashboard/evidence" className="text-slate-400 hover:text-[#00F5FF] transition-colors duration-200">
            Verification
          </Link>
          <Link href="#" className="text-slate-400 hover:text-[#00F5FF] transition-colors duration-200">
            Nodes
          </Link>
          <Link href="#" className="text-slate-400 hover:text-[#00F5FF] transition-colors duration-200">
            Network
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-on-tertiary/10 border border-tertiary-container/20 rounded-sm">
          <div className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse shadow-[0_0_8px_#3bff17]"></div>
          <span className="text-[10px] technical-label text-tertiary-container font-bold">
            Integrity Verified
          </span>
        </div>
        <div className="h-6 w-px bg-outline-variant/30 mx-2"></div>
        <button className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-sm transition-all">
          <span className="material-symbols-outlined text-[18px]">workspaces</span>
          Workspace
        </button>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link href="/dashboard/settings" className="p-2 text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
        <div className="w-8 h-8 rounded-sm grayscale border border-outline-variant/30 bg-surface-container-high overflow-hidden relative">
          <Image
            alt="Operator Profile"
            className="object-cover"
            fill
            sizes="32px"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVzK7jtuUPUW5t9SaRVERrRuRZID0MUBE_Gq4CE35ul-UbYDAUN5zPAYF32qL6eRq34f1IAsus_EpJZzcH2EAkRpVZMxWpqwBVoxnuIqh6Op3Pq24ZN8qSdSUeHWMXtMomLb2siv4DaNcPhhNRhQgN2WqOYVc6Jzhfmak6dcLD-s2AU5Y7GtUnmOtjUwJiK1PXSzYro-GFHxAbQhMOiA8KV6s_Fvvw1BWCtHeAVYKIF3fmr-c1CF3S5n8EBSk8WhO7IGV_8z6J4lQ"
          />
        </div>
      </div>
    </header>
  );
}
