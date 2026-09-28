import React, { createContext, useContext } from "react";
const InquiryContext = createContext({ phone: "5491125218692" });
export const InquiryProvider = ({ children }) => <InquiryContext.Provider value={{ phone: "5491125218692" }}>{children}</InquiryContext.Provider>;
export const useInquiry = () => useContext(InquiryContext);
