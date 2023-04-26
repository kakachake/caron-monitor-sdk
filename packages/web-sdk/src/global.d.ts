declare module "user-agent";

type Megabit = number;
type Millisecond = number;
type EffectiveConnectionType = "2g" | "3g" | "4g" | "slow-2g" | "unknown";
type ConnectionType =
  | "bluetooth"
  | "cellular"
  | "ethernet"
  | "mixed"
  | "none"
  | "other"
  | "unknown"
  | "wifi"
  | "wimax";
interface NetworkInformation extends EventTarget {
  readonly type?: ConnectionType;
  readonly effectiveType?: EffectiveConnectionType;
  readonly downlinkMax?: Megabit;
  readonly downlink?: Megabit;
  readonly rtt?: Millisecond;
  readonly saveData?: boolean;
  onchange?: EventListener;
}

interface Navigator {
  connection: NetworkInformation;
}
