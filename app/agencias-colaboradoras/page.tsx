import PartnerAgenciesPage, { partnerMetadata } from "@/components/PartnerAgenciesPage";

export const metadata = partnerMetadata("es");

export default function Page() {
  return <PartnerAgenciesPage lang="es" />;
}
