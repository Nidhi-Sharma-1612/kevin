import PartnerAgenciesPage, { partnerMetadata } from "@/components/PartnerAgenciesPage";

export function generateMetadata() {
  return partnerMetadata("es");
}

export default function Page() {
  return <PartnerAgenciesPage lang="es" />;
}
