import { Options } from "src/type";
import BeaconSender from "./beaconSender";
import DefalutSender from "./defaultSender";
import ImgSender from "./imgSender";

export default function getSender(senderType: string, options: Options) {
  if (senderType === "xhr") {
    return new DefalutSender(options);
  } else if (senderType === "img") {
    return new ImgSender(options);
  } else if (senderType === "beacon") {
    return new BeaconSender(options);
  }
}
