import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import NotFoundPage from "./pages/not-found";

function AppRouter() {
  const ComingSoonPage = lazy(() =>
    import("./pages/coming-soon").then((module) => ({
      default: module.Component,
    }))
  );

  const router = createHashRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Navigate to='/coming-soon' replace />} />
        {/* //temp */}
        {/* <Route path='/' element={<Navigate to='/dashboard' replace />} /> */}
        <Route
          path='coming-soon'
          element={
            <Suspense
              fallback={
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  style={{ height: "100vh" }}>
                  <Box textAlign='center'>
                    <CircularProgress title='progress loader' />
                    <p>Loading...</p>
                  </Box>
                </Box>
              }>
              <ComingSoonPage />
            </Suspense>
          }
        />
        {/* <Route path='/' element={<DashboardLayout />}>
          <Route
            path='dashboard'
            element={
              <Suspense
                fallback={
                  <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    style={{ height: "100vh" }}>
                    <Box textAlign='center'>
                      <CircularProgress title='progress loader' />
                      <p>Loading...</p>
                    </Box>
                  </Box>
                }>
                <LandingPage />
              </Suspense>
            }
          />
        </Route> */}
        <Route path='*' element={<NotFoundPage />} />
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default AppRouter;
