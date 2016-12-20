'use strict';

import React, {Component} from 'react';
import ReactNative, {
    View,
    Text,
    StyleSheet
} from 'react-native';

class Meatball extends Component {

    constructor(props) {
        super(props);

        this.state = {
            style: styles.meatballInactive
        }
    }

    componentWillMount(){
        if(this.props.index === 0){
            this.setState({
                style: styles.meatballActive
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.index === nextProps.index) && (this.props.index !== nextProps.selectedMeatball)) {
            this.setState({
                style: styles.meatballInactive
            });
        }
        else{
            this.setState({
                style: styles.meatballActive
            });
        }

        console.log("meatball change");
    }

    render() {
        return (
            <View style={this.state.style}></View>
        );
    }
}

const styles = StyleSheet.create({
    meatballInactive: {
        backgroundColor: 'rgba(0, 0, 0, .4)',
        width: 8,
        height: 8,
        borderRadius: 10,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    meatballActive: {
        backgroundColor: '#fff',
        width: 13,
        height: 13,
        borderRadius: 7,
        marginLeft: 7,
        marginRight: 7
    }
});

module.exports = Meatball;