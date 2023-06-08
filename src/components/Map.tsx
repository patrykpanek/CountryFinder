import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useMemo } from 'react';
import '../App.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export const Map = ({
  setIsMobileView,
  isMobileView,
  latlng,
}: {
  setIsMobileView: (isMobileView: boolean) => void;
  isMobileView: boolean;
  latlng: number[];
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
  });
  const center = useMemo(
    () => ({ lat: latlng[0] || 31.95, lng: latlng[1] || 35.93 }),
    [latlng]
  );

  if (!isLoaded) return <div>Loading....</div>;
  return (
    <>
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
      {isMobileView ? (
        <CloseIcon
          className="hamburger animated-icon"
          onClick={() => setIsMobileView(!isMobileView)}
        />
      ) : (
        <MenuIcon
          className="hamburger animated-icon"
          onClick={() => setIsMobileView(!isMobileView)}
        />
      )}
    </>
  );
};
