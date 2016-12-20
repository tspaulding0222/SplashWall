'use strict';

var SharedLib = require('./Util/Shared');
var RenderLoadingMessage = require('./Components/RenderLoadingMessage');
var RenderResults = require('./Components/RenderResults.android');
var RNShakeEvent = require('react-native-shake-event');

import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';

const NUM_WALLPAPERS = 5;

class SplashWalls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wallsJSON: [],
            isLoading: true
        };
    }



    componentDidMount() {
        var storeThis = this;

        SharedLib.fetchWallsJson(5).then((walls)=>{
            storeThis.setState({
                isLoading: false,
                wallsJSON: [].concat(walls)
            })
        });
    }

    render() {
        var {isLoading} = this.state;
        if (isLoading) {
            return (
                <RenderLoadingMessage/>
            );

        } else {
            return (
                <RenderResults wallsJSON={this.state.wallsJSON} isLoading={this.state.isLoading}/>
            );
        }
    }
}

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
