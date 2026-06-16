import { notFound } from "next/navigation";

import { docsContent, renderDoc } from "../content";

export function generateStaticParams() {
  return Object.keys(docsContent).map((key) => ({
    slug: key.split("/"),
  }));
}

export default async function NestedDocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = renderDoc(slug.join("/"));

  if (!page) {
    notFound();
  }

  return page;
}
