import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AnechoPage from "./pages/AnechoPage";
import FlorindaPage from "./pages/FlorindaPage";
import LogsIndexPage from "./pages/LogsIndexPage";
import LogPostPage from "./pages/LogPostPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/anecho" element={<AnechoPage />} />
        <Route path="/projects/florinda" element={<FlorindaPage />} />
        <Route path="/logs" element={<LogsIndexPage />} />
        <Route path="/logs/:slug" element={<LogPostPage />} />
      </Routes>
    </Layout>
  );
}
