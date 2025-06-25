// src/app/api/docs/json/route.ts
import { openApiDocument } from "@/shared/contract";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(openApiDocument);
}
