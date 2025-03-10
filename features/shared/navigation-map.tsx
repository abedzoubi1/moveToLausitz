"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { getClosestParking } from "./api/get_closest_paking";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import "leaflet.awesome-markers";

interface MapComponentProps {
  userLocation?: [number, number];
  attractionLocation?: [number, number];
  onRouteFound?: (route: {
    driving: { distance: number; time: number };
    walking: { distance: number; time: number };
  }) => void;
}

const MapComponent = ({
  userLocation,
  attractionLocation,
  onRouteFound,
}: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) {
        mapRef.current = L.map("map", {
          center: userLocation || attractionLocation || [51.505, -0.09],
          zoom: 13,
          zoomControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        L.control
          .zoom({
            position: "bottomright",
          })
          .addTo(mapRef.current);

        //remove defult marker png

        // Helper to validate coordinates.
        const isValidCoord = (coord?: [number, number]) =>
          coord && typeof coord[0] === "number" && typeof coord[1] === "number";

        // Create AwesomeMarkers icons.
        const userIcon = L.AwesomeMarkers.icon({
          icon: "home",
          markerColor: "blue",
          prefix: "fa",
        });
        const parkingIcon = L.AwesomeMarkers.icon({
          icon: "car",
          markerColor: "green",
          prefix: "fa",
        });
        const attractionIcon = L.AwesomeMarkers.icon({
          icon: "flag",
          markerColor: "red",
          prefix: "fa",
        });

        // Add marker for user location if valid.
        if (isValidCoord(userLocation)) {
          L.marker(userLocation!, { icon: userIcon, zIndexOffset: 1000 })
            .addTo(mapRef.current)
            .bindPopup("Your Home");
        }

        // Add marker for attraction if valid.
        if (isValidCoord(attractionLocation)) {
          L.marker(attractionLocation!, {
            icon: attractionIcon,
            zIndexOffset: 1000,
          })
            .addTo(mapRef.current)
            .bindPopup("Attraction");
        }

        // Get the closest parking location to the attraction.
        let parkingLocation: [number, number] = [0, 0];
        let skipParking = true;
        if (isValidCoord(attractionLocation)) {
          const parkings = await getClosestParking(
            attractionLocation![0],
            attractionLocation![1]
          );

          let free;
          if (parkings.length > 0) {
            free =
              parkings[0].free_spots !== 0
                ? parkings[0]
                : parkings[1]?.free_spots !== 0
                  ? parkings[1]
                  : parkings[2];
            if (free) {
              //get the parking location
              parkingLocation = [free.latitude!, free.longitude!];
              // check if the walking distance is more than 1km
              const walkingDistanceMeters = L.latLng(
                parkingLocation[0],
                parkingLocation[1]
              ).distanceTo(
                L.latLng(attractionLocation![0], attractionLocation![1])
              );
              if (walkingDistanceMeters < 1000) {
                // Add marker for parking.
                skipParking = false;
                L.marker(parkingLocation, {
                  icon: parkingIcon,
                  zIndexOffset: 1000,
                })
                  .addTo(mapRef.current)
                  .bindPopup("Parking Spot");
              }
            }
          }
        }

        // Route calculation and callbacks.
        let drivingSummary: { distance: number; time: number } | null = null;
        let walkingSummary: { distance: number; time: number } | null = null;

        const maybeCallOnRouteFound = () => {
          if (drivingSummary && walkingSummary && onRouteFound) {
            onRouteFound({ driving: drivingSummary, walking: walkingSummary });
          }
        };

        //check if the route should be to the parking or not
        if (
          skipParking &&
          isValidCoord(userLocation) &&
          isValidCoord(attractionLocation)
        ) {
          // Driving leg: from userLocation to parkingLocation.
          if (
            isValidCoord(userLocation) &&
            parkingLocation[0] !== 0 &&
            parkingLocation[1] !== 0
          ) {
            const drivingControl = L.Routing.control({
              waypoints: [
                L.latLng(userLocation![0], userLocation![1]),
                L.latLng(attractionLocation![0], attractionLocation![1]),
              ],
              router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1",
                profile: "car",
              }),
              lineOptions: {
                styles: [{ color: "blue", weight: 4 }],
                extendToWaypoints: false,
                missingRouteTolerance: 0,
              },
              addWaypoints: false,
              fitSelectedRoutes: true,
            }).addTo(mapRef.current);

            drivingControl.on("routesfound", (e) => {
              if (e.routes && e.routes.length > 0) {
                const summary = e.routes[0].summary;
                drivingSummary = {
                  distance: (summary.totalDistance || summary.distance) / 1000, // km
                  time: summary.totalTime
                    ? Math.round(summary.totalTime / 60)
                    : Math.round(summary.time / 60), // minutes
                };
                walkingSummary = { distance: -1, time: 0 };
                maybeCallOnRouteFound();
              }
            });
          }
        } else {
          // Driving leg: from userLocation to parkingLocation.
          if (
            isValidCoord(userLocation) &&
            parkingLocation[0] !== 0 &&
            parkingLocation[1] !== 0
          ) {
            const drivingControl = L.Routing.control({
              waypoints: [
                L.latLng(userLocation![0], userLocation![1]),
                L.latLng(parkingLocation![0], parkingLocation![1]),
              ],
              router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1",
                profile: "car",
              }),
              lineOptions: {
                styles: [{ color: "blue", weight: 4 }],
                extendToWaypoints: false,
                missingRouteTolerance: 0,
              },
              addWaypoints: false,
              fitSelectedRoutes: true,
            }).addTo(mapRef.current);

            drivingControl.on("routesfound", (e) => {
              if (e.routes && e.routes.length > 0) {
                const summary = e.routes[0].summary;
                drivingSummary = {
                  distance: (summary.totalDistance || summary.distance) / 1000, // km
                  time: summary.totalTime
                    ? Math.round(summary.totalTime / 60)
                    : Math.round(summary.time / 60), // minutes
                };
                maybeCallOnRouteFound();
              }
            });
          }
          // Walking leg: from parkingLocation to attractionLocation.
          if (
            parkingLocation[0] !== 0 &&
            parkingLocation[1] !== 0 &&
            isValidCoord(attractionLocation)
          ) {
            const walkingControl = L.Routing.control({
              waypoints: [
                L.latLng(parkingLocation[0], parkingLocation[1]),
                L.latLng(attractionLocation![0], attractionLocation![1]),
              ],
              router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1",
                profile: "foot",
              }),
              lineOptions: {
                styles: [{ color: "green", weight: 4, dashArray: "5, 10" }],
                extendToWaypoints: false,
                missingRouteTolerance: 0,
              },
              addWaypoints: false,
              fitSelectedRoutes: true,
            }).addTo(mapRef.current);

            walkingControl.on("routesfound", (e: { routes: any[] }) => {
              if (e.routes && e.routes.length > 0) {
                const summary = e.routes[0].summary;
                walkingSummary = {
                  distance: (summary.totalDistance || summary.distance) / 1000, // km
                  time: summary.totalTime
                    ? Math.round(summary.totalTime / 60)
                    : Math.round(summary.time / 60), // minutes
                };
                maybeCallOnRouteFound();
              }
            });
          }
        }
      }
    };

    initializeMap();
  }, [userLocation, attractionLocation, onRouteFound]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.awesome-markers/2.0.4/leaflet.awesome-markers.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div id="map" style={{ height: "100%", width: "100%" }} />
    </>
  );
};

export default MapComponent;
