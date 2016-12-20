'use strict';

import React, {Component} from 'react';
import ReactNative, {
    StyleSheet,
    View,
    ViewPagerAndroid
} from 'react-native';

var {width} = ReactNative.Dimensions.get('window');

class ViewPager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMeatball: 0
        };
    }

    onPageSelected(e){
        this.setState({
            selectedMeatball: e.nativeEvent.position
        });
    }

    render() {
        var {pages} = this.props;

        var meatballs = [];
        pages.map((page, index)=>{

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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    meatballs: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        position: 'absolute',
        bottom: 20
    }
});

module.exports = ViewPager;
