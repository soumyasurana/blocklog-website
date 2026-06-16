"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Footer,
  PageFrame,
  PrimaryButton,
  Reveal,
  SecondaryLink,
  SiteHeader,
} from "@/components/site/Primitives";
import { buildMarketingApiUrl } from "@/lib/platform";

type FormState = {
  companyName: string;
  contactName: string;
  workEmail: string;
  jobTitle: string;
  companySize: string;
  cloudProvider: string;
  deploymentType: string;
  dailyLogVolume: string;
  ssoRequired: string;
  airGapped: string;
  additionalRequirements: string;
};

type DeploymentRequestResponse = {
  request_id: string;
  organization_id: string;
  company_name: string;
  work_email: string;
  status: string;
  created_at: string;
  expected_response_timeframe: string;
};

const initialState: FormState = {
  companyName: "",
  contactName: "",
  workEmail: "",
  jobTitle: "",
  companySize: "",
  cloudProvider: "AWS",
  deploymentType: "Docker Compose",
  dailyLogVolume: "",
  ssoRequired: "Yes",
  airGapped: "No",
  additionalRequirements: "",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/48">
      {children}
    </label>
  );
}

const inputClassName =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/28 focus:bg-black/30";

export default function VpcDeploymentPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(buildMarketingApiUrl("/onboarding/deployment-request"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: form.companyName,
          contact_name: form.contactName,
          work_email: form.workEmail,
          job_title: form.jobTitle,
          company_size: form.companySize,
          cloud_provider: form.cloudProvider,
          deployment_type: form.deploymentType,
          daily_log_volume: form.dailyLogVolume,
          sso_required: form.ssoRequired === "Yes",
          air_gapped: form.airGapped === "Yes",
          additional_requirements: form.additionalRequirements,
        }),
      });

      const payload = (await response.json()) as DeploymentRequestResponse | { detail?: string };
      if (!response.ok) {
        const message =
          "detail" in payload && typeof payload.detail === "string"
            ? payload.detail
            : "Unable to submit deployment request.";
        throw new Error(message);
      }

      const successPayload = payload as DeploymentRequestResponse;

      const search = new URLSearchParams({
        requestId: successPayload.request_id,
        email: successPayload.work_email,
        timeframe: successPayload.expected_response_timeframe,
      });

      router.push(`/get-started/vpc/confirmation?${search.toString()}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit deployment request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <PageFrame>
        <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <Reveal className="grid gap-6 lg:grid-cols-[0.95fr_1.25fr]">
            <section className="liquid-glass rounded-[2rem] border border-[rgba(255,196,118,0.24)] p-6 sm:p-8">
              <p className="eyebrow">Enterprise VPC</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Deploy with full infrastructure control
              </h1>
              <p className="mt-5 text-sm leading-8 text-white/68 sm:text-[15px]">
                Share your deployment requirements and our team will guide you through licensing,
                architecture fit, and rollout planning for private cloud or regulated environments.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Private networking and tenant-isolated infrastructure",
                  "Security and compliance review before deployment",
                  "Support for Kubernetes, managed container platforms, and controlled networks",
                  "Data ownership aligned with enterprise operating requirements",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/76"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <SecondaryLink href="/get-started">Back to deployment options</SecondaryLink>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="liquid-glass-strong rounded-[2rem] border border-white/10 p-6 sm:p-8"
            >
              <div className="grid gap-8">
                <section>
                  <p className="eyebrow">Company Information</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldLabel>Company Name</FieldLabel>
                      <input
                        className={inputClassName}
                        value={form.companyName}
                        onChange={(event) => updateField("companyName", event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <FieldLabel>Contact Name</FieldLabel>
                      <input
                        className={inputClassName}
                        value={form.contactName}
                        onChange={(event) => updateField("contactName", event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <FieldLabel>Work Email</FieldLabel>
                      <input
                        className={inputClassName}
                        type="email"
                        value={form.workEmail}
                        onChange={(event) => updateField("workEmail", event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <FieldLabel>Job Title</FieldLabel>
                      <input
                        className={inputClassName}
                        value={form.jobTitle}
                        onChange={(event) => updateField("jobTitle", event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <FieldLabel>Company Size</FieldLabel>
                      <input
                        className={inputClassName}
                        value={form.companySize}
                        onChange={(event) => updateField("companySize", event.target.value)}
                        placeholder="e.g. 500-1000 employees"
                        required
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <p className="eyebrow">Infrastructure</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel>Cloud Provider</FieldLabel>
                      <select
                        className={inputClassName}
                        value={form.cloudProvider}
                        onChange={(event) => updateField("cloudProvider", event.target.value)}
                      >
                        {["AWS", "Azure", "GCP", "Other"].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Deployment Type</FieldLabel>
                      <select
                        className={inputClassName}
                        value={form.deploymentType}
                        onChange={(event) => updateField("deploymentType", event.target.value)}
                      >
                        {["Docker Compose"].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <FieldLabel>Expected Daily Log Volume</FieldLabel>
                      <input
                        className={inputClassName}
                        value={form.dailyLogVolume}
                        onChange={(event) => updateField("dailyLogVolume", event.target.value)}
                        placeholder="e.g. 25 million events/day"
                        required
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <p className="eyebrow">Security &amp; Compliance</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel>SSO Required?</FieldLabel>
                      <select
                        className={inputClassName}
                        value={form.ssoRequired}
                        onChange={(event) => updateField("ssoRequired", event.target.value)}
                      >
                        {["Yes", "No"].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Air-Gapped Environment?</FieldLabel>
                      <select
                        className={inputClassName}
                        value={form.airGapped}
                        onChange={(event) => updateField("airGapped", event.target.value)}
                      >
                        {["Yes", "No"].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <FieldLabel>Additional Requirements</FieldLabel>
                      <textarea
                        className={`${inputClassName} min-h-36 resize-y`}
                        value={form.additionalRequirements}
                        onChange={(event) => updateField("additionalRequirements", event.target.value)}
                        placeholder="Network controls, identity provider details, compliance constraints, support expectations, or rollout notes."
                      />
                    </div>
                  </div>
                </section>

                {error ? (
                  <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-sm bg-white px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-black transition hover:bg-white/92 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Request VPC Deployment"}
                  </button>
                  <p className="text-sm leading-7 text-white/52">
                    We’ll review the request and follow up with licensing and deployment guidance.
                  </p>
                </div>
              </div>
            </form>
          </Reveal>
        </main>
        <Footer />
      </PageFrame>
    </div>
  );
}
