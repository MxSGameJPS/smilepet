import { Suspense } from "react";
import GatosContent from "./GatosContent";

export default function GatosPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <GatosContent />
    </Suspense>
  );
}
