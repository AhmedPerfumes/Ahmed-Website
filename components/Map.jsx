// pages/checkout.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const Map =  React.memo(({setLocation}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [searchLocation, setSearchLocation] = useState(null);
const [currentLocation, setCurrentLocation] = useState(null);

  const mapContainerStyle = { width: '100%', height: '300px' };

  // Function to fetch the current location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current location:', { lat: latitude, lng: longitude });
          setLocation({ lat: latitude, lng: longitude });
          setCurrentLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (err) => {
          setError('Unable to retrieve your location.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, [setLocation]);

  // Handle map click to choose a different location
  const handleMapClick = (e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setCurrentLocation(newLocation);
    setLocation(newLocation);
  };

  // Handle when the marker is dragged
  const handleMarkerDragEnd = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    console.log('Marker dragged:', newLocation);
    setCurrentLocation(newLocation);
    setLocation(newLocation); // Pass the updated location to the parent component
  };

  // Handle search location from autocomplete
//   const handleSearchChange = (e) => {
//     const newLocation = e.latLng ? { lat: e.latLng.lat(), lng: e.latLng.lng() } : e;
//     setSearchLocation(newLocation);
//     setLocation(newLocation);
//   };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const googleMapLibraries = ['places'];
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={googleMapLibraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentLocation}
          zoom={15}
          onClick={handleMapClick} // Allow user to click and choose a new location
        >
          <Marker position={currentLocation}  draggable={true} onDragEnd={handleMarkerDragEnd} />

          {/* Add Autocomplete Search for locations */}
          <Autocomplete
            onLoad={(autocomplete) => {
              autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                  const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  };
                  console.log(newLocation);
                  setCurrentLocation(newLocation);
                  setLocation(newLocation);
                } else {
                  setError('No details available for the selected place.');
                }
              });
            }}
          >
            <input
              type="text"
              placeholder="Search for a location"
              style={{
                width: '100%',
                padding: '10px',
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </Autocomplete>
        </GoogleMap>
      </LoadScript>
    </div>
  );
});

export default Map;
