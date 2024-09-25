// import { Box, CircularProgress } from "@mui/material";
// import { lazy, Suspense } from "react";
// import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import NotFoundPage from "./pages/not-found";

function AppRouter() {
  // const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  //   const token = useSelector(UserSelector.selectToken);
  //   const appMode = useSelector(AppSelector.selectAppMode);

  //   if (!token)
  //     return appMode === UserRole.CUSTOMER ? (
  //       <Navigate to="/login" />
  //     ) : (
  //       <Navigate to="/support" />
  //     );
  //   return children;
  // };

  // const PublicRoute = ({ children }: { children: JSX.Element }) => {
  //   const token = useSelector(UserSelector.selectToken);
  //   if (token) return <Navigate to="/dashboard" />;
  //   return children;
  // };

  // const Dashboard = lazy(() =>
  //   import("./pages/dashboard").then((module) => ({
  //     default: module.Component,
  //   }))
  // );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        {/* <Route path="/" element={<DashboardLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vsat-link"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <ConnectedDevices />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="routers"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <Routers />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="bandwidth-group"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <BandwidthGroup />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="disconnection"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <DisconnectionStatus />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="upcoming-teleport-maintenance"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <UpcomingTeleportMaintenance />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <Profile />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="vsat/:id"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <Vsat />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="router/:id"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ height: "100vh" }}
                    >
                      <Box textAlign="center">
                        <CircularProgress title="progress loader" />
                        <p>Loading...</p>
                      </Box>
                    </Box>
                  }
                >
                  <RouterDetailPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login user="Customer" />
            </PublicRoute>
          }
        />
        <Route
          path="support"
          element={
            <PublicRoute>
              <Login user="Customer Support" />
            </PublicRoute>
          }
        /> */}
        <Route path='*' element={<NotFoundPage />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default AppRouter;
