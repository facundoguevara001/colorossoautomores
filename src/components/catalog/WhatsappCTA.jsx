import React from "react";
import { useInquiry } from "../../context/InquiryContext";
export default function WhatsappCTA({ product, label = "Consultar por WhatsApp" }) { const { phone } = useInquiry(); const message = product ? `Hola, quiero consultar por ${product.name} (${product.variant}).` : "Hola, quiero consultar por un vehículo."; return <a className="button button--whatsapp" href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">{label}</a>; }
