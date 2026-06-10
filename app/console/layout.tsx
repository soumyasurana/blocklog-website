/**
 * Console (Governance) layout
 *
 * Wraps all /console/* routes with the shared BlocklogShell and the
 * GovernanceSidebarNav. Auth-gating is handled inside the console page
 * itself, so this layout stays as a lean server component.
 */

import type { ReactNode } from "react";
import BlocklogShell from "@/components/nav/BlocklogShell";
import GovernanceSidebarNav from "@/components/nav/GovernanceSidebarNav";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Fixed top shell — 56 px */}
      <BlocklogShell current="governance" />

      {/* Fixed left sidebar — 240 px, sits below the shell */}
      <GovernanceSidebarNav />

      {/* Main content area
          - pt-14  : clears the 56 px shell on all screens
          - md:pl-60: 240 px sidebar offset on ≥768 px
          - pb-16  : clears the 64 px mobile tab bar on small screens
          - md:pb-0: reset on desktop
      */}
      <div
        id="governance-content"
        className="min-h-screen pt-14 pb-16 md:pb-0 md:pl-60"
      >
        {children}
      </div>
    </>
  );
}
