import L from "leaflet";

function icon(color: string) {
  return new L.DivIcon({
    className: "",
    html: `
      <div style="
        width:16px;
        height:16px;
        background:${color};
        border-radius:50%;
        border:3px solid white;
        box-shadow: 0 0 10px ${color};
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export const hazardIconMap: Record<string, L.DivIcon> = {
  Electrical: icon("#facc15"),
  Structural: icon("#ef4444"),
  Transportation: icon("#3b82f6"),
  "Water/Drainage": icon("#06b6d4"),
  "Public Safety": icon("#f97316"),
  Communication: icon("#a855f7"),
  Other: icon("#9ca3af"),
};

export const selectedIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:18px;
      height:18px;
      background:red;
      border-radius:50%;
      border:3px solid white;
      box-shadow: 0 0 12px red;
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

