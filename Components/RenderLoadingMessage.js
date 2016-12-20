'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';

class RenderLoadingMessage extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
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
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
});

module.exports = RenderLoadingMessage;