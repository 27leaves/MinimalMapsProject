import React from 'react';
import MapView from 'react-native-maps';
import {StyleSheet, Dimensions, PermissionsAndroid, View} from 'react-native';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default class ShopMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialUserLocation: null,
      region: null,
    };
  }

  async componentDidMount() {
    const position = null;

    // this.setState({
    //   initialized: true,
    //   initialUserLocation: position,
    // });
    this._getLocationAsync();
  }

  onRegionChange(region) {
    this.setState({region});
  }

  async _getLocationAsync() {
    console.log('_getLocationAsync');
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('status', status);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({hasLocationPermissions: true});
    }
    // let location = await Location.getCurrentPositionAsync({});
    // this.setState({locationResult: JSON.stringify(location)});

    // // Center the map on the location we just fetched.
    // this.setState({
    //   mapRegion: {
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    //     latitudeDelta: 0.0922,
    //     longitudeDelta: 0.0421,
    //   },
    // });
  }

  render() {
    if (this.state.hasLocationPermissions) {
      return (
        <MapView
          region={this.state.region}
          onRegionChange={({region}) => this.onRegionChange(region)}
          style={styles.map}
          showsUserLocation={true}
          onMapReady={() => {}}
        />
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  map: {
    width: viewportWidth,
    height: viewportHeight,
  },
});
