'use strict';

var RandManager = require('./Util/RandManager');
var Utils = require('./Util/Utils');
var ProgressHUD = require('./Components/ProgressHUD');
var Swiper = require('react-native-swiper');
var NetworkImage = require('react-native-image-progress');
var Progress = require('react-native-progress');
var ShakeEvent = require('react-native-shake-event-ios');

import React, {Component} from 'react';
import ReactNative, {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    PanResponder,
    CameraRoll,
    AlertIOS
} from 'react-native';

var {width, height} = ReactNative.Dimensions.get('window');

const NUM_WALLPAPERS = 5;
const DOUBLE_TAP_DELAY = 300; // milliseconds
const DOUBLE_TAP_RADIUS = 20;

class SplashWalls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wallsJSON: [],
            isLoading: true,
            isHudVisible: false
        };

        this.imagePanResponder = [];

        this.currentWallIndex = 0;

        this.prevTouchInfo = {
            prevTouchX: 0,
            prevTouchY: 0,
            prevTouchTimeStamp: 0
        };

        this.handlePanResponderGrant = this.handlePanResponderGrant.bind(this);
        this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
    }

    initialize(){
        this.setState({
            wallsJSON: [],
            isLoading: true,
            isHudVisible: false
        });

        this.currentWallIndex = 0;
    }

    componentWillMount() {
        this.imagePanResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
            onPanResponderGrant: this.handlePanResponderGrant,
            onPanResponderRelease: this.handlePanResponderEnd,
            onPanResponderTerminate: this.handlePanResponderEnd
        });

        ShakeEvent.addEventListener('shake', ()=>{
            this.initialize();
            this.fetchWallsJSON();
        });
    }

    componentDidMount() {
        this.fetchWallsJSON();
    }

    handleStartShouldSetPanResponder() {
        return true;
    }

    handlePanResponderGrant(e, gestureState) {
        console.log("finger added to the image");
        var currentTouchTimeStamp = Date.now();

        if (this.isDoubleTap(currentTouchTimeStamp, gestureState)) {
            this.saveCurrentWallpaperToCameraRoll();
        }

        this.prevTouchInfo = {
            prevTouchX: gestureState.x0,
            prevTouchY: gestureState.y0,
            prevTouchTimeStamp: currentTouchTimeStamp
        }

    }

    handlePanResponderEnd() {
        console.log("finger pulled from the image");
    }

    isDoubleTap(currentTouchTimeStamp, {x0, y0}) {
        var {prevTouchX, prevTouchY, prevTouchTimeStamp} = this.prevTouchInfo;
        var dt = currentTouchTimeStamp - prevTouchTimeStamp;

        return (dt < DOUBLE_TAP_DELAY && Utils.distance(prevTouchX, prevTouchY, x0, y0) < DOUBLE_TAP_RADIUS);
    }

    saveCurrentWallpaperToCameraRoll() {
        // Make Progress HUD visible
        this.setState({isHudVisible: true});

        var {wallsJSON} = this.state;
        var currentWall = wallsJSON[this.currentWallIndex];
        var currentWallURL = `https://unsplash.it/${currentWall.width}/${currentWall.height}?image=${currentWall.id}`;

        CameraRoll.saveToCameraRoll(currentWallURL, 'photo').then(
            (response)=> {
                // Make Progress HUD visible
                this.setState({isHudVisible: false});

                AlertIOS.alert(
                    'Saved',
                    'Wallpaper successfully save to Camera Roll',
                    [
                        {
                            text: "High 5!", onPress: ()=> {
                            console.log("Ok Pressed");
                        }
                        }
                    ]
                );
            },
            (response)=> {
                // Make Progress HUD visible
                this.setState({isHudVisible: false});

                console.log("Error Saving to Camera Roll");
            }
        );
    }

    onMomentumScrollEnd(e, state, context) {
        this.currentWallIndex = state.index;
    }

    fetchWallsJSON() {
        var url = "https://unsplash.it/list";
        fetch(url)
            .then((response) => response.json())
            .then((jsonData)=> {
                var randomIds = RandManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
                var walls = [];

                randomIds.forEach((randomId) => {
                    walls.push(jsonData[randomId]);
                });

                this.setState({
                    isLoading: false,
                    wallsJSON: [].concat(walls)
                });
            })
            .catch((error) => {
                console.log('Fetch Error' + error);
            });
    }

    renderLoadingMessage() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    animating={true}
                    color={'#fff'}
                    size={'small'}
                    style={{margin: 15}}/>
                <Text style={{color: '#fff'}}>Contacting Unsplash</Text>
            </View>
        );
    }

    renderResults() {
        var {wallsJSON, isLoading, isHudVisible} = this.state;
        if (!isLoading) {
            return (
                <View style={styles.container}>
                    <Swiper
                        dot={<View style={{backgroundColor: 'rgba(255, 255, 255, .4)', width: 8, height: 8, borderRadius: 10, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}}/>}
                        activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}}/>}
                        onMomentumScrollEnd={this.onMomentumScrollEnd}
                        loop={false}
                        index={this.currentWallIndex}>

                        {wallsJSON.map((wallPaper, index) => {
                            return (
                                <View key={index}>
                                    <NetworkImage
                                        source={{uri: `https://unsplash.it/${wallPaper.width}/${wallPaper.height}?image=${wallPaper.id}`}}
                                        indicator={Progress.Circle}
                                        style={styles.wallpaperImage}
                                        indicatorProps={{
                                            color: 'rgba(255, 255, 255)',
                                            size: 60,
                                            thickness: 7
                                        }}
                                        {...this.imagePanResponder.panHandlers}
                                    />
                                    <Text style={styles.label}>Photo by</Text>
                                    <Text style={styles.label_authorname}>{wallPaper.author}</Text>
                                </View>
                            );
                        })}

                    </Swiper>
                    <ProgressHUD width={width} height={height} isVisible={isHudVisible}/>
                </View>
            );
        }
    }

    render() {
        var {isLoading} = this.state;
        if (isLoading) {
            return this.renderLoadingMessage();
        }
        else {
            return this.renderResults();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    wallpaperImage: {
        width: width,
        height: height,
        backgroundColor: '#000'
    },
    label: {
        position: 'absolute',
        color: '#fff',
        fontSize: 13,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 2,
        paddingLeft: 5,
        top: 20,
        left: 20,
        width: width / 2
    },
    label_authorname: {
        position: 'absolute',
        color: '#fff',
        fontSize: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 2,
        paddingLeft: 5,
        top: 41,
        left: 20,
        fontWeight: 'bold',
        width: width / 2
    }
});

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
