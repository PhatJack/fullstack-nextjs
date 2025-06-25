"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerDocsPage() {
  return (
    <div className="min-h-dvh">
      <SwaggerUI url="/api/docs/json" />
    </div>
  );
}
