"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
function TabNavigator({ initialRouteName, children, screenOptions, tabBarStyle, contentStyle }) {
    const { state, navigation, descriptors, NavigationContent } = (0, native_1.useNavigationBuilder)(native_1.TabRouter, {
        children,
        screenOptions,
        initialRouteName,
    });
    return (<NavigationContent>
      <react_native_1.View style={[{ flexDirection: 'row' }, tabBarStyle]}>
        {state.routes.map((route, index) => (<react_native_1.Pressable key={route.key} onPress={() => {
                const isFocused = state.index === index;
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                    navigation.dispatch({
                        ...native_1.TabActions.jumpTo(route.name, route.params),
                        target: state.key,
                    });
                }
            }} style={{ flex: 1 }}>
            <react_native_1.Text>{descriptors[route.key].options.title ?? route.name}</react_native_1.Text>
          </react_native_1.Pressable>))}
      </react_native_1.View>
      <react_native_1.View style={[{ flex: 1 }, contentStyle]}>
        {state.routes.map((route, i) => {
            return (<react_native_1.View key={route.key} style={[react_native_1.StyleSheet.absoluteFill, { display: i === state.index ? 'flex' : 'none' }]}>
              {descriptors[route.key].render()}
            </react_native_1.View>);
        })}
      </react_native_1.View>
    </NavigationContent>);
}
//# sourceMappingURL=Tabs.navigator.js.map