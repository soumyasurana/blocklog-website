import Link from "next/link";

import { Footer, PageFrame, PrimaryButton, Reveal, SiteHeader } from "@/components/site/Primitives";

export default async function VpcConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    requestId?: string;
    email?: string;
    timeframe?: string;
  }>;
}) {
  const { requestId, email, timeframe } = await searchParams;

  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-14 sm:px-6 lg:px-8">
          <Reveal className="liquid-glass-strong w-full rounded-[2rem] border border-[rgba(255,196,118,0.24)] p-8 sm:p-10">
            <p className="eyebrow">Request Received</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Thank you. Our team will review your deployment requirements and contact you shortly with licensing and deployment instructions.
            </h1>
            <p className="mt-5 text-sm leading-8 text-white/66 sm:text-[15px]">
              Your request has been captured for enterprise review. We’ll follow up with the next
              steps for architecture fit, licensing, and deployment planning.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                  Request ID
                </p>
                <p className="mt-2 break-all text-sm leading-7 text-white/78">
                  {requestId || "Pending"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                  Contact Email
                </p>
                <p className="mt-2 break-all text-sm leading-7 text-white/78">
                  {email || "Provided in request"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                  Expected Response
                </p>
                <p className="mt-2 text-sm leading-7 text-white/78">
                  {timeframe || "Within 2 business days"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <PrimaryButton href="/docs/architecture/overview" inverted>
                Review Platform Architecture
              </PrimaryButton>
              <Link
                href="/get-started"
                className="text-xs uppercase tracking-[0.18em] text-white/48 transition hover:text-white/72"
              >
                Back to deployment options
              </Link>
            </div>
          </Reveal>
        </main>
        <Footer />
      </PageFrame>
    </div>
  );
}
