"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type DocLink = {
  title: string;
  href: string;
  description: string;
};

export type RouteRow = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  auth: string;
  purpose: string;
  request?: string;
  response?: string;
};

export function DocsArticle({
  eyebrow,
  title,
  description,
  children,
  related,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  related?: DocLink[];
}) {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">{description}</p>
        </header>

        {children}

        {related && related.length > 0 ? (
          <nav className="border-t border-white/10 pt-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Related Pages
            </p>
            <LinkGrid links={related} />
          </nav>
        ) : null}
      </div>
    </main>
  );
}

export function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      {eyebrow ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-3 space-y-4 text-sm leading-7 text-muted sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export function MiniGrid({
  items,
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
        >
          <h3 className="text-sm font-semibold text-white sm:text-[15px]">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
        </article>
      ))}
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm leading-7 text-muted sm:text-[15px]">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-200 sm:p-5">
      <code>{code}</code>
    </pre>
  );
}

export function Callout({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[rgba(var(--accent-rgb),0.22)] bg-[rgba(var(--accent-rgb),0.06)] p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        {label}
      </p>
      <div className="space-y-3 text-sm leading-7 text-muted sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export function FactsGrid({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            {item.label}
          </p>
          <p className="mt-2 text-sm leading-7 text-white">{item.value}</p>
        </div>
      ))}
    </section>
  );
}

function MethodBadge({ method }: { method: RouteRow["method"] }) {
  const styles = {
    GET: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20",
    POST: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20",
    PATCH: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/20",
    PUT: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/20",
    DELETE: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] ${styles[method]}`}
    >
      {method}
    </span>
  );
}

export function RouteTable({
  title,
  routes,
}: {
  title: string;
  routes: RouteRow[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-4 space-y-4">
        {routes.map((route) => (
          <article
            key={`${route.method}-${route.path}`}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <MethodBadge method={route.method} />
              <code className="text-sm text-[var(--accent)]">{route.path}</code>
              <span className="text-xs uppercase tracking-[0.14em] text-muted">
                {route.auth}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">{route.purpose}</p>
            <div className="mt-3 grid gap-3 text-sm leading-7 text-muted md:grid-cols-2">
              {route.request ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                    Request
                  </p>
                  <p>{route.request}</p>
                </div>
              ) : null}
              {route.response ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                    Response
                  </p>
                  <p>{route.response}</p>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LinkGrid({ links }: { links: DocLink[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left no-underline transition-colors hover:bg-white/[0.05]"
        >
          <p className="text-sm font-semibold text-white">{link.title}</p>
          <p className="mt-2 text-sm leading-7 text-muted">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}
