import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const AnechoPage = lazy(() => import("./pages/AnechoPage"));
const FlorindaPage = lazy(() => import("./pages/FlorindaPage"));
const LogsIndexPage = lazy(() => import("./pages/LogsIndexPage"));
const LogPostPage = lazy(() => import("./pages/LogPostPage"));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="route-loading" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/anecho" element={<AnechoPage />} />
          <Route path="/projects/florinda" element={<FlorindaPage />} />
          <Route path="/logs" element={<LogsIndexPage />} />
          <Route path="/logs/:slug" element={<LogPostPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
