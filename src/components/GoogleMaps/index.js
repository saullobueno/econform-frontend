import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

export const GoogleMapComponent = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=NAO_DISPONIVEL&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap defaultZoom={4} defaultCenter={{ lat: -15.826691, lng: -47.92182039999999 }}>
    {props.isMarkerShown &&
      props.markers.map((marker, i) => <Marker key={i} position={{ lat: marker.lat, lng: marker.lng }} />)}
  </GoogleMap>
));
