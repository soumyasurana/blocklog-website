import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.BLOCKLOG_API_BASE_URL ?? "https://api.blocklogsecurity.com/api/v1";

type Context = {
  params: Promise<{ path: string[] }>;
};

async function forward(req: NextRequest, context: Context, method: string) {
  const { path } = await context.params;
  const suffix = path.join("/");
  const target = new URL(`${BASE_URL.replace(/\/$/, "")}/${suffix}`);

  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });

  const headers = new Headers();
  const auth = req.headers.get("authorization");
  const company = req.headers.get("x-company-id");
  const apiKey = req.headers.get("x-api-key");

  if (auth) headers.set("authorization", auth);
  if (company) headers.set("x-company-id", company);
  if (apiKey) headers.set("x-api-key", apiKey);

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const init: RequestInit = { method, headers };
  if (method !== "GET" && method !== "HEAD") {
    init.body = await req.text();
  }

  try {
    const response = await fetch(target, init);
    const bodyText = await response.text();

    return new NextResponse(bodyText, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        detail:
          "Unable to reach Blocklog API. Set BLOCKLOG_API_BASE_URL to your running backend URL.",
      },
      { status: 502 },
    );
  }
}

export async function GET(req: NextRequest, context: Context) {
  return forward(req, context, "GET");
}

export async function POST(req: NextRequest, context: Context) {
  return forward(req, context, "POST");
}

export async function PUT(req: NextRequest, context: Context) {
  return forward(req, context, "PUT");
}

export async function PATCH(req: NextRequest, context: Context) {
  return forward(req, context, "PATCH");
}

export async function DELETE(req: NextRequest, context: Context) {
  return forward(req, context, "DELETE");
}
