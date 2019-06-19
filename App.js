import React from "react";
import { Animated, Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";
import * as path from "svg-path-properties";
import { scaleLinear, scaleTime, scaleQuantile } from "d3-scale";
import * as shape from "d3-shape";

const HEIGHT = 100;
const WIDTH = Dimensions.get("window").width;
const VERTICAL_PADDING = 5;
const CURSOR_RADIUS = 10;
const LABEL_WIDTH = 50;

const data = [
  { x: new Date(2019, 1, 5), y: 0 },
  { x: new Date(2019, 1, 16), y: 0 },
  { x: new Date(2019, 2, 23), y: 200 },
  { x: new Date(2019, 3, 30), y: 200 },
  { x: new Date(2019, 4, 1), y: 300 },
  { x: new Date(2019, 5, 25), y: 300 },
];

const scaleX = scaleTime()
  .domain([data[0].x, data[data.length - 1].x])
  .range([0, WIDTH]);

const scaleY = scaleLinear()
  .domain([data[0].y, data[data.length - 1].y])
  .range([HEIGHT - VERTICAL_PADDING, VERTICAL_PADDING]);

const scaleLabel = scaleQuantile()
  .domain([data[0].y, data[data.length - 1].y])
  .range([0, 200, 300]);

const line = shape
  .line()
  .x(d => scaleX(d.x))
  .y(d => scaleY(d.y))
  .curve(shape.curveBasis)(data);

const properties = path.svgPathProperties(line);

const lineLength = properties.getTotalLength();

export default class App extends React.Component {
  state = {
    x: new Animated.Value(0),
  };

  cursorRef = React.createRef();
  labelRef = React.createRef();

  componentDidMount() {
    this.state.x.addListener(({ value }) => this.moveCursor(value));
    this.moveCursor(0);
  }

  moveCursor(value) {
    const { x, y } = properties.getPointAtLength(lineLength - value);

    if (this.cursorRef.current) {
      this.cursorRef.current.setNativeProps({ top: y - CURSOR_RADIUS, left: x - CURSOR_RADIUS });
    }

    if (this.labelRef.current) {
      const label = scaleLabel(scaleY.invert(y));
      this.labelRef.current.setNativeProps({ text: `${label}` });
    }
  }

  render() {
    const { x } = this.state;

    const translateX = x.interpolate({
      inputRange: [0, lineLength],
      outputRange: [WIDTH - LABEL_WIDTH, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.container}>
        <Svg height={HEIGHT} width={WIDTH}>
          <Defs>
            <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
              <Stop stopColor="#cde3f8" offset="0%" />
              <Stop stopColor="#eef6fd" offset="80%" />
              <Stop stopColor="#feffff" offset="100%" />
            </LinearGradient>
          </Defs>
          <Path d={line} fill="transparent" stroke="#367be2" strokeWidth={5} />
          <Path d={`${line} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT}`} fill="url(#gradient)" />
          <View ref={this.cursorRef} style={styles.cursor}></View>
        </Svg>
        <Animated.View style={[styles.label, { transform: [{ translateX }] }]}>
          <TextInput ref={this.labelRef} style={styles.labelText} />
        </Animated.View>
        <Animated.ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={{ width: lineLength * 2 }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x },
                },
              },
            ],
            { useNativeDriver: true },
          )}
          horizontal
        />
        <Text style={styles.monthText}>September</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cursor: {
    width: CURSOR_RADIUS * 2,
    height: CURSOR_RADIUS * 2,
    borderRadius: CURSOR_RADIUS,
    borderColor: "#367be2",
    borderWidth: 3,
    backgroundColor: "white",
  },
  label: {
    position: "absolute",
    top: Dimensions.get("window").height / 2 - HEIGHT,
    left: 0,
    backgroundColor: "#fff",
    width: LABEL_WIDTH,
    alignItems: "center",
  },
  labelText: {
    color: "#367be2",
    fontWeight: "bold",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
});
