export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-24">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>

        <p className="mt-4 text-muted-foreground">
          Have questions about Blocklog, enterprise deployments, compliance,
          integrations, or partnerships? Get in touch.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <a
              href="mailto:founder@blocklogsecurity.com"
              className="text-lg font-medium hover:underline"
            >
              founder@blocklogsecurity.com
            </a>
          </div>

          <a
            href="mailto:founder@blocklogsecurity.com?subject=Blocklog%20Inquiry"
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Contact via Email
          </a>

          <div>
            <p className="text-sm text-muted-foreground">Response Time</p>
            <p>Usually within 24 hours.</p>
          </div>
        </div>
      </div>
    </main>
  );
}