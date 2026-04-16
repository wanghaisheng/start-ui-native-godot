import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  RTNGodotView,
  runOnGodotThread,
  RTNGodot,
} from '@borndotcom/react-native-godot';

/**
 * Godot 游戏页面
 * 展示如何集成 Godot 引擎到 React Native 应用中
 */
export default function GodotGameScreen() {
  // 初始化 Godot
  useEffect(() => {
    const initGodot = async () => {
      try {
        if (Platform.OS === 'ios') {
          // iOS 使用 --main-pack 参数
          await RTNGodot.init({
            '--main-pack': 'main.pck',
          });
          console.log('Godot initialized successfully on iOS');
        } else {
          // Android 使用 --path 参数
          await RTNGodot.init({
            '--path': '/main',
          });
          console.log('Godot initialized successfully on Android');
        }
      } catch (error) {
        console.error('Failed to initialize Godot:', error);
      }
    };

    initGodot();
  }, []);

  /**
   * 按下输入动作
   * 使用 worklet 在 Godot 专用线程上执行
   */
  const pressAction = (action: string) => {
    runOnGodotThread(() => {
      'worklet';
      const Godot = RTNGodot.API();
      const Input = Godot.Input;
      Input.action_press(action);
    });
  };

  /**
   * 释放输入动作
   * 使用 worklet 在 Godot 专用线程上执行
   */
  const releaseAction = (action: string) => {
    runOnGodotThread(() => {
      'worklet';
      const Godot = RTNGodot.API();
      const Input = Godot.Input;
      Input.action_release(action);
    });
  };

  return (
    <View style={styles.container}>
      {/* Godot 渲染视图 - 占据整个屏幕 */}
      <RTNGodotView style={styles.gameView} />

      {/* React Native UI 控制层 - 悬浮在 Godot 视图之上 */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => pressAction('ui_left')}
          onPressOut={() => releaseAction('ui_left')}
        >
          <Text style={styles.buttonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPressIn={() => pressAction('ui_accept')}
          onPressOut={() => releaseAction('ui_accept')}
        >
          <Text style={styles.buttonText}>跳</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPressIn={() => pressAction('ui_right')}
          onPressOut={() => releaseAction('ui_right')}
        >
          <Text style={styles.buttonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameView: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
