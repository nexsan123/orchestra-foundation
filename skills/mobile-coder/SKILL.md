---
name: mobile-coder
description: |
  移动端工匠（Mobile Coder）- Code Agent 子技能，生成 packages/mobile React Native 移动应用代码。
  核心职责：生成移动端页面、导航、原生模块集成等代码。
  服务 Code Agent Phase A/B。
  Use when (1) 生成 React Native 页面, (2) 生成移动端导航, (3) 生成原生模块集成代码, (4) Mobile Phase A 契约代码, (5) Mobile Phase B 实现代码。
---

# 📱 Mobile Coder · 移动端工匠

> Code Agent 子技能 · React Native 移动应用代码生成
> 版本：v2.1
> 更新：2026-02-01
> **编码规范**：遵守 `coder-standards/STANDARDS.md`（全部规则适用）

---

## 📌 目录

1. [一、基本信息](#一基本信息)
2. [二、接口定义](#二接口定义)
3. [三、代码模板](#三代码模板)
4. [四、完整示例](#四完整示例)
5. [五、场景适配指南](#五场景适配指南)
6. [六、铁律清单](#六铁律清单)
7. [七、验证清单](#七验证清单)
8. [八、部署验证规范](#八部署验证规范-)
9. [九、版本历史](#九版本历史)

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

### 1.5 激活与协作

```yaml
# ═══════════════════════════════════════════════════════════════════
# 激活条件
# ═══════════════════════════════════════════════════════════════════

activation:
  trigger: "platforms 包含 'mobile'"
  condition: "'mobile' in tech_spec.platforms"

  platforms_examples:
    "[mobile]": "激活（纯移动端，用外部 API）"
    "[backend, mobile]": "激活（移动应用 + 后端）"
    "[mobile, desktop]": "激活（移动 + 桌面）"
    "[web, mobile]": "激活（Web + 移动端）"
    "[backend, web, mobile, desktop]": "激活（全平台）"
    "[backend]": "不激活（纯后端 API）"
    "[web]": "不激活（纯 Web 端）"
    "[desktop]": "不激活（纯桌面端）"

# ═══════════════════════════════════════════════════════════════════
# 依赖与协作
# ═══════════════════════════════════════════════════════════════════

dependencies:
  upstream:
    - skill: "shared-coder"
      waits_for: "shared 契约层完成"
      imports: "types/, utils/, services/, hooks/"
      example: |
        import { useAuth } from '@project/shared/hooks';
        import { authService } from '@project/shared/services';
        import type { User } from '@project/shared/types';
      special: "storage.ts 自动检测 React Native 环境，使用 AsyncStorage"

      # ═══════════════════════════════════════════════════════════════════
      # 🆕 上游协作时序
      # ═══════════════════════════════════════════════════════════════════
      协作时序:
        检查点: "mobile-coder 激活前"
        检查命令: |
          ls packages/shared/types/index.ts
          ls packages/shared/hooks/index.ts
          ls packages/shared/services/index.ts
        检查内容:
          - "types/index.ts 存在且导出类型"
          - "hooks/index.ts 存在且导出 hooks"
          - "services/index.ts 存在且导出 services"
        成功条件: "所有检查通过"
        失败处理:
          等待: "shared-coder 完成"
          超时: "10分钟后报告阻塞"
          上报: "通知 Code Agent 协调"

      类型变更处理:
        场景: "shared-coder 在 mobile-coder 执行中变更类型"
        处理:
          1_检测: "编译时发现类型不匹配"
          2_暂停: "暂停当前工作"
          3_同步: "重新导入最新类型"
          4_适配: "修改屏幕/组件代码适配新类型"
          5_重新验证: |
            # 🆕 类型变更后必须重新验证
            npx tsc --noEmit  # 编译验证
            npm run test  # 单元测试验证
          6_继续: "验证通过后继续执行"
        验证失败处理: "修复适配代码，重复步骤 4-5，最多3次"
        禁止: "自行修改 shared/ 目录（契约层归 shared-coder 管）"

    - skill: "backend-coder"
      waits_for: "backend 契约层完成（如果有 backend）"
      uses: "API 路由定义"
      reason: "根据后端 API 构建屏幕"
      条件: "仅当 'backend' in platforms"

      协作时序:
        检查点: "调用 API 前"
        检查命令: "curl -s http://localhost:3000/health"
        检查内容: "后端健康检查返回 200"
        失败处理:
          等待: "backend-coder 完成并启动"
          Mock模式: "如后端未就绪，使用 MSW 或 json-server mock 数据"

  downstream: []  # UI Coder 无下游依赖

  parallel_with:
    - "web-coder"      # 可与 Web 端并行开发
    - "desktop-coder"  # 可与桌面端并行开发

execution_order:
  position: "第三层（shared + backend 之后）"
  phase_a: "在 shared-coder 和 backend-coder 契约锁定后执行"
  phase_b: "可与其他 UI Coders 完全并行"

# ═══════════════════════════════════════════════════════════════════
# 移动端特殊处理
# ═══════════════════════════════════════════════════════════════════

mobile_specifics:

  platform_detection:
    description: "shared/utils/storage.ts 自动检测移动端"
    logic: "navigator.product === 'ReactNative' → 使用 AsyncStorage"

  native_modules:
    description: "需要原生功能时使用 Expo 模块"
    modules:
      - "expo-camera"          # 相机
      - "expo-location"        # 定位
      - "expo-notifications"   # 推送通知
      - "expo-secure-store"    # 安全存储

  style_difference:
    vs_web: |
      - 使用 StyleSheet.create() 而非 CSS
      - 使用 View/Text/TouchableOpacity 而非 div/span/button
      - 使用 React Navigation 而非 React Router

# ═══════════════════════════════════════════════════════════════════
# 失败处理
# ═══════════════════════════════════════════════════════════════════

failure_handling:

  compilation_failure:
    symptom: "npx tsc --noEmit 返回错误"
    impact: "移动应用无法构建"
    action:
      - "分析编译错误信息"
      - "检查是否使用了 Web 专用 API"
      - "确保使用 React Native 组件"
    max_retry: 3

  native_module_failure:
    symptom: "原生模块无法加载"
    cause: "Expo 模块配置问题或权限未设置"
    action:
      - "检查 app.json 权限配置"
      - "确认模块已正确安装"
      - "运行 npx expo install 重新安装"

  navigation_failure:
    symptom: "导航无法正常工作"
    cause: "导航器配置错误"
    action:
      - "检查 RootNavigator 配置"
      - "确认所有 Screen 已正确注册"

  rollback:
    trigger: "与 shared 契约不兼容，需要重新对齐"
    action:
      - "git reset 到 mobile-coder 开始前"
      - "保留 shared-coder 和 backend-coder 的产出"
      - "分析不兼容原因后重试"
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
| 8 | create_test | 创建单元测试和集成测试 |
| 9 | verify_module | 验证模块 |

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

#### 接口 8: create_test

```yaml
interface: create_test
description: "创建单元测试和集成测试"
input:
  module_name: "模块名称"
  module_type: "模块类型（component/screen/hook）"
output:
  files:
    component: "/packages/mobile/__tests__/components/{Name}.test.tsx"
    screen: "/packages/mobile/__tests__/screens/{Name}Screen.test.tsx"
    hook: "/packages/mobile/__tests__/hooks/use{Name}.test.ts"

component_test_template: |
  /**
   * {Name} 组件测试
   */

  import React from 'react';
  import { render, fireEvent } from '@testing-library/react-native';
  import { {Name} } from '../../src/components/{Name}';

  describe('{Name}', () => {
    it('should render correctly', () => {
      const { getByText } = render(<{Name} />);
      expect(getByText('...')).toBeTruthy();
    });

    it('should handle press event', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(<{Name} onPress={onPress} />);

      fireEvent.press(getByTestId('{name}-button'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(<{Name} style={customStyle} />);

      const element = getByTestId('{name}-container');
      expect(element.props.style).toContain(customStyle);
    });
  });

screen_test_template: |
  /**
   * {Name}Screen 屏幕测试
   */

  import React from 'react';
  import { render, waitFor, fireEvent } from '@testing-library/react-native';
  import { NavigationContainer } from '@react-navigation/native';
  import { {Name}Screen } from '../../src/screens/{Name}Screen';

  // Mock navigation
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockRoute = {
    params: {},
  };

  // Mock shared hooks
  jest.mock('@{project}/shared/hooks', () => ({
    useAuth: () => ({
      user: { id: '1', name: 'Test User' },
      isAuthenticated: true,
    }),
  }));

  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <{Name}Screen navigation={mockNavigation as any} route={mockRoute as any} />
      </NavigationContainer>
    );
  };

  describe('{Name}Screen', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render correctly', () => {
      const { getByTestId } = renderScreen();
      expect(getByTestId('{name}-screen')).toBeTruthy();
    });

    it('should show loading state', async () => {
      const { getByTestId, queryByTestId } = renderScreen();

      expect(getByTestId('loading-indicator')).toBeTruthy();

      await waitFor(() => {
        expect(queryByTestId('loading-indicator')).toBeNull();
      });
    });

    it('should navigate on button press', () => {
      const { getByTestId } = renderScreen();

      fireEvent.press(getByTestId('navigate-button'));

      expect(mockNavigation.navigate).toHaveBeenCalledWith('TargetScreen');
    });
  });

hook_test_template: |
  /**
   * use{Name} Hook 测试
   */

  import { renderHook, act, waitFor } from '@testing-library/react-native';
  import { use{Name} } from '../../src/hooks/use{Name}';

  // Mock API
  jest.mock('@{project}/shared/services', () => ({
    {name}Service: {
      fetch: jest.fn(),
    },
  }));

  describe('use{Name}', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should initialize with default state', () => {
      const { result } = renderHook(() => use{Name}());

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should fetch data successfully', async () => {
      const mockData = { id: '1', name: 'Test' };
      require('@{project}/shared/services').{name}Service.fetch.mockResolvedValue(mockData);

      const { result } = renderHook(() => use{Name}());

      await act(async () => {
        await result.current.fetch();
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle error', async () => {
      const mockError = new Error('Fetch failed');
      require('@{project}/shared/services').{name}Service.fetch.mockRejectedValue(mockError);

      const { result } = renderHook(() => use{Name}());

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.error).toBe('Fetch failed');
    });
  });

jest_config: |
  // jest.config.js
  module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
      'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/**/*.styles.ts',
    ],
  };

test_setup: |
  // jest.setup.js
  import '@testing-library/jest-native/extend-expect';

  // Mock Expo modules
  jest.mock('expo-camera', () => ({}));
  jest.mock('expo-location', () => ({}));
  jest.mock('expo-notifications', () => ({}));

  // Mock AsyncStorage
  jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
  );

验证:
  单元测试: "npm run test"
  覆盖率: "npm run test:coverage"
  期望: "覆盖率 >= 80%"
```

#### 接口 9: verify_module

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

  测试检查:
    - name: "测试文件存在"
      check: "__tests__/{type}/{name}.test.tsx 存在"
    - name: "测试通过"
      command: "npm run test -- --testPathPattern={name}"
    - name: "覆盖率"
      command: "npm run test:coverage"
      期望: ">= 80%"

验证命令:
  编译: "npx tsc --noEmit"
  启动: "npm run start"
  iOS: "npm run ios"
  Android: "npm run android"
  测试: "npm run test"
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
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
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

### 4.3 启动屏（Splash Screen）

#### 安装依赖

```bash
npx expo install expo-splash-screen
```

#### App.tsx（集成启动屏）

```tsx
/**
 * 应用入口（集成启动屏）
 */

import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { RootNavigator } from './navigation';
import { ThemeProvider } from './theme';
import { useAuth } from '@{project}/shared/hooks';

// 防止启动屏自动隐藏
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { loadStoredAuth } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        // 预加载资源
        await Promise.all([
          // 加载字体
          Font.loadAsync({
            'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
            'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
          }),
          // 加载存储的认证信息
          loadStoredAuth(),
          // 其他初始化操作...
          // 模拟加载时间（生产环境移除）
          new Promise(resolve => setTimeout(resolve, 1000)),
        ]);
      } catch (e) {
        console.warn('应用初始化错误:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // 隐藏启动屏
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </View>
  );
}
```

#### app.json（启动屏配置）

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "image": "./assets/splash-dark.png",
          "backgroundColor": "#000000"
        }
      }
    },
    "android": {
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "image": "./assets/splash-dark.png",
          "backgroundColor": "#000000"
        }
      }
    }
  }
}
```

### 4.4 深度链接（Deep Linking）

#### 安装依赖

```bash
npx expo install expo-linking
```

#### navigation/linking.ts

```typescript
/**
 * 深度链接配置
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import type { RootStackParamList } from './types';

// URL 前缀
const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    prefix,
    'myapp://',                        // 自定义 scheme
    'https://myapp.com',               // 通用链接
    'https://*.myapp.com',             // 子域名
  ],

  // 路由映射
  config: {
    screens: {
      // 主标签
      Main: {
        screens: {
          Home: 'home',
          Profile: 'profile/:userId?',
          Settings: 'settings',
        },
      },
      // 认证流程
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          ResetPassword: 'reset-password/:token',
        },
      },
      // 独立页面
      ProductDetail: 'product/:id',
      OrderDetail: 'order/:orderId',
      NotFound: '*',
    },
  },

  // 自定义状态获取
  async getInitialURL() {
    // 检查是否通过深度链接打开
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }

    // 检查推送通知中的链接
    // const notification = await getNotificationLink();
    // if (notification) {
    //   return notification;
    // }

    return null;
  },

  // 订阅链接变化
  subscribe(listener) {
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });

    // 推送通知订阅
    // const notificationSubscription = subscribeToNotificationLink(listener);

    return () => {
      linkingSubscription.remove();
      // notificationSubscription.remove();
    };
  },
};
```

#### App.tsx（集成深度链接）

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { linking } from './navigation/linking';

export default function App() {
  return (
    <NavigationContainer
      linking={linking}
      fallback={<LoadingScreen />}  // 链接解析时显示
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
```

#### hooks/useDeepLink.ts

```typescript
/**
 * 深度链接 Hook
 */

import { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

interface DeepLinkHandler {
  pattern: RegExp;
  handler: (matches: RegExpMatchArray) => void;
}

export function useDeepLink(handlers: DeepLinkHandler[]) {
  const navigation = useNavigation();

  const handleDeepLink = useCallback((url: string) => {
    const parsedUrl = Linking.parse(url);
    const path = parsedUrl.path || '';

    for (const { pattern, handler } of handlers) {
      const matches = path.match(pattern);
      if (matches) {
        handler(matches);
        return;
      }
    }
  }, [handlers]);

  useEffect(() => {
    // 处理初始 URL
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url);
    });

    // 监听 URL 变化
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, [handleDeepLink]);
}

// 使用示例
export function useProductDeepLink() {
  const navigation = useNavigation();

  useDeepLink([
    {
      pattern: /^product\/(\d+)$/,
      handler: (matches) => {
        const productId = matches[1];
        navigation.navigate('ProductDetail', { id: productId });
      },
    },
    {
      pattern: /^order\/(\w+)$/,
      handler: (matches) => {
        const orderId = matches[1];
        navigation.navigate('OrderDetail', { orderId });
      },
    },
  ]);
}
```

#### app.json（深度链接配置）

```json
{
  "expo": {
    "scheme": "myapp",
    "ios": {
      "bundleIdentifier": "com.company.myapp",
      "associatedDomains": [
        "applinks:myapp.com",
        "applinks:www.myapp.com"
      ]
    },
    "android": {
      "package": "com.company.myapp",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "myapp.com",
              "pathPrefix": "/"
            },
            {
              "scheme": "myapp"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 前置检查
  # ═══════════════════════════════════════════════════════════════════
  前置检查:
    1_上游依赖检查:
      check: "shared-coder 是否完成"
      command: "ls packages/shared/types/index.ts && ls packages/shared/hooks/index.ts"
      失败处理: "等待 shared-coder 完成后重试"

    2_后端依赖检查:
      check: "backend-coder 是否完成（如果 platforms 包含 backend）"
      command: "ls packages/backend/src/main.ts"
      条件: "仅当 'backend' in platforms"
      失败处理: "等待 backend-coder 完成后重试"

    3_目录冲突检查:
      check: "mobile 目录是否已存在"
      command: "ls packages/mobile/"
      冲突时:
        action: "停止，询问用户"
        prompt: |
          ⚠️ packages/mobile/ 目录已存在
          请选择：
          1. 覆盖现有目录
          2. 使用其他名称
          3. 取消操作

    4_依赖版本检查:
      check: "Node.js 版本 >= 18"
      command: "node -v"
      期望: "v18.x 或更高"

    5_开发环境检查:
      iOS检查: "xcode-select -p"
      Android检查: "echo $ANDROID_HOME"
      期望: "Xcode 和 Android SDK 已安装"
      失败处理:
        iOS缺失: |
          ⚠️ 缺少 iOS 开发环境
          安装步骤：
          1. 从 App Store 安装 Xcode
          2. 运行 xcode-select --install
          3. 打开 Xcode 同意许可协议
          暂时跳过: "可先开发 Android 版本，iOS 环境就绪后再测试"
        Android缺失: |
          ⚠️ 缺少 Android 开发环境
          安装步骤：
          1. 安装 Android Studio
          2. 配置 ANDROID_HOME 环境变量
          3. 安装 SDK Platform 和 Build Tools
          暂时跳过: "可先开发 iOS 版本，Android 环境就绪后再测试"
        全部缺失: |
          ⚠️ 缺少双平台开发环境
          建议：至少安装一个平台的开发环境
          Expo Go 替代方案：使用 Expo Go 在真机预览（无需模拟器）

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
       
  # ═══════════════════════════════════════════════════════════════════
  # 🆕 验证策略（含失败级别和失败处理）
  # ═══════════════════════════════════════════════════════════════════
  验证策略:
    说明: "按 7.2 验证清单执行"

    1_编译验证:
      命令: "npx tsc --noEmit"
      失败级别: "CRITICAL"
      失败处理: "修复 TypeScript 错误，重试3次仍失败触发回滚"

    2_启动验证:
      命令: "npm run start"
      失败级别: "CRITICAL"
      失败处理: "检查 app.json、依赖安装，修复后重试"

    3_iOS模拟器验证:
      命令: "npm run ios"
      失败级别: "CRITICAL"
      失败处理: "检查 Xcode、iOS Simulator，可能需要 pod install"

    4_Android模拟器验证:
      命令: "npm run android"
      失败级别: "CRITICAL"
      失败处理: "检查 Android SDK、模拟器配置"

    5_导航验证:
      方法: "测试各屏幕跳转"
      失败级别: "BLOCKING"
      失败处理: "检查导航类型定义、Screen 注册"

    6_测试验证:
      命令: "npm run test"
      失败级别: "BLOCKING"
      失败处理: "修复测试用例或代码逻辑"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 回滚机制
  # ═══════════════════════════════════════════════════════════════════
  回滚触发条件:
    - "编译失败重试3次无效"
    - "iOS/Android 模拟器均无法启动"
    - "依赖冲突无法解决"

  回滚范围: "删除整个 packages/mobile/ 目录，重新执行"

  回滚命令: |
    rm -rf packages/mobile/
    # 重新从 create_foundation 开始

  验证命令示例:
    # 1. TypeScript 编译验证
    npx tsc --noEmit
    # 期望输出：无错误

    # 2. 启动 Expo 开发服务器
    npm run start
    # 期望：显示 QR 码和菜单选项

    # 3. iOS 模拟器启动
    npm run ios
    # 期望：iOS 模拟器启动并加载应用

    # 4. Android 模拟器启动
    npm run android
    # 期望：Android 模拟器启动并加载应用

    # 5. 检查导航类型
    grep -n "RootStackParamList" src/navigation/types.ts
    # 期望：所有屏幕都有类型定义

    # 6. 运行测试
    npm run test

    # 7. 检查覆盖率
    npm run test:coverage
    # 期望：覆盖率 >= 80%
```

### 5.2 场景二：功能迭代

```yaml
scenario_iteration:
  触发: "project_type = 'iteration'"
  
  前置检查:
    0. 调用巡按御史:
       action: "scan_project()"
       获取:
         - "现有目录结构"
         - "现有模块清单"
         - "现有依赖关系"
       证据: "巡按御史扫描 ID"
       
    1. 扫描现有结构:
       - "基于巡按御史结果检查 src/screens/"
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
        
  # ═══════════════════════════════════════════════════════════════════
  # 🆕 验证策略（含失败级别和失败处理）
  # ═══════════════════════════════════════════════════════════════════
  验证策略:
    说明: "按 7.2 验证清单执行，以下为功能迭代专用顺序"

    1_编译验证:
      命令: "npx tsc --noEmit"
      失败级别: "CRITICAL"
      失败处理: "立即停止，修复 TypeScript 错误，重试3次仍失败触发回滚"

    2_启动验证:
      命令: "npm run start"
      检查: "Expo 正常启动"
      失败级别: "CRITICAL"
      失败处理: "检查新增代码是否有语法错误"

    3_双平台验证:
      命令: "npm run ios && npm run android"
      检查: "两个平台都能正常运行"
      失败级别: "CRITICAL"
      失败处理: "检查平台特定代码、原生模块配置"

    4_导航验证:
      方法: "测试新屏幕跳转"
      检查: "导航参数传递正确"
      失败级别: "BLOCKING"
      失败处理: "检查 navigation/types.ts 类型定义"

    5_测试验证:
      命令: "npm run test -- --testPathPattern={NewFeature}"
      失败级别: "BLOCKING"
      失败处理: "修复测试用例或代码逻辑"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 回滚机制
  # ═══════════════════════════════════════════════════════════════════
  回滚触发条件:
    - "编译失败重试3次无效"
    - "新代码破坏现有功能"
    - "双平台验证均失败"

  回滚范围: "仅回滚本次迭代的新增代码，保留现有代码"

  回滚命令: |
    git status  # 查看变更文件
    git diff    # 查看具体变更
    git checkout -- packages/mobile/src/screens/{NewScreen}/  # 回滚新屏幕
    git checkout -- packages/mobile/src/navigation/types.ts   # 恢复导航类型

  验证命令示例:
    # 1. 增量编译验证
    npx tsc --noEmit

    # 2. 启动 Expo
    npm run start

    # 3. 检查新屏幕类型定义
    grep -n "{NewScreen}" src/navigation/types.ts
    # 期望：新屏幕在 ParamList 中

    # 4. 检查新组件导出
    grep -n "{NewComponent}" src/components/index.ts
    # 期望：新组件已导出

    # 5. iOS 测试
    npm run ios
    # 手动测试：导航到新屏幕，验证参数传递

    # 6. Android 测试
    npm run android
    # 手动测试：同上

    # 7. 原生模块测试（如果添加了新原生功能）
    # iOS:
    npx expo run:ios
    # Android:
    npx expo run:android

    # 8. 运行测试
    npm run test -- --testPathPattern="{NewFeature}"
```

### 5.3 场景三：项目重塑

```yaml
scenario_refactor:
  触发: "project_type = 'refactor'"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 整体前置检查（重塑前必须完成）
  # ═══════════════════════════════════════════════════════════════════
  前置检查:
    0_调用巡按御史:
      action: "scan_project()"
      获取:
        - "现有目录结构"
        - "现有技术栈版本（Expo SDK / RN 版本）"
        - "现有原生模块清单"
      证据: "巡按御史扫描 ID"

    1_版本控制检查:
      命令: "git status"
      期望: "工作区干净（无未提交变更）"
      失败处理: "先提交或 stash 当前变更"

    2_备份验证:
      命令: "git log -1 --oneline"
      动作: "记录当前 commit hash 作为回滚点"
      建议: "创建备份分支 git checkout -b backup/before-refactor"

    3_重塑范围确认:
      必须明确:
        - "Expo 到 RN CLI 还是反向？"
        - "哪些原生模块需要迁移？"
        - "目标 SDK / RN 版本是多少？"
      证据: "用户确认的迁移范围清单"

    4_原生环境检查:
      iOS: "xcode-select -p && pod --version"
      Android: "echo $ANDROID_HOME && ./gradlew --version"
      期望: "原生构建工具链可用"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 迁移策略判定流程
  # ═══════════════════════════════════════════════════════════════════
  迁移策略判定:
    流程: |
      ┌─────────────────────────────────────────────────────────────┐
      │  重塑范围是否涉及 Expo ↔ RN CLI 切换？                       │
      └─────────────────────────────────────────────────────────────┘
                    │
          ┌────────┴────────┐
          ▼                 ▼
        [是]              [否]
          │                 │
          ▼                 ▼
      ┌─────────┐    ┌─────────────────────────────────┐
      │ big_bang │    │  是否可以新旧版本并存测试？      │
      └─────────┘    └─────────────────────────────────┘
                              │
                    ┌────────┴────────┐
                    ▼                 ▼
                  [是]              [否]
                    │                 │
                    ▼                 ▼
              ┌──────────┐    ┌─────────────┐
              │ parallel │    │ incremental │
              └──────────┘    └─────────────┘

    判定规则:
      big_bang:
        条件:
          - "Expo 到 RN CLI 或反向迁移"
          - "或 SDK 大版本升级（如 Expo 49 → 51）"
          - "或原生模块大规模重构"
        风险: "高"
        决策者: "用户确认"

      incremental:
        条件:
          - "屏幕/组件级别改造"
          - "且不能新旧并存"
          - "且改造范围可分阶段"
        风险: "中"
        决策者: "Code Agent 建议，用户确认"

      parallel:
        条件:
          - "可以创建 /packages/mobile-v2/ 并行测试"
          - "验证后再合并/替换"
        风险: "低"
        决策者: "Code Agent 建议，用户确认"

    判定失败处理:
      场景: "判定错误，选错了策略"
      处理:
        - "立即停止当前策略"
        - "回滚到前置检查的备份点"
        - "重新判定，选择正确策略"
        - "记录判定失败原因"

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
        
  # ═══════════════════════════════════════════════════════════════════
  # 🆕 批次执行（含回滚触发条件）
  # ═══════════════════════════════════════════════════════════════════
  # ═══════════════════════════════════════════════════════════════════
  # 🆕 批次完成确认机制（v2.1 新增）
  # ═══════════════════════════════════════════════════════════════════
  批次完成确认:
    规则: "每个批次完成后必须执行确认检查，确认通过后才能开始下一批次"
    确认格式: |
      ✅ batch_X 完成确认
      - 验证命令: [实际执行的命令]
      - 验证结果: [PASS/FAIL]
      - 证据: [截图/输出]
      - 确认时间: [时间戳]
    确认失败处理: "回滚当前批次，修复后重新执行，重试3次仍失败则触发整体终止"

  批次执行:
    batch_1_navigation:
      迁移: "导航结构"
      依赖: "无（首个批次）"
      前置检查: "备份现有导航配置"
      文件:
        - "navigation/types.ts"
        - "navigation/RootNavigator.tsx"
      验证: "导航正常工作"
      完成确认: |
        # batch_1 完成确认检查
        npm run start  # 确认能启动
        # 手动测试：各 Navigator 切换正常
        echo "batch_1_navigation 确认通过" >> refactor.log
      回滚触发条件:
        - "导航跳转失败"
        - "类型错误无法解决"
      回滚命令: "git checkout -- src/navigation/"

    batch_2_components:
      迁移: "通用组件"
      依赖: "batch_1_navigation 成功完成"
      依赖确认: "grep 'batch_1_navigation 确认通过' refactor.log"
      前置检查: "导航能正常工作"
      文件:
        - "components/"
      验证: "组件渲染正确"
      完成确认: |
        # batch_2 完成确认检查
        npm run test -- --testPathPattern="components"
        # 手动测试：组件渲染、样式正常
        echo "batch_2_components 确认通过" >> refactor.log
      回滚触发条件:
        - "组件渲染错误"
        - "组件测试失败"
      回滚命令: "git checkout -- src/components/"
      级联回滚: "batch_2 回滚不影响 batch_1"

    batch_3_screens:
      迁移: "屏幕页面"
      依赖: "batch_2_components 成功完成"
      依赖确认: "grep 'batch_2_components 确认通过' refactor.log"
      前置检查: "组件测试通过"
      文件:
        - "screens/"
      验证: "页面功能正常"
      顺序: "按依赖关系从少到多"
      完成确认: |
        # batch_3 完成确认检查
        npm run ios  # iOS 模拟器测试
        npm run android  # Android 模拟器测试
        # 手动测试：每个屏幕功能正常
        echo "batch_3_screens 确认通过" >> refactor.log
      回滚触发条件:
        - "屏幕渲染错误"
        - "双平台测试失败"
      回滚命令: "git checkout -- src/screens/"
      级联回滚: "batch_3 回滚不影响 batch_1/2"

    batch_4_native:
      迁移: "原生模块"
      依赖: "batch_3_screens 成功完成"
      依赖确认: "grep 'batch_3_screens 确认通过' refactor.log"
      前置检查: "所有屏幕功能正常"
      文件:
        - "app.json / app.config.ts"
        - "ios/（Podfile、Info.plist）"
        - "android/（build.gradle、AndroidManifest.xml）"
      验证: "原生功能正常"
      注意: "需要重新安装 app"
      完成确认: |
        # batch_4 完成确认检查
        npx expo run:ios  # iOS 原生构建
        npx expo run:android  # Android 原生构建
        # 测试相机、定位等原生功能
        echo "batch_4_native 确认通过" >> refactor.log
        echo "=== 重塑完成 ===" >> refactor.log
      回滚触发条件:
        - "原生模块加载失败"
        - "权限获取失败"
        - "iOS/Android 构建失败"
      回滚命令: |
        git checkout -- app.json
        git checkout -- ios/
        git checkout -- android/
        cd ios && pod install
      警告: "原生回滚后需要清除缓存重新构建"
      
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
    批次级回滚:
      - "每批次前 git commit"
      - "保留旧版本备份"
      - "iOS/Android 都测试后再继续"
      - "单批次最多重试 3 次"

    # ═══════════════════════════════════════════════════════════════════
    # 🆕 整体失败终止条件
    # ═══════════════════════════════════════════════════════════════════
    整体失败终止:
      触发条件:
        - "同一批次回滚重试 3 次仍失败"
        - "批次依赖链断裂无法恢复"
        - "iOS 和 Android 均无法构建"

      终止流程:
        1_立即停止: "停止所有后续批次"
        2_整体回滚: |
          git reset --hard {前置检查记录的commit}
          # 或
          git checkout backup/before-refactor
          # 清除原生缓存
          cd ios && rm -rf Pods Podfile.lock && pod install
          cd android && ./gradlew clean
        3_记录失败: "记录失败批次、失败原因、尝试次数"
        4_上报: "通知 Code Agent，标记重塑失败"
        5_分析: "分析失败原因，调整策略后重新开始"

      整体回滚范围: "回到前置检查备份点，完全恢复重塑前状态"

      上报格式: |
        ⚠️ 移动端项目重塑失败
        - 失败批次: batch_X
        - 失败原因: [具体原因]
        - 已尝试: X 次
        - 平台状态: iOS [成功/失败] / Android [成功/失败]
        - 回滚状态: [已回滚/回滚中]
        - 建议: [更换策略/降级SDK版本/人工介入]

  批次验证命令示例:
    # batch_1_navigation 验证
    npm run start
    # 测试所有导航路径
    # 验证：各 Navigator 之间切换正常

    # batch_2_components 验证
    npm run test -- --testPathPattern="components"
    # 手动测试：组件渲染正确，样式正常

    # batch_3_screens 验证
    npm run ios
    npm run android
    # 手动测试每个屏幕功能

    # batch_4_native 验证
    # 清除缓存重新安装
    # iOS:
    cd ios && rm -rf Pods Podfile.lock && pod install
    npx expo run:ios

    # Android:
    cd android && ./gradlew clean
    npx expo run:android

    # 测试原生功能（相机、定位等）

    # Expo SDK 升级验证
    npx expo upgrade
    npx expo doctor
    # 检查并修复警告

    # React Native CLI 升级
    npx react-native upgrade-helper
    # 按照输出的 diff 进行迁移

    # 回滚命令
    git log --oneline -5
    git revert HEAD

    # iOS 回滚（如果 Pods 有问题）
    git checkout ios/Podfile.lock
    cd ios && pod install
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
    例外: |
      以下情况可在 mobile 包中实现：
      - 移动端特有的原生 hooks（如 useCamera、useLocation、useBiometrics）
      - 移动端特有的导航 hooks（如 useNavigation wrapper）
      - 移动端特有的手势/动画 hooks
      放置位置: "/packages/mobile/src/hooks/"
    
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

  MC-08:
    name: "测试覆盖"
    rule: "组件、屏幕必须有对应测试文件"
    标准: "覆盖率 >= 80%"
    文件:
      组件测试: "__tests__/components/{Name}.test.tsx"
      屏幕测试: "__tests__/screens/{Name}Screen.test.tsx"
    命令: "npm run test:coverage"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 性能铁律
  # ═══════════════════════════════════════════════════════════════════

  MC-09:
    name: "FlatList 大列表优化"
    rule: "长列表必须使用 FlatList，禁止用 ScrollView + map"
    触发条件:
      - "列表项超过 20 条"
      - "或用户场景明确会有大量数据"
    实现: |
      <FlatList
        data={items}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    检测: "grep -rn 'ScrollView' src/ | grep -v FlatList"

  MC-10:
    name: "避免匿名函数 re-render"
    rule: "事件处理函数使用 useCallback 包裹"
    错误示范: |
      // ❌ 每次渲染创建新函数
      <Button onPress={() => doSomething(id)} />
    正确做法: |
      // ✅ 使用 useCallback
      const handlePress = useCallback(() => {
        doSomething(id);
      }, [id]);
      <Button onPress={handlePress} />

  MC-11:
    name: "图片必须优化"
    rule: "使用 expo-image 或 react-native-fast-image，设置合适尺寸"
    实现: |
      import { Image } from 'expo-image';
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 100, height: 100 }}
        contentFit="cover"
        placeholder={blurhash}
        transition={200}
      />
    检测: "检查是否使用原生 Image 组件加载网络图片"

  MC-12:
    name: "包体积监控"
    rule: "iOS/Android 包体积 < 50MB（未压缩）"
    检测: "eas build 完成后查看包大小"
    超标处理: "移除未使用依赖、使用动态导入、优化图片资源"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 安全铁律
  # ═══════════════════════════════════════════════════════════════════

  MC-13:
    name: "敏感数据用 SecureStore"
    rule: "token、密码等敏感数据必须使用 expo-secure-store"
    禁止: "使用 AsyncStorage 存储敏感数据"
    实现: |
      import * as SecureStore from 'expo-secure-store';
      await SecureStore.setItemAsync('token', accessToken);
      const token = await SecureStore.getItemAsync('token');
    检测: "grep -rn 'AsyncStorage.*token' src/"

  MC-14:
    name: "API 请求必须有错误处理"
    rule: "所有网络请求必须有 try-catch 和超时配置"
    实现: |
      try {
        const response = await apiClient.get('/data', { timeout: 10000 });
      } catch (error) {
        if (error.code === 'ECONNABORTED') {
          Alert.alert('请求超时');
        } else {
          Alert.alert('网络错误');
        }
      }

  MC-15:
    name: "权限请求必须优雅降级"
    rule: "权限被拒绝时必须有降级方案和引导"
    实现: |
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '需要相机权限',
          '请在设置中开启相机权限',
          [{ text: '去设置', onPress: () => Linking.openSettings() }]
        );
        return;
      }

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 数据处理铁律
  # ═══════════════════════════════════════════════════════════════════

  MC-16:
    name: "金额计算禁止直接用浮点数"
    rule: "涉及金额的计算必须使用 decimal.js 或以分为单位"
    原因: "0.1 + 0.2 = 0.30000000000000004"
    正确做法: |
      // 方案1：使用 decimal.js
      import Decimal from 'decimal.js';
      new Decimal(0.1).plus(0.2).toNumber();

      // 方案2：以分为单位
      const priceInCents = 1990; // 19.90 元
      const displayPrice = (priceInCents / 100).toFixed(2);

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 v2.1 新增：交互体验铁律
  # ═══════════════════════════════════════════════════════════════════

  MC-17:
    name: "键盘遮挡必须处理"
    rule: "有输入框的屏幕必须使用 KeyboardAvoidingView 或 keyboard-aware-scroll-view"
    触发条件:
      - "屏幕包含 TextInput"
      - "表单页面"
      - "聊天输入页面"
    实现: |
      import { KeyboardAvoidingView, Platform } from 'react-native';

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* 表单内容 */}
      </KeyboardAvoidingView>
    Android额外配置: |
      // android/app/src/main/AndroidManifest.xml
      <activity
        android:windowSoftInputMode="adjustResize"
        ...
      />
    检测: "grep -rn 'TextInput' src/screens/ | xargs -I {} dirname {} | sort -u"
    验证: "每个包含 TextInput 的屏幕都有键盘处理"

  MC-18:
    name: "后台回前台必须刷新"
    rule: "涉及实时数据的屏幕必须监听 AppState，从后台回前台时刷新数据"
    触发条件:
      - "列表数据可能在后台期间变化"
      - "用户状态可能过期"
      - "Token 可能失效"
    实现: |
      import { useEffect, useRef } from 'react';
      import { AppState, AppStateStatus } from 'react-native';

      export function useAppStateRefresh(onForeground: () => void) {
        const appState = useRef(AppState.currentState);

        useEffect(() => {
          const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            // 从后台/非活跃 → 前台
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
              onForeground();
            }
            appState.current = nextAppState;
          });

          return () => subscription.remove();
        }, [onForeground]);
      }

      // 使用
      useAppStateRefresh(() => {
        refetchData();
      });
    检测: "检查首页、列表页是否有 AppState 监听"

  MC-19:
    name: "网络状态必须监控"
    rule: "应用必须监控网络状态，离线时给予用户明确提示"
    依赖: "@react-native-community/netinfo"
    实现: |
      import NetInfo from '@react-native-community/netinfo';
      import { useEffect, useState } from 'react';

      export function useNetworkStatus() {
        const [isConnected, setIsConnected] = useState<boolean | null>(true);

        useEffect(() => {
          const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
          });

          return () => unsubscribe();
        }, []);

        return isConnected;
      }

      // 在 App.tsx 或全局组件中
      function OfflineBanner() {
        const isConnected = useNetworkStatus();

        if (isConnected === false) {
          return (
            <View style={styles.offlineBanner}>
              <Text>当前无网络连接</Text>
            </View>
          );
        }
        return null;
      }
    必须场景:
      - "API 请求前检查网络"
      - "离线时禁用需要网络的操作"
      - "恢复网络后自动重试"
```

---

## 七、验证清单

### 7.1 强制验证规则 🆕

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 强制验证铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  MC-V01: 每个验证必须执行，不执行不算完成                                  ║
║  MC-V02: 每个验证必须有真实输出证据                                        ║
║  MC-V03: API 连通性验证必须实际测试                                        ║
║  MC-V04: 验证失败必须修复后重新验证                                        ║
║  MC-V05: 禁止"应该可以""理论上"等模糊词                                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 7.2 验证清单

```yaml
verification_checklist:

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 与场景的关系说明
  # ═══════════════════════════════════════════════════════════════════
  场景适用说明:
    本清单适用: "所有场景（新项目/功能迭代/项目重塑）"

    场景一_新项目:
      必须执行: "全部 7 步"
      说明: "新项目必须完整验证"

    场景二_功能迭代:
      必须执行: "编译验证、启动验证、双平台验证、导航验证"
      可选执行: "API连通性（如涉及新API）、类型同步（如涉及shared）"
      说明: "迭代时重点验证增量部分"

    场景三_项目重塑:
      必须执行: "每个批次完成后执行相关验证"
      批次对应:
        batch_1_navigation: "导航验证"
        batch_2_components: "双平台验证（组件渲染）"
        batch_3_screens: "双平台验证 + 功能验证"
        batch_4_native: "原生功能测试（相机/定位等）"
      全部完成后: "执行完整 7 步验证"

  # ═══════════════════════════════════════════════════════════════════
  # 第一步：编译验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  编译验证:
    命令: "npx tsc --noEmit"
    期望: "无任何 TypeScript 错误"
    证据: "必须贴出完整编译输出"
    失败处理: "修复所有错误后重新验证"

  # ═══════════════════════════════════════════════════════════════════
  # 第二步：启动验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  启动验证:
    命令: "npm run start"
    期望: "Expo 开发服务器正常启动，显示 QR 码"
    证据: "必须贴出终端输出（含 QR 码）"
    超时: "60秒内无输出视为失败"

  # ═══════════════════════════════════════════════════════════════════
  # 第三步：API 连通性验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  API连通性验证:
    说明: "确保移动端能连接后端 API"

    # 🆕 端口说明（避免混淆）
    端口说明:
      后端API服务器: "http://localhost:3000（NestJS/Express 默认）"
      iOS模拟器: "直接用 localhost:3000"
      Android模拟器: "用 10.0.2.2:3000（模拟器专用地址）"
      真机测试: "用电脑局域网 IP（如 192.168.x.x:3000）"

    检查步骤:
      1_检查后端是否启动: |
        curl -s http://localhost:3000/health
        # 期望返回: {"status":"ok"} 或类似健康检查响应
      2_检查API配置: |
        grep -n "API_PORT\|baseUrl\|getApiHost" packages/shared/configs/api.config.ts
      3_模拟器网络检查: |
        # 参考 7.4 Android 模拟器 API 地址配置
        # 确保 getApiHost() 函数正确处理平台差异
    期望: "后端健康检查返回 200，模拟器能正常发起请求"
    证据: "必须贴出 curl 健康检查响应 + React Native Debugger Network 截图"
    常见错误:
      - "Network request failed = 后端未启动或地址配置错误"
      - "Android 使用 localhost 无法连接 = 应使用 10.0.2.2"
      - "真机无法连接 = 应使用电脑 IP，非 localhost"
      - "Connection refused = 后端服务未运行"

  # ═══════════════════════════════════════════════════════════════════
  # 第四步：模拟器验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  iOS模拟器验证:
    命令: "npm run ios"
    期望: "iOS 模拟器正常运行应用"
    证据: "必须贴出模拟器截图"

  Android模拟器验证:
    命令: "npm run android"
    期望: "Android 模拟器正常运行应用"
    证据: "必须贴出模拟器截图"

  # ═══════════════════════════════════════════════════════════════════
  # 第五步：类型同步验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  类型同步验证:
    说明: "确保从 shared 导入类型，无重复定义"
    检查命令: |
      # 检查是否有重复的类型定义
      grep -rn "interface.*Request\|interface.*Response" packages/mobile/src/ || echo "✅ 无重复定义"
      # 检查是否正确从 shared 导入
      grep -rn "from.*@.*shared" packages/mobile/src/ | head -10
    期望: "无重复类型定义，从 shared 正确导入"
    证据: "必须贴出检查输出"

  # ═══════════════════════════════════════════════════════════════════
  # 第六步：功能验证
  # ═══════════════════════════════════════════════════════════════════
  导航验证:
    方法: "测试各屏幕跳转"
    期望: "导航正常，无类型错误，无 warning"
    证据: "必须贴出各屏幕截图"

  # ═══════════════════════════════════════════════════════════════════
  # 第七步：测试验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  单元测试验证:
    命令: "npm run test"
    期望: "Tests: X passed, 0 failed"
    证据: "必须贴出测试结果摘要"

  覆盖率验证:
    命令: "npm run test:coverage"
    期望: "All files ... >= 80%"
    证据: "必须贴出覆盖率表格"
```

### 7.3 中文编码配置 🆕

```typescript
// app.json 中确保正确处理中文

{
  "expo": {
    "name": "应用名称",
    "slug": "app-slug",
    // 🆕 确保支持中文
    "locales": {
      "zh": "./locales/zh.json"
    },
    "ios": {
      "infoPlist": {
        // 🆕 iOS 中文配置
        "CFBundleDevelopmentRegion": "zh_CN"
      }
    },
    "android": {
      // 🆕 Android 中文配置
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### 7.4 Android 模拟器 API 地址配置 🆕

```typescript
// configs/api.config.ts 中处理 Android 模拟器地址

import { Platform } from 'react-native';

/** 固定 API 端口 */
export const API_PORT = 3000;

/**
 * 🆕 根据平台获取 API 主机地址
 * - iOS 模拟器：localhost
 * - Android 模拟器：10.0.2.2（模拟器专用）
 * - 真机：需要使用电脑 IP
 */
export const getApiHost = (): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android 模拟器使用特殊地址
      return '10.0.2.2';
    }
    return 'localhost';
  }
  // 生产环境使用实际域名
  return 'api.your-domain.com';
};

export const apiConfig = {
  port: API_PORT,
  baseUrl: `http://${getApiHost()}:${API_PORT}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
} as const;
```

---

## 八、部署验证规范 🆕

### 8.1 部署验证铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 移动端部署铁律                                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  DP-M01: 发布前必须在真机测试，模拟器通过不代表真机通过                    ║
║  DP-M02: iOS 发布前必须通过 Apple 审核清单检查                             ║
║  DP-M03: Android 发布前必须通过 Google Play 政策检查                       ║
║  DP-M04: 版本号必须递增，禁止覆盖已发布版本                                ║
║  DP-M05: 发布包必须签名验证通过                                            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 8.2 部署验证清单

```yaml
deployment_checklist:

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 部署方式判定（v2.1 新增）
  # ═══════════════════════════════════════════════════════════════════
  部署方式判定:
    判定依据: "检查项目是否使用 Expo"
    检查命令: "grep 'expo' package.json"

    Expo项目:
      标识: "package.json 包含 expo 依赖"
      构建工具: "EAS Build（eas build）"
      优势: "云端构建，无需本地环境"

    RN_CLI项目:
      标识: "无 expo 依赖，有 ios/ 和 android/ 原生目录"
      构建工具: "Xcode + Android Studio 或 Fastlane"
      优势: "完全控制原生代码"

  # ═══════════════════════════════════════════════════════════════════
  # iOS 部署验证
  # ═══════════════════════════════════════════════════════════════════
  iOS部署验证:

    # Expo 项目构建
    Expo构建:
      命令: "eas build --platform ios --profile production"
      期望: "Build successful"
      证据: "构建日志 + .ipa 文件"

    # RN CLI 项目构建
    RN_CLI构建:
      方式一_Xcode: |
        1. 打开 ios/{项目名}.xcworkspace
        2. 选择 Generic iOS Device
        3. Product → Archive
        4. Distribute App → App Store Connect
      方式二_Fastlane: |
        # Fastfile 配置
        lane :release do
          build_app(
            scheme: "MyApp",
            export_method: "app-store"
          )
          upload_to_app_store
        end
        # 执行
        fastlane release
      期望: ".ipa 文件生成成功"

    签名验证:
      检查项:
        - "证书有效期 > 30天"
        - "Provisioning Profile 包含目标设备"
        - "Bundle ID 与 App Store 一致"

    真机测试:
      必测场景:
        - "冷启动时间 < 3秒"
        - "API 请求正常（非模拟器地址）"
        - "推送通知正常接收"
        - "后台切换不闪退"
      证据: "真机测试截图/视频"

  # ═══════════════════════════════════════════════════════════════════
  # Android 部署验证
  # ═══════════════════════════════════════════════════════════════════
  Android部署验证:

    # Expo 项目构建
    Expo构建:
      命令: "eas build --platform android --profile production"
      期望: "Build successful"
      证据: "构建日志 + .aab/.apk 文件"

    # RN CLI 项目构建
    RN_CLI构建:
      方式一_Gradle: |
        cd android
        ./gradlew bundleRelease  # 生成 .aab
        # 或
        ./gradlew assembleRelease  # 生成 .apk
        # 输出位置: android/app/build/outputs/
      方式二_Fastlane: |
        # Fastfile 配置
        lane :release do
          gradle(
            task: "bundle",
            build_type: "Release"
          )
          upload_to_play_store
        end
        # 执行
        fastlane release
      期望: ".aab 或 .apk 文件生成成功"

    签名验证:
      命令: "jarsigner -verify -verbose -certs app-release.apk"
      期望: "jar verified"
      证据: "签名验证输出"

    真机测试:
      必测场景:
        - "不同 Android 版本兼容（至少测 Android 10/12/13）"
        - "不同屏幕尺寸适配"
        - "API 请求正常（生产环境地址）"
        - "权限请求弹窗正常"
      证据: "多设备测试截图"

  # ═══════════════════════════════════════════════════════════════════
  # 通用验证
  # ═══════════════════════════════════════════════════════════════════
  版本号验证:
    检查: "app.json 或 app.config.js 中版本号"
    规则:
      - "version 必须大于当前已发布版本"
      - "iOS buildNumber 必须递增"
      - "Android versionCode 必须递增"

  API环境验证:
    检查: "确保生产包使用生产 API 地址"
    命令: "grep -r 'localhost\\|10.0.2.2' src/"
    期望: "无匹配结果（生产包不应有开发地址）"
```

### 8.3 常见部署问题排查

```yaml
deployment_troubleshooting:

  iOS闪退:
    症状: "App 启动后立即闪退"
    排查:
      - "检查 Xcode Organizer 崩溃日志"
      - "检查是否缺少必要权限声明（Info.plist）"
      - "检查第三方库是否支持目标 iOS 版本"

  Android安装失败:
    症状: "安装包无法安装"
    排查:
      - "检查签名是否正确"
      - "检查 minSdkVersion 是否过高"
      - "检查是否与已安装版本签名冲突"

  API连接失败_生产环境:
    症状: "开发正常，生产环境 API 不通"
    排查:
      - "检查 API 地址是否切换为生产地址"
      - "检查 HTTPS 证书是否有效"
      - "检查网络权限（Android android.permission.INTERNET）"
```

---

## 九、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.1 | 2026-02-01 | 司礼监复查修复：新增MC-17键盘遮挡/MC-18 AppState监听/MC-19网络状态监控、批次完成确认机制、类型变更后验证、开发环境检查失败处理、MC-04例外说明、部署流程区分Expo/RN CLI |
| v2.0 | 2026-02-01 | 场景逻辑闭环完善（前置检查/失败级别/回滚机制）、协作时序详细说明、铁律扩展至MC-16（性能/安全/数据处理）、验证清单场景适用说明、API端口统一 |
| v1.8 | 2026-02-01 | 新增部署验证规范（iOS/Android 部署清单、签名验证、真机测试要求） |
| v1.7 | 2026-02-01 | 新增强制验证规则、API连通性验证、UTF-8编码配置、Android模拟器地址配置、类型同步验证 |
| v1.6 | 2026-01-31 | 新增激活与协作章节 |
| v1.5 | 2026-01-31 | 场景适配指南添加具体验证命令示例 |
| v1.4 | 2026-01-31 | 新增测试接口 create_test、测试铁律 MC-08、Jest 配置、启动屏、深度链接 |
| v1.3 | 2026-01-25 | 更新文档格式 |
| v1.2 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.1 | 2026-01-22 | 补充完整示例和验证清单 |
| v1.0 | 2026-01-22 | 初始版本：React Native + Expo、导航配置、组件模板 |

---

**📱 Mobile Coder · 移动端工匠 · 文档完**
