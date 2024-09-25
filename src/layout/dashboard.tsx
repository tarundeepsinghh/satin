import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function Component() {
  return <></>;
}

// If you want to customize the component display name in React dev tools:
Component.displayName = "UpcomingTeleportMaintenancePage";

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <h1>
        {error.status} {error.statusText}
      </h1>
    );
  }
  const errMsg = error instanceof Error ? error.message : "Unknown error";
  return <h1>{errMsg}</h1>;
}

ErrorBoundary.displayName = "UpcomingTeleportMaintenanceErrorBoundary";
