import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';

import ViewPropTypes from '../config/ViewPropTypes';
import fonts from '../config/fonts';
import colors from '../config/colors';
import renderIcon from '../helpers/renderIcon';

class Input extends Component {
  componentWillMount() {
    this.shake = this.shake.bind(this);
    this.shakeAnimationValue = new Animated.Value(0);
    this.props.shake && this.shake();
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  clear() {
    this.input.clear();
  }

  shake() {
    const { shakeAnimationValue } = this;

    shakeAnimationValue.setValue(0);
    // Animation duration based on Material Design
    // https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
    Animated.timing(shakeAnimationValue, {
      duration: 375,
      toValue: 3,
      ease: Easing.bounce,
    }).start();
  }

  _inputRef = input => (this.input = input);

  render() {
    const {
      containerStyle,
      inputContainerStyle,
      leftIcon,
      leftIconContainerStyle,
      rightIcon,
      rightIconContainerStyle,
      inputStyle,
      errorStyle,
      errorMessage,
      labelStyle,
      label,
      ...attributes
    } = this.props;
    const translateX = this.shakeAnimationValue.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
      outputRange: [0, -15, 0, 15, 0, -15, 0],
    });

    return (
      <View style={[{ width: '90%' }, containerStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <Animated.View
          style={[
            styles.inputContainer,
            inputContainerStyle,
            { transform: [{ translateX }] },
          ]}
        >
          {leftIcon &&
            renderIcon(leftIcon, {
              containerStyle: [
                styles.iconContainer,
                { marginLeft: 15 },
                leftIconContainerStyle,
              ],
            })}
          <TextInput
            {...attributes}
            ref={this._inputRef}
            underlineColorAndroid="transparent"
            style={[styles.input, inputStyle]}
          />
          {rightIcon &&
            renderIcon(rightIcon, {
              containerStyle: [styles.iconContainer, rightIconContainerStyle],
            })}
        </Animated.View>
        {errorMessage && (
          <Text style={[styles.error, errorStyle && errorStyle]}>
            {errorMessage}
          </Text>
        )}
      </View>
    );
  }
}

const elementOrObject = PropTypes.oneOfType([
  PropTypes.element,
  PropTypes.object,
]);
Input.propTypes = {
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,

  leftIcon: elementOrObject,
  leftIconContainerStyle: ViewPropTypes.style,

  rightIcon: elementOrObject,
  rightIconContainerStyle: ViewPropTypes.style,

  inputStyle: Text.propTypes.style,

  shake: PropTypes.any,
  errorStyle: Text.propTypes.style,
  errorMessage: PropTypes.string,

  label: PropTypes.string,
  labelStyle: Text.propTypes.style,
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.grey3,
    alignItems: 'center',
  },
  iconContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
    height: 40,
  },
  error: {
    color: '#FF2D00',
    margin: 5,
    fontSize: 12,
  },
  label: {
    color: colors.grey3,
    fontSize: 16,
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
      },
      android: {
        ...fonts.android.bold,
      },
    }),
  },
});

export default Input;
