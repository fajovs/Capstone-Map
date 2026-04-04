import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const Map = () => {
  return (
    <MapContainer center={[11.6083, 125.4319]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0}} zoomControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ZoomControl position="topright" />
      <Marker position={[51.505, -0.09]}>
      
      </Marker>
    </MapContainer>
  );
};

export default Map;