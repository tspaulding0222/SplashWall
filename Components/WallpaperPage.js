'use strict';

var NetworkImage = require('react-native-image-progress');
var Progress = require('react-native-progress');
var Shared = require('../Util/Shared');
var RNFetchBlob = require("react-native-fetch-blob").default;

import React, {Component} from 'react';
import ReactNative, {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Alert
} from 'react-native'

const dirs = RNFetchBlob.fs.dirs;

var {width, height} = ReactNative.Dimensions.get('window');

class WallpaperPage extends Component {
    constructor(props) {
        super(props);

        this.imagePanResponder = [];

        this.prevTouchInfo = {
            prevTouchX: 0,
            prevTouchY: 0,
            prevTouchTimeStamp: 0
        };

        this.handlePanResponderGrent = this.handlePanResponderGrent.bind(this);
    }

    componentWillMount(){
        this.imagePanResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
            onPanResponderGrant: this.handlePanResponderGrent,
            onPanResponderRelease: this.handlePanResponderEnd,
            onPanResponderTerminate: this.handlePanResponderEnd,
            onShouldBlockNativeResponder: (e, gestureState)=>{
                return false;
            }
        });
    }

    handleStartShouldSetPanResponder(){
        return true;
    }

    handlePanResponderGrent(e, gestureState){
        var currentTouchTimeStamp = Date.now();

        if(Shared.isDoubleTap(currentTouchTimeStamp, gestureState, this.prevTouchInfo)){
            this.saveCurrentWallpaper();
        }

        this.prevTouchInfo = {
            prevTouchX: gestureState.x0,
            prevTouchY: gestureState.y0,
            prevTouchTimeStamp: currentTouchTimeStamp
        };
    }

    handlePanResponderEnd(){
        console.log("Finger Pulled from image");
    }

    saveCurrentWallpaper(){
        var {hideHudFunc, showHudFunc} = this.props;

        showHudFunc();

        var {wallpaper} = this.props;
        var currentWallUrl = `https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`;

        RNFetchBlob.config({
            fileCache:true,
            appendExt: 'jpeg',
            path : dirs.DownloadDir + "/unsplashImage.jpeg"
        }).fetch('GET', currentWallUrl).then((res)=>{
            console.log("The file saved to, " + res.path());
            hideHudFunc();

            Alert.alert(
                'Image Saved To:',
                res.path(),
                [
                    {text: 'High Five', onPress: () => console.log('OK Pressed')},
                ]
            );

        }).catch((err)=>{
           console.log("Error " + err);
        });
    }

    render() {
        var {wallpaper} = this.props;
        return (
            <View>
                <NetworkImage
                    source={{uri: `https://unsplash.it/${width}/${height}?image=${wallpaper.id}`}}
                    indicator={Progress.Circle}
                    style={styles.wallpaperImage}
                    indicatorProps={{
                        color: 'rgba(255, 255, 255)',
                        size: 60,
                        thickness: 7
                    }}
                    {...this.imagePanResponder.panHandlers}/>
                <Text style={styles.label}>Photo by</Text>
                <Text style={styles.label_authorname}>{wallpaper.author}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        position: 'absolute',
        color: '#fff',
        fontSize: 13,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 5,
        paddingTop: 2,
        paddingBottom: 2,
        top: 20,
        left: 20,
        width: width / 2
    },
    label_authorname: {
        position: 'absolute',
        color: '#fff',
        fontSize: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 5,
        paddingTop: 2,
        paddingBottom: 2,
        top: 43,
        left: 20,
        fontWeight: 'bold',
        width: width / 2
    },
    wallpaperImage: {
        width: width,
        height: height,
        backgroundColor: '#000'
    },
});

module.exports = WallpaperPage;