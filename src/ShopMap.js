import React from 'react';
import MapView from 'react-native-maps';
import {StyleSheet, Dimensions, PermissionsAndroid, View} from 'react-native';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default class ShopMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialRegion: {
        latitude: 48.2167166,
        longitude: 16.397936,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      region: {
        latitude: 48.2167166,
        longitude: 16.397936,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      hasLocationPermissions: false,
    };
  }

  async componentDidMount() {
    this._getPermissions();
  }

  onRegionChange(region) {
    this.setState({region});
  }

  async _getPermissions() {
    console.log('_getLocationAsync');
    const status = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
    console.log('status', status);
    if (
      status['android.permission.ACCESS_COARSE_LOCATION'] !== 'granted' ||
      status['android.permission.ACCESS_FINE_LOCATION'] !== 'granted'
    ) {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({hasLocationPermissions: true});
    }
    // let location = await Location.getCurrentPositionAsync({});
    // this.setState({locationResult: JSON.stringify(location)});

    // // Center the map on the location we just fetched.
  }

  render() {
    // if (this.state.hasLocationPermissions) {
    return (
      <MapView
        initialRegion={this.state.initialRegion}
        region={this.state.region}
        onRegionChange={({region}) => this.onRegionChange(region)}
        style={styles.map}
        showsUserLocation={this.state.hasLocationPermissions}
        onUserLocationChange={location => {
          //   console.log('changed user location', location);
        }}
        onMapReady={() => {}}
      />
    );
    // } else {
    //   return <View />;
    // }
  }
}

const styles = StyleSheet.create({
  map: {
    width: viewportWidth,
    height: viewportHeight,
  },
});
