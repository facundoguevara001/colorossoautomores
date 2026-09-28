import React from "react";
import { InquiryProvider } from "./context/InquiryContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
export default function App() { return <InquiryProvider><Layout><Home /></Layout></InquiryProvider>; }
