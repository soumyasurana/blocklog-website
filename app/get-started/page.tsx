"use client";

import Link from "next/link";

import {
  Footer,
  PageFrame,
  PrimaryButton,
  Reveal,
  SecondaryLink,
  SiteHeader,
} from "@/components/site/Primitives";
import { buildDashboardUrl } from "@/lib/platform";

const options = [
  {
    eyebrow: "Hosted SaaS",
    title: "Hosted by Blocklog",
    description: "Get started in minutes. We host and manage the infrastructure.",
    benefits: [
      "Instant setup",
      "Managed infrastructure",
      "Automatic upgrades",
      "Free trial available",
    ],
    href: buildDashboardUrl("/auth/signup"),
    cta: "Start Free Trial",
    accent: "rgba(108, 154, 255, 0.16)",
    border: "rgba(108, 154, 255, 0.28)",
  },
  {
    eyebrow: "Enterprise VPC",
    title: "Deploy in Your VPC",
    description:
      "Run Blocklog inside your own AWS, Azure, or GCP environment with full control of data and infrastructure.",
    benefits: [
      "Data remains in customer environment",
      "Enterprise security",
      "Compliance-friendly deployment",
      "Private networking support",
    ],
    href: "/get-started/vpc",
    cta: "Request VPC Deployment",
    accent: "rgba(255, 196, 118, 0.14)",
    border: "rgba(255, 196, 118, 0.24)",
  },
];

export default function GetStartedPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Deployment</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Choose Your Deployment Option
            </h1>
            <p className="mt-5 text-base leading-8 text-white/64 sm:text-lg">
              Start with managed SaaS for the fastest trial, or choose a private deployment path
              built for enterprise security, compliance, and data ownership.
            </p>
          </div>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            {options.map((option, index) => (
              <div key={option.title} >
                <article
                  className="liquid-glass-strong flex h-full flex-col rounded-[2rem] border p-6 sm:p-8"
                  style={{
                    borderColor: option.border,
                    background: `linear-gradient(180deg, ${option.accent}, rgba(255,255,255,0.02))`,
                  }}
                >
                  <p className="eyebrow">{option.eyebrow}</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">{option.title}</h2>
                  <p className="mt-4 text-sm leading-8 text-white/68 sm:text-[15px]">
                    {option.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {option.benefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/76"
                      >
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <PrimaryButton href={option.href} inverted className="justify-center sm:justify-start">
                      {option.cta}
                    </PrimaryButton>
                    {option.title === "Deploy in Your VPC" ? (
                      <SecondaryLink href="/docs/architecture/notification-routing">
                        Enterprise-ready controls
                      </SecondaryLink>
                    ) : (
                      <SecondaryLink href="/docs/getting-started/quickstart">
                        See quickstart
                      </SecondaryLink>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </section>

          <div className="mt-10">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-6 sm:px-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
                    Hosted SaaS
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Best for teams that want immediate onboarding and a self-serve trial.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
                    Customer VPC
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Best for regulated environments that need private networking, tighter compliance
                    boundaries, and infrastructure control.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
                    Need more context?
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Review the docs or contact the team before choosing the path that fits your
                    security posture.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </PageFrame>
    </div>
  );
}
