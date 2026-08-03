import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AnechoPage from "./pages/AnechoPage";
import FlorindaPage from "./pages/FlorindaPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/anecho" element={<AnechoPage />} />
        <Route path="/projects/florinda" element={<FlorindaPage />} />
      </Routes>
    </Layout>
  );
}
