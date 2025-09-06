export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

class LocationService {
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;
  private callbacks: Array<(location: LocationData) => void> = [];
  private errorCallbacks: Array<(error: LocationError) => void> = [];

  async requestPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      return false;
    }

    try {
      // Try to get current position to trigger permission request
      const position = await this.getCurrentPosition();
      return !!position;
    } catch (error) {
      console.warn('Location permission denied or error:', error);
      return false;
    }
  }

  async getCurrentPosition(options?: PositionOptions): Promise<LocationData | null> {
    if (!navigator.geolocation) {
      return null;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          this.currentLocation = locationData;
          this.notifyCallbacks(locationData);
          resolve(locationData);
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: error.message
          };
          this.notifyErrorCallbacks(locationError);
          reject(locationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
          ...options
        }
      );
    });
  }

  startWatching(callback: (location: LocationData) => void, errorCallback?: (error: LocationError) => void): number | null {
    if (!navigator.geolocation) {
      return null;
    }

    this.callbacks.push(callback);
    if (errorCallback) {
      this.errorCallbacks.push(errorCallback);
    }

    if (!this.watchId) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          this.currentLocation = locationData;
          this.notifyCallbacks(locationData);
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: error.message
          };
          this.notifyErrorCallbacks(locationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }

    return this.watchId;
  }

  stopWatching(callback?: (location: LocationData) => void): void {
    if (callback) {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    } else {
      this.callbacks = [];
    }

    if (this.callbacks.length === 0 && this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  getLastKnownLocation(): LocationData | null {
    return this.currentLocation;
  }

  private notifyCallbacks(location: LocationData): void {
    this.callbacks.forEach(callback => {
      try {
        callback(location);
      } catch (error) {
        console.error('Error in location callback:', error);
      }
    });
  }

  private notifyErrorCallbacks(error: LocationError): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        console.error('Error in location error callback:', err);
      }
    });
  }

  // Utility method to calculate distance between two points
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Check if user is near Ujjain (within 50km radius)
  isNearUjjain(latitude: number, longitude: number): boolean {
    const ujjainLat = 23.1815;
    const ujjainLng = 75.7682;
    const distance = this.calculateDistance(latitude, longitude, ujjainLat, ujjainLng);
    return distance <= 50; // Within 50km of Ujjain
  }
}

export const locationService = new LocationService();