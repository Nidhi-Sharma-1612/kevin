import PartnerAgenciesPage, { partnerMetadata } from "@/components/PartnerAgenciesPage";

export const metadata = partnerMetadata("fr");

export default function Page() {
  return <PartnerAgenciesPage lang="fr" />;
}
