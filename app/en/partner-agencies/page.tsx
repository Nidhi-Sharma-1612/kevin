import PartnerAgenciesPage, { partnerMetadata } from "@/components/PartnerAgenciesPage";

export const metadata = partnerMetadata("en");

export default function Page() {
  return <PartnerAgenciesPage lang="en" />;
}
