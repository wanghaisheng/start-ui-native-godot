declare module '@borndotcom/react-native-godot' {
  import type { ViewProps } from 'react-native';

  export interface RTNGodotViewProps extends ViewProps {
    style?: unknown;
  }

  export const RTNGodotView: React.FC<RTNGodotViewProps>;

  export function runOnGodotThread(callback: () => void): void;

  export const RTNGodot: {
    init(config: Record<string, string>): Promise<void>;
    API(): unknown;
  };
}
