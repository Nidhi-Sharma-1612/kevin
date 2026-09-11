export type LocationOption = {
  value: string;
  label: string;
};

export type LocationGroup = {
  region: string;
  options: LocationOption[];
};

export const LOCATION_GROUPS: LocationGroup[] = [
  {
    region: "Costa del Sol, Spain",
    options: [
      { value: "any", label: "Anywhere" },
      { value: "santa-clara", label: "Santa Clara" },
      { value: "nogalera", label: "La Nogalera" },
      { value: "torre-la-roca", label: "Torre La Roca" },
      { value: "centre", label: "City Centre" },
    ],
  },
];

// Maps a LocationPicker option value to the `neighborhood` field on
// Property, so a homepage search can filter the properties list.
export const LOCATION_TO_NEIGHBORHOOD: Record<string, string> = {
  "santa-clara": "Santa Clara",
  nogalera: "La Nogalera",
  "torre-la-roca": "Torre La Roca",
  centre: "City Centre",
};
