import { Suspense } from "react";
import CaesContent from "./CaesContent";

export default function CaesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CaesContent />
    </Suspense>
  );
}
