"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`);
    return isActive
      ? "flex items-center gap-4 px-6 py-2.5 bg-[#1E2024] text-[#00F5FF] border-l-2 border-[#00F5FF] active:scale-[0.99] transition-all"
      : "flex items-center gap-4 px-6 py-2.5 text-slate-500 hover:bg-[#282A2E] hover:text-white transition-all";
  };

  const getIconClass = (path: string) => {
    return "material-symbols-outlined text-[20px]";
  };

  const getTextClass = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`);
    return isActive
      ? "font-['Space_Grotesk'] uppercase text-[11px] tracking-widest font-bold"
      : "font-['Space_Grotesk'] uppercase text-[11px] tracking-widest";
  };

  return (
    <aside className="bg-[#1A1C20] w-64 flex flex-col h-full py-4 border-r border-[#3A494A]/10 shrink-0">
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 p-3 bg-[#1E2024] rounded-lg border border-outline-variant/10">
          <div className="w-8 h-8 flex items-center justify-center bg-primary-container/10 text-primary-container rounded">
            <span className="material-symbols-outlined">dns</span>
          </div>
          <div>
            <div className="text-[11px] technical-label text-white font-bold leading-tight">
              Mainnet-Beta
            </div>
            <div className="text-[10px] text-slate-500 font-mono">0x84f...2a1c</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        <div className="px-6 mb-2 text-[10px] technical-label text-slate-500 font-bold opacity-50">
          Infrastructure
        </div>
        
        <Link href="/dashboard" className={pathname === "/dashboard" ? getLinkClass("/dashboard") : "flex items-center gap-4 px-6 py-2.5 text-slate-500 hover:bg-[#282A2E] hover:text-white transition-all"}>
          <span className={getIconClass("/dashboard")}>dashboard</span>
          <span className={pathname === "/dashboard" ? getTextClass("/dashboard") : "font-['Space_Grotesk'] uppercase text-[11px] tracking-widest"}>Overview</span>
        </Link>
        
        <Link href="/dashboard/ledger" className={getLinkClass("/dashboard/ledger")}>
          <span className={getIconClass("/dashboard/ledger")}>account_tree</span>
          <span className={getTextClass("/dashboard/ledger")}>Ledger</span>
        </Link>
        
        <Link href="/dashboard/logs" className={getLinkClass("/dashboard/logs")}>
          <span className={getIconClass("/dashboard/logs")}>history_edu</span>
          <span className={getTextClass("/dashboard/logs")}>Audit Trail</span>
        </Link>
        
        <Link href="/dashboard/evidence" className={getLinkClass("/dashboard/evidence")}>
          <span className={getIconClass("/dashboard/evidence")}>inventory_2</span>
          <span className={getTextClass("/dashboard/evidence")}>Evidence Bundles</span>
        </Link>
        
        <Link href="/auditor" className={getLinkClass("/auditor")}>
          <span className={getIconClass("/auditor")}>shield_person</span>
          <span className={getTextClass("/auditor")}>Auditor Portal</span>
        </Link>
        
        <Link href="/dashboard/hitl" className={getLinkClass("/dashboard/hitl")}>
          <span className={getIconClass("/dashboard/hitl")}>verified_user</span>
          <span className={getTextClass("/dashboard/hitl")}>HITL Approvals</span>
        </Link>
        
        <div className="px-6 mt-8 mb-2 text-[10px] technical-label text-slate-500 font-bold opacity-50">
          Configuration
        </div>
        
        <Link href="/dashboard/api-keys" className={getLinkClass("/dashboard/api-keys")}>
          <span className={getIconClass("/dashboard/api-keys")}>key</span>
          <span className={getTextClass("/dashboard/api-keys")}>API Keys</span>
        </Link>
        
        <Link href="/dashboard/compliance" className={getLinkClass("/dashboard/compliance")}>
          <span className={getIconClass("/dashboard/compliance")}>gavel</span>
          <span className={getTextClass("/dashboard/compliance")}>Compliance</span>
        </Link>
      </nav>
      
      <div className="px-4 py-4 space-y-1 border-t border-[#3A494A]/10">
        <button className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-fixed py-2 text-[11px] technical-label font-bold rounded-sm mb-4 hover:brightness-110 transition-all">
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Bundle
        </button>
        <Link href="/docs" className="flex items-center gap-3 px-2 py-1.5 text-slate-500 hover:text-white text-[10px] technical-label">
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          Documentation
        </Link>
        <Link href="/support" className="flex items-center gap-3 px-2 py-1.5 text-slate-500 hover:text-white text-[10px] technical-label">
          <span className="material-symbols-outlined text-[18px]">help_center</span>
          Support
        </Link>
      </div>
    </aside>
  );
}
