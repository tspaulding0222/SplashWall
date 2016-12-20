'use strict';

var WallpaperPage = require('./WallpaperPage');
var Meatball = require('./Meatball');
var ProgressHUD = require('./ProgressHUD');

import React, {Component} from 'react';
import ReactNative, {
    StyleSheet,
    Text,
    View,
    ViewPagerAndroid
} from 'react-native';

var {width, height} = ReactNative.Dimensions.get('window');

class RenderResults extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedMeatball: 0,
            isHudVisible: false
        };

        this.onPageSelected = this.onPageSelected.bind(this);
    }

    onPageSelected(e){
        this.setState({
            selectedMeatball: e.nativeEvent.position
        });
    }

    makeHudVisible(){
        this.setState({
            isHudVisible: true
        });
    }

    removeHudVisibility(){
        this.setState({
            isHudVisible: false
        });
    }

    render() {
        var {wallsJSON, isLoading} = this.props;

        var meatballs = [];
        var pages = [];
        wallsJSON.map((wallpaper, index)=>{
            pages.push(
                <View style={{flex: 1}} key={index}>
                    <WallpaperPage
                        wallpaper={wallpaper} hideHudFunc={this.removeHudVisibility.bind(this)} showHudFunc={this.makeHudVisible.bind(this)}/>
                </View>
            );

            meatballs.push(
                <Meatball key={index} index={index} selectedMeatball={this.state.selectedMeatball}/>
            );
        });
        return (
            <View style={{flex: 1}}>
                <ViewPagerAndroid
                    style={{flex: 1}}
                    initialPage={this.state.selectedMeatball}
                    onPageSelected={this.onPageSelected}>
                    {pages}
                </ViewPagerAndroid>

                <View style={styles.meatballs}>
                    {meatballs}
                </View>

                <ProgressHUD width={width} height={height} isVisible={this.state.isHudVisible}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    meatballs:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        position: 'absolute',
        bottom: 20
    }
});

module.exports = RenderResults;