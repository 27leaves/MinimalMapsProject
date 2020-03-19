import Geolocation from 'react-native-geolocation-service';
// import GoodbagSettings from '../services/storage/GoodbagSettings';

let listener = null;

let attachedListeners = [];

const onLocationStatusChange = () => {
  LocationHelper.update();
};

const handleNewGpsPosition = location => {
  //console.log('[LocationHelper] new position received, notifying listeners: '+ attachedListeners);
  attachedListeners.forEach(fn =>
    console.log(
      '[LocationHelper] new position received, notifying listener: ' + fn.name,
    ),
  );

//   GoodbagSettings.setLastPosition(location);
  attachedListeners.forEach(fn => fn(location));
};

/**
 * Allows other classes to query the user's location.
 * The methods in this class don't trigger any user interaction.
 * For example, if position listeners are added, they will only trigger if location is allowed and enabled already.
 */
class _LocationHelper {
  constructor() {
    LocationStatusHelper.addChangeListener(onLocationStatusChange);
  }

  /**
   * Starts listening for position updates if possible and if at least one listener is registered.
   */
  update() {
    //console.log("[LocationHelper] update");
    //console.log("[LocationHelper] update: attachedListeners.length: " + attachedListeners.length);
    //console.log("[LocationHelper] update: listener " + listener);
    // console.log("[LocationHelper] LocationStatusHelper.isPermissionOk() " + LocationStatusHelper.isPermissionOk());
    // console.log("[LocationHelper] LocationStatusHelper.isEnabled() " + LocationStatusHelper.isEnabled());

    if (listener === null) {
      // console.log("[LocationHelper] listener === null");

      if (
        LocationStatusHelper.isPermissionOk() &&
        LocationStatusHelper.isEnabled() &&
        attachedListeners.length > 0
      ) {
        // console.log("[LocationHelper] update starting new watchPosition ");
        listener = Geolocation.watchPosition(
          location => {
            handleNewGpsPosition(location.coords);
          },
          error => {
            console.log('[LocationHelper] error when watching gps:');
            console.log(error);
          },
          {
            // see https://github.com/Agontuk/react-native-geolocation-service#watchpositionsuccesscallback-errorcallback-options
            enableHighAccuracy: true, // high accuracy, i.e. use GPS instead in addition to cellular network and WIFI
            distanceFilter: 0,
          },
        );
      }
    } else {
      // console.log("[LocationHelper] listener != null");

      // console.log("[LocationHelper] attachedListeners.length " + attachedListeners.length);

      if (attachedListeners.length === 0) {
        console.log(
          '[LocationHelper] stopping the location watch, no listeners',
        );
        Geolocation.clearWatch(listener);
        listener = null;
      }
    }
  }

  async getBestEstimateInstant() {
    console.log('[LocationHelper] getBestEstimateInstant');

    return null;
  }

  addChangeListener(listener) {
    //   console.log("[LocationHelper] addChangeListener: "+listener.name);
    //   attachedListeners.forEach(fn => console.log("[LocationHelper] listeners before add: " + fn.name));
    attachedListeners.push(listener);
    //   attachedListeners.forEach(fn => console.log("[LocationHelper] listeners after add: " + fn.name));

    this.update();
  }

  removeChangeListener(listener) {
    //  console.log("[LocationHelper] removeChangeListener" + listener.name);
    //  attachedListeners.forEach(fn => console.log("[LocationHelper] listeners before remove: " + fn.name));

    //  console.log("[LocationHelper] attachedListeners before " + attachedListeners);
    attachedListeners = attachedListeners.filter(
      (val, idx, arr) => val !== listener,
    );
    //  console.log("[LocationHelper] attachedListeners after " + attachedListeners);
    // attachedListeners.forEach(fn => console.log("[LocationHelper] listeners after remove: " + fn.name));

    this.update();
  }
}

const LocationHelper = new _LocationHelper();
export default LocationHelper;
