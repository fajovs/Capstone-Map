export type Hazard = {
  hazard_id: string;
  title: string;
  status: "pending" | "approved" | "under-maintenance" | "resolved";
  location: string;
  hazard_type:
    | "Electrical"
    | "Structural"
    | "Transportation"
    | "Water/Drainage"
    | "Public Safety"
    | "Communication"
    | "Other";
  description: string;
  longitude: number;
  latitude: number;
  started_at: Date | null;
  resolved_at: Date | null;
  created_at: string;
  profile_id: string;

};

export type Image = {
  image_id: string;
  hazard_id: string;
  url: string;
  date_created: string;
};

export type Profile = {
  profile_id: string;
  full_name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
};
