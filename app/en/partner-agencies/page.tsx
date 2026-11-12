import PartnerAgenciesPage, { partnerMetadata } from "@/components/PartnerAgenciesPage";

export function generateMetadata() {
  return partnerMetadata("en");
}

export default function Page() {
  return <PartnerAgenciesPage lang="en" />;
}
