# 📱 Mobile Coder · 移动端工匠

> Code Agent 子技能 · React Native 移动应用代码生成
> 版本：v1.3
> 更新：2026-01-25
> **编码规范**：遵守 `coder-standards/STANDARDS.md`（全部规则适用）

---

## 一、基本信息

### 1.1 角色定位

```
┌─────────────────────────────────────────────────────────────────┐
│  📱 Mobile Coder = 移动端工匠                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【职责】创建 React Native 移动应用代码                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  「原生体验 —— 推送通知、相机、GPS、生物识别、离线存储」 │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【产出路径】/packages/mobile/                                  │
│  【框架】React Native（Expo 或 CLI）                            │
│  【语言】TypeScript                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

```yaml
tech_stack:
  framework: "React Native ^0.73.0"
  tooling: "Expo SDK 50 或 React Native CLI"
  language: "TypeScript ^5.3.0"
  navigation: "React Navigation ^6.0.0"
  state: "共享 hooks（@{project}/shared）"
  
  核心依赖:
    - "react-native"
    - "react"
    - "@react-navigation/native"
    - "@react-navigation/native-stack"
    - "react-native-safe-area-context"
    - "react-native-screens"
    
  可选依赖（按需）:
    - "expo-camera"              # 相机
    - "expo-location"            # 定位
    - "expo-notifications"       # 推送
    - "expo-secure-store"        # 安全存储
    - "@react-native-async-storage/async-storage"  # 本地存储
```

### 1.3 负责的模块类型

```yaml
module_types:

  mobile-components:
    中文名: "移动端组件"
    职责: "移动端专用 UI 组件"
    路径: "/packages/mobile/src/components/"
    示例:
      - "Button/"           # 按钮组件
      - "Input/"            # 输入框
      - "Card/"             # 卡片
      - "Header/"           # 页面头部
      - "TabBar/"           # 底部标签栏
    依赖: "@{project}/shared/hooks"
    说明: "使用 React Native 组件，非 HTML"
    
  mobile-screens:
    中文名: "移动端屏幕"
    职责: "移动端页面/屏幕"
    路径: "/packages/mobile/src/screens/"
    示例:
      - "HomeScreen/"
      - "LoginScreen/"
      - "ProfileScreen/"
    依赖: [mobile-components, "@{project}/shared"]
    说明: "React Navigation 中的 Screen"
    
  navigation:
    中文名: "导航配置"
    职责: "应用导航结构"
    路径: "/packages/mobile/src/navigation/"
    文件:
      - "index.tsx"              # 导航入口
      - "RootNavigator.tsx"      # 根导航器
      - "MainTabs.tsx"           # 主标签导航
      - "AuthStack.tsx"          # 认证流程导航
    依赖: [mobile-screens]
```

### 1.4 项目结构

```
/packages/mobile/
├── src/
│   ├── components/              # 组件
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Card/
│   │   └── index.ts
│   │
│   ├── screens/                 # 屏幕
│   │   ├── HomeScreen/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── index.ts
│   │   ├── LoginScreen/
│   │   ├── ProfileScreen/
│   │   └── index.ts
│   │
│   ├── navigation/              # 导航
│   │   ├── index.tsx
│   │   ├── RootNavigator.tsx
│   │   ├── MainTabs.tsx
│   │   ├── AuthStack.tsx
│   │   └── types.ts
│   │
│   ├── theme/                   # 主题
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   │
│   └── App.tsx                  # 应用入口
│
├── app.json                     # Expo 配置
├── package.json
├── tsconfig.json
├── babel.config.js
└── metro.config.js
```

---

## 二、接口定义

### 2.1 接口列表

| # | 接口 | 用途 |
|---|------|------|
| 1 | create_foundation | 创建 RN 项目基础结构 |
| 2 | create_mobile_component | 创建移动端组件 |
| 3 | create_screen | 创建屏幕 |
| 4 | setup_navigation | 设置导航 |
| 5 | create_navigator | 创建导航器 |
| 6 | setup_theme | 设置主题 |
| 7 | setup_native_module | 设置原生模块（相机、定位等） |
| 8 | verify_module | 验证模块 |

### 2.2 接口详情

#### 接口 1: create_foundation

```yaml
interface: create_foundation
description: "创建 React Native 项目基础结构"
input:
  project_name: "项目名称"
  use_expo: "是否使用 Expo（推荐）"
  tech_spec: "技术规格"
output:
  created_files:
    - "/packages/mobile/package.json"
    - "/packages/mobile/tsconfig.json"
    - "/packages/mobile/app.json"
    - "/packages/mobile/App.tsx"
    - "/packages/mobile/src/navigation/index.tsx"
    - "/packages/mobile/src/navigation/types.ts"
    - "/packages/mobile/src/screens/index.ts"
    - "/packages/mobile/src/components/index.ts"
    - "/packages/mobile/src/theme/index.ts"
expo配置:
  app_json: |
    {
      "expo": {
        "name": "{项目名称}",
        "slug": "{project-slug}",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "splash": {
          "image": "./assets/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        },
        "ios": {
          "supportsTablet": true,
          "bundleIdentifier": "com.{company}.{project}"
        },
        "android": {
          "adaptiveIcon": {
            "foregroundImage": "./assets/adaptive-icon.png",
            "backgroundColor": "#ffffff"
          },
          "package": "com.{company}.{project}"
        }
      }
    }
验证:
  - "npm install 成功"
  - "npx tsc --noEmit 编译通过"
  - "npm run start 能启动 Expo"
```

#### 接口 2: create_mobile_component

```yaml
interface: create_mobile_component
description: "创建移动端组件"
input:
  name: "组件名称"
  props: "属性定义"
  has_styles: "是否有独立样式文件"
output:
  files:
    - "/packages/mobile/src/components/{Name}/{Name}.tsx"
    - "/packages/mobile/src/components/{Name}/{Name}.styles.ts"
    - "/packages/mobile/src/components/{Name}/index.ts"
component_template: |
  import { View, Text, TouchableOpacity } from 'react-native';
  import { styles } from './{Name}.styles';
  
  interface {Name}Props {
    // 属性定义
  }
  
  export function {Name}({ ...props }: {Name}Props) {
    return (
      <View style={styles.container}>
        {/* 组件内容 */}
      </View>
    );
  }
styles_template: |
  import { StyleSheet } from 'react-native';
  
  export const styles = StyleSheet.create({
    container: {
      // 样式定义
    },
  });
```

#### 接口 3: create_screen

```yaml
interface: create_screen
description: "创建屏幕页面"
input:
  name: "屏幕名称（如 Home, Profile）"
  navigator: "所属导航器"
  params: "路由参数定义"
output:
  files:
    - "/packages/mobile/src/screens/{Name}Screen/{Name}Screen.tsx"
    - "/packages/mobile/src/screens/{Name}Screen/{Name}Screen.styles.ts"
    - "/packages/mobile/src/screens/{Name}Screen/index.ts"
template: |
  import { View, Text } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { styles } from './{Name}Screen.styles';
  import type { {Navigator}ScreenProps } from '../../navigation/types';
  
  type Props = {Navigator}ScreenProps<'{Name}'>;
  
  export function {Name}Screen({ navigation, route }: Props) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* 屏幕内容 */}
        </View>
      </SafeAreaView>
    );
  }
规范:
  - "根组件使用 SafeAreaView"
  - "有完整的导航类型定义"
  - "使用 StyleSheet.create()"
```

#### 接口 4: setup_navigation

```yaml
interface: setup_navigation
description: "设置应用导航"
input:
  structure: "导航结构定义"
output:
  files:
    - "/packages/mobile/src/navigation/index.tsx"
    - "/packages/mobile/src/navigation/RootNavigator.tsx"
    - "/packages/mobile/src/navigation/types.ts"
```

#### 接口 5: create_navigator

```yaml
interface: create_navigator
description: "创建导航器"
input:
  name: "导航器名称（如 Main, Auth, Settings）"
  type: "导航器类型（stack/tab/drawer）"
  screens: "包含的屏幕列表"
output:
  file_path: "/packages/mobile/src/navigation/{Name}Navigator.tsx"
stack_template: |
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import { {Screen1}Screen } from '../screens/{Screen1}Screen';
  import { {Screen2}Screen } from '../screens/{Screen2}Screen';
  import type { {Name}StackParamList } from './types';
  
  const Stack = createNativeStackNavigator<{Name}StackParamList>();
  
  export function {Name}Navigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="{Screen1}" 
          component={{Screen1}Screen}
          options={{ title: '{屏幕标题}' }}
        />
        <Stack.Screen 
          name="{Screen2}" 
          component={{Screen2}Screen}
        />
      </Stack.Navigator>
    );
  }
tab_template: |
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import { Ionicons } from '@expo/vector-icons';
  import type { {Name}TabParamList } from './types';
  
  const Tab = createBottomTabNavigator<{Name}TabParamList>();
  
  export function {Name}TabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName!} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }
types_template: |
  // navigation/types.ts
  import type { NativeStackScreenProps } from '@react-navigation/native-stack';
  import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
  
  export type {Name}StackParamList = {
    {Screen1}: undefined;
    {Screen2}: { id: string };
  };
  
  export type {Name}StackScreenProps<T extends keyof {Name}StackParamList> = 
    NativeStackScreenProps<{Name}StackParamList, T>;
```

#### 接口 6: setup_theme

```yaml
interface: setup_theme
description: "设置应用主题"
input:
  colors: "颜色定义"
  typography: "字体定义"
  spacing: "间距定义"
output:
  files:
    - "/packages/mobile/src/theme/index.ts"
    - "/packages/mobile/src/theme/colors.ts"
    - "/packages/mobile/src/theme/typography.ts"
    - "/packages/mobile/src/theme/spacing.ts"
    - "/packages/mobile/src/theme/ThemeProvider.tsx"
colors_template: |
  export const colors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    
    background: '#FFFFFF',
    surface: '#F2F2F7',
    
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
      disabled: '#C7C7CC',
    },
    
    border: '#C6C6C8',
  } as const;
typography_template: |
  import { StyleSheet } from 'react-native';
  
  export const typography = StyleSheet.create({
    h1: {
      fontSize: 34,
      fontWeight: 'bold',
      lineHeight: 41,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 34,
    },
    body: {
      fontSize: 17,
      fontWeight: 'normal',
      lineHeight: 22,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    },
  });
spacing_template: |
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  } as const;
```

#### 接口 7: setup_native_module

```yaml
interface: setup_native_module
description: "设置原生模块（相机、定位、通知等）"
input:
  module_type: "模块类型"
  permissions: "需要的权限"
output:
  hook_file: "/packages/mobile/src/hooks/use{Module}.ts"
  或放在: "@{project}/shared/hooks/"
支持的模块:
  camera:
    expo包: "expo-camera"
    权限: 
      ios: "NSCameraUsageDescription"
      android: "CAMERA"
    hook示例: |
      import { useState, useEffect } from 'react';
      import { Camera, CameraType } from 'expo-camera';
      
      export function useCamera() {
        const [permission, requestPermission] = Camera.useCameraPermissions();
        const [type, setType] = useState(CameraType.back);
        
        const toggleCameraType = () => {
          setType(current => 
            current === CameraType.back ? CameraType.front : CameraType.back
          );
        };
        
        return {
          permission,
          requestPermission,
          type,
          toggleCameraType,
        };
      }
      
  location:
    expo包: "expo-location"
    权限:
      ios: "NSLocationWhenInUseUsageDescription"
      android: "ACCESS_FINE_LOCATION"
    hook示例: |
      import { useState, useEffect } from 'react';
      import * as Location from 'expo-location';
      
      export function useLocation() {
        const [location, setLocation] = useState<Location.LocationObject | null>(null);
        const [error, setError] = useState<string | null>(null);
        
        useEffect(() => {
          (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setError('位置权限被拒绝');
              return;
            }
            
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
          })();
        }, []);
        
        return { location, error };
      }
      
  notifications:
    expo包: "expo-notifications"
    hook示例: |
      import { useState, useEffect, useRef } from 'react';
      import * as Notifications from 'expo-notifications';
      
      export function useNotifications() {
        const [expoPushToken, setExpoPushToken] = useState<string>('');
        const notificationListener = useRef<any>();
        
        useEffect(() => {
          registerForPushNotificationsAsync().then(token => {
            if (token) setExpoPushToken(token);
          });
          
          notificationListener.current = Notifications.addNotificationReceivedListener(
            notification => {
              // 处理收到的通知
            }
          );
          
          return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
          };
        }, []);
        
        return { expoPushToken };
      }
```

#### 接口 8: verify_module

```yaml
interface: verify_module
description: "验证移动端模块符合规范"
input:
  module_path: "模块路径"
  module_type: "模块类型（component/screen/navigation）"
output:
  passed: boolean
  issues: "问题列表"
checks:
  组件检查:
    - name: "使用 RN 组件"
      check: "使用 View/Text/TouchableOpacity，不使用 HTML 标签"
    - name: "StyleSheet 样式"
      check: "使用 StyleSheet.create()，非内联样式"
    - name: "类型完整"
      check: "Props 有完整类型定义"
      
  屏幕检查:
    - name: "SafeAreaView"
      check: "根组件使用 SafeAreaView"
    - name: "导航类型"
      check: "有正确的导航类型定义"
    - name: "KeyboardAvoidingView"
      check: "有输入框的屏幕使用 KeyboardAvoidingView"
      
  导航检查:
    - name: "类型定义"
      check: "ParamList 类型完整"
    - name: "屏幕注册"
      check: "所有屏幕在导航器中注册"
      
  shared包检查:
    - name: "hooks 引用"
      check: "从 @{project}/shared/hooks 导入"
    - name: "services 引用"
      check: "从 @{project}/shared/services 导入"
      
验证命令:
  编译: "npx tsc --noEmit"
  启动: "npm run start"
  iOS: "npm run ios"
  Android: "npm run android"
```

---

## 三、代码模板

### 3.1 package.json

```json
{
  "name": "@{project}/mobile",
  "version": "1.0.0",
  "private": true,
  "main": "src/App.tsx",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@{project}/shared": "workspace:*",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/native-stack": "^6.0.0",
    "@react-navigation/bottom-tabs": "^6.0.0",
    "expo": "~50.0.0",
    "expo-status-bar": "~1.11.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-safe-area-context": "4.8.0",
    "react-native-screens": "~3.29.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.0",
    "typescript": "^5.3.0"
  }
}
```

### 3.2 App.tsx

```tsx
/**
 * 移动应用入口
 */

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigation';
import { ThemeProvider } from './theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

### 3.3 导航配置

#### navigation/types.ts

```typescript
/**
 * 导航类型定义
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// 根导航参数
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// 认证流程参数
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// 主标签参数
export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

// 屏幕 Props 类型
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
```

#### navigation/RootNavigator.tsx

```tsx
/**
 * 根导航器
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@{project}/shared/hooks';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // 或 SplashScreen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
```

#### navigation/MainTabs.tsx

```tsx
/**
 * 主标签导航
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: '首页',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: '设置',
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 简化图标（实际应使用图标库）
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>🏠</Text>
);
const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>👤</Text>
);
const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>⚙️</Text>
);
```

### 3.4 组件模板

#### components/Button/Button.tsx

```tsx
/**
 * 按钮组件
 */

import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { styles } from './Button.styles';

interface ButtonProps {
  /** 按钮文字 */
  title: string;
  /** 点击事件 */
  onPress: () => void;
  /** 变体 */
  variant?: 'primary' | 'secondary' | 'outline';
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 自定义容器样式 */
  style?: ViewStyle;
  /** 自定义文字样式 */
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#007AFF' : '#FFFFFF'} 
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
```

#### components/Button/Button.styles.ts

```typescript
/**
 * 按钮样式
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // 变体
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#5856D6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  
  // 尺寸
  small: {
    height: 32,
    paddingHorizontal: 12,
  },
  medium: {
    height: 44,
    paddingHorizontal: 16,
  },
  large: {
    height: 52,
    paddingHorizontal: 24,
  },
  
  // 禁用
  disabled: {
    opacity: 0.5,
  },
  
  // 文字
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#007AFF',
  },
  
  // 文字尺寸
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
```

### 3.5 屏幕模板

#### screens/HomeScreen/HomeScreen.tsx

```tsx
/**
 * 首页屏幕
 */

import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useAuth } from '@{project}/shared/hooks';
import { Button } from '../../components/Button';
import { styles } from './HomeScreen.styles';
import type { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // 刷新数据
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>
          欢迎，{user?.name || '用户'}
        </Text>
        
        <Text style={styles.subtitle}>
          这是首页内容
        </Text>
        
        <Button
          title="查看详情"
          onPress={() => {
            // 导航到详情页
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## 四、完整示例

### 4.1 Login 屏幕完整示例

#### screens/LoginScreen/LoginScreen.tsx

```tsx
/**
 * 登录屏幕
 */

import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@{project}/shared/hooks';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { styles } from './LoginScreen.styles';
import type { AuthStackScreenProps } from '../../navigation/types';

type Props = AuthStackScreenProps<'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('提示', '请输入邮箱和密码');
      return;
    }

    try {
      await login({ email, password });
      // 登录成功后导航由 RootNavigator 自动处理
    } catch (err) {
      Alert.alert('登录失败', error || '请检查邮箱和密码');
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>欢迎回来</Text>
          <Text style={styles.subtitle}>登录您的账户</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="邮箱"
            placeholder="请输入邮箱"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="密码"
            placeholder="请输入密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title={loading ? '登录中...' : '登录'}
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>还没有账户？</Text>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={styles.linkText}>立即注册</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

#### screens/LoginScreen/LoginScreen.styles.ts

```typescript
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    gap: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
```

### 4.2 Input 组件完整示例

#### components/Input/Input.tsx

```tsx
/**
 * 输入框组件
 */

import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { styles } from './Input.styles';

interface InputProps extends TextInputProps {
  /** 标签 */
  label?: string;
  /** 错误信息 */
  error?: string;
  /** 是否显示密码切换按钮 */
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  secureTextEntry,
  showPasswordToggle = true,
  style,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isPassword = secureTextEntry !== undefined;
  const shouldHideText = isPassword && !isPasswordVisible;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={shouldHideText}
          placeholderTextColor="#999999"
          {...props}
        />
        
        {isPassword && showPasswordToggle && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={togglePasswordVisibility}
          >
            <Text style={styles.toggleText}>
              {isPasswordVisible ? '隐藏' : '显示'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
```

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"
  
  执行顺序:
    1. create_foundation:
       - "创建 /packages/mobile/ 目录结构"
       - "创建 package.json（Expo 或 RN CLI）"
       - "创建 tsconfig.json"
       - "创建 app.json / app.config.ts（Expo）"
       
    2. 创建入口和导航:
       - "src/App.tsx（应用入口）"
       - "src/navigation/（导航配置）"
       - "src/navigation/types.ts（导航类型）"
       
    3. 创建组件和屏幕:
       - "src/components/（通用组件）"
       - "src/screens/（页面屏幕）"
       
    4. 主题配置:
       - "src/theme/（主题定义）"
       
  验证:
    - "npx tsc --noEmit 编译通过"
    - "npm run start 启动 Expo"
    - "iOS/Android 模拟器正常运行"
    - "导航跳转正常"
```

### 5.2 场景二：功能迭代

```yaml
scenario_iteration:
  触发: "project_type = 'iteration'"
  
  前置检查:
    0. 调用钦天监:
       action: "scan_project()"
       获取:
         - "现有目录结构"
         - "现有模块清单"
         - "现有依赖关系"
       证据: "钦天监扫描 ID"
       
    1. 扫描现有结构:
       - "基于钦天监结果检查 src/screens/"
       - "检查 src/components/ 现有组件"
       - "检查 src/navigation/ 导航结构"
       
    2. 冲突检测:
       - "新屏幕名是否与现有冲突"
       - "新组件名是否与现有冲突"
       - "新路由名是否与现有冲突"
       
  执行策略:
    新增屏幕:
      步骤:
        - "创建 src/screens/{NewScreen}/"
        - "在对应 Navigator 中添加 Screen"
        - "在 navigation/types.ts 中添加类型"
      注意:
        - "不修改现有屏幕代码"
        - "遵守现有命名规范"
        
    新增组件:
      步骤:
        - "创建 src/components/{NewComponent}/"
        - "在 components/index.ts 中导出"
      注意:
        - "使用 React Native 组件"
        - "使用 StyleSheet.create()"
        
    新增导航器:
      场景: "添加新的导航流程（如新的 Tab 或 Stack）"
      步骤:
        - "创建新的 Navigator 文件"
        - "在 RootNavigator 中集成"
        - "更新 navigation/types.ts"
      注意:
        - "不修改现有导航器结构"
        
    新增原生模块:
      场景: "添加相机、定位等原生功能"
      步骤:
        - "安装对应 Expo 模块"
        - "创建封装 Hook（如 useCamera）"
        - "或放在 @{project}/shared/hooks/"
      验证:
        - "iOS 模拟器测试"
        - "Android 模拟器测试"
        
  验证策略:
    1_编译验证:
      命令: "npx tsc --noEmit"
      
    2_启动验证:
      命令: "npm run start"
      检查: "Expo 正常启动"
      
    3_双平台验证:
      命令: "npm run ios && npm run android"
      检查: "两个平台都能正常运行"
      
    4_导航验证:
      方法: "测试新屏幕跳转"
      检查: "导航参数传递正确"
```

### 5.3 场景三：项目重塑

```yaml
scenario_refactor:
  触发: "project_type = 'refactor'"
  
  迁移策略:
    big_bang:
      适用: "Expo 到 RN CLI 迁移或反向"
      风险: "高"
      步骤:
        - "创建新项目"
        - "迁移业务代码"
        - "迁移原生配置"
        - "测试所有功能"
        
    incremental:
      适用: "逐模块改造"
      风险: "中"
      步骤:
        - "从最少依赖的屏幕开始"
        - "逐个迁移"
        - "每个完成后双平台测试"
        
    parallel:
      适用: "测试新架构"
      风险: "低"
      步骤:
        - "创建 /packages/mobile-v2/"
        - "在新项目中实验"
        - "验证后合并"
        
  批次执行:
    batch_1_navigation:
      迁移: "导航结构"
      文件:
        - "navigation/types.ts"
        - "navigation/RootNavigator.tsx"
      验证: "导航正常工作"
      
    batch_2_components:
      迁移: "通用组件"
      文件:
        - "components/"
      验证: "组件渲染正确"
      
    batch_3_screens:
      迁移: "屏幕页面"
      文件:
        - "screens/"
      验证: "页面功能正常"
      顺序: "按依赖关系从少到多"
      
    batch_4_native:
      迁移: "原生模块"
      文件:
        - "原生配置"
        - "权限配置"
      验证: "原生功能正常"
      注意: "需要重新安装 app"
      
  RN 升级注意:
    Expo:
      - "检查 SDK 版本兼容性"
      - "运行 expo upgrade"
      - "检查 Breaking Changes"
    RN CLI:
      - "使用 react-native upgrade-helper"
      - "逐个解决冲突"
      - "重新 pod install（iOS）"
      
  平台特定处理:
    iOS:
      - "更新 Podfile"
      - "运行 pod install"
      - "检查 Info.plist"
    Android:
      - "更新 gradle"
      - "检查 AndroidManifest.xml"
      - "检查 ProGuard 规则"
      
  回滚机制:
    - "每批次前 git commit"
    - "保留旧版本备份"
    - "iOS/Android 都测试后再继续"
```

---

## 六、铁律清单

```yaml
mobile_coder_laws:

  MC-01:
    name: "使用 React Native 组件"
    rule: "使用 View/Text/TouchableOpacity 等"
    禁止: "使用 div/span/button 等 HTML 标签"
    
  MC-02:
    name: "StyleSheet 定义样式"
    rule: "使用 StyleSheet.create() 定义样式"
    禁止: "内联样式（除非动态）"
    
  MC-03:
    name: "类型安全导航"
    rule: "导航必须有完整的类型定义"
    文件: "navigation/types.ts"
    
  MC-04:
    name: "复用 shared 包"
    rule: "hooks、services、types 必须从 @{project}/shared 导入"
    禁止: "在 mobile 包中重复实现"
    
  MC-05:
    name: "SafeAreaView"
    rule: "屏幕根组件使用 SafeAreaView"
    原因: "适配刘海屏、底部横条"
    
  MC-06:
    name: "平台特定代码"
    rule: "使用 Platform.OS 或 .ios.tsx/.android.tsx"
    禁止: "硬编码平台判断散落各处"
    
  MC-07:
    name: "异步存储"
    rule: "使用 AsyncStorage 或 SecureStore"
    禁止: "使用 localStorage（RN 不支持）"
```

---

## 七、验证清单

```yaml
verification_checklist:

  编译验证:
    命令: "npx tsc --noEmit"
    期望: "无 TypeScript 错误"
    证据: "编译输出"
    
  启动验证:
    命令: "npm run start"
    期望: "Expo 开发服务器正常启动"
    证据: "终端输出 QR 码"
    
  iOS 模拟器验证:
    命令: "npm run ios"
    期望: "iOS 模拟器正常运行应用"
    证据: "模拟器截图"
    
  Android 模拟器验证:
    命令: "npm run android"
    期望: "Android 模拟器正常运行应用"
    证据: "模拟器截图"
    
  导航验证:
    方法: "测试各屏幕跳转"
    期望: "导航正常，无类型错误"
    
  组件验证:
    方法: "检查组件渲染"
    期望: "无 warning，样式正确"
    
  shared 包验证:
    方法: "检查 hooks/services 调用"
    期望: "从 @{project}/shared 正确导入"
```

---

## 八、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.2 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.1 | 2026-01-22 | 补充完整示例和验证清单 |
| v1.0 | 2026-01-22 | 初始版本：React Native + Expo、导航配置、组件模板 |

---

**📱 Mobile Coder · 移动端工匠 · 文档完**
