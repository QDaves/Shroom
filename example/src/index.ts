import * as PIXI from "pixi.js";

import {
  Room,
  Avatar,
  FloorFurniture,
  RoomCamera,
  Shroom,
} from "@jankuss/shroom";

const view = document.querySelector("#root") as HTMLCanvasElement | undefined;
const container = document.querySelector("#container") as
  | HTMLDivElement
  | undefined;
if (view == null || container == null) throw new Error("Invalid view");

const application = new PIXI.Application({
  view,
  antialias: false,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  width: 1200,
  height: 900,
  backgroundColor: 0x1a1a2e,
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const shroom = Shroom.create({
  application,
  resourcePath: "./resources",
});

const room = Room.create(shroom, {
  tilemap: `
   xxxxxxx
   x000000
   x000000
   x000000
   x000000
   x000000
   `,
});

const avatar = new Avatar({
  look: "hd-180-1.hr-100-61.ch-210-66.lg-280-110.sh-305-62",
  direction: 2,
  roomX: 2,
  roomY: 2,
  roomZ: 0,
});

const avatar2 = new Avatar({
  look: "hd-600-1.hr-893-61.ch-255-66.lg-285-110.sh-290-62",
  direction: 4,
  roomX: 4,
  roomY: 3,
  roomZ: 0,
});

const sofa = new FloorFurniture({
  roomX: 0,
  roomY: 1,
  roomZ: 0,
  direction: 2,
  type: "club_sofa",
});

room.x = 300;
room.y = 200;

room.wallColor = "#8b7355";
room.floorColor = "#cccccc";

room.addRoomObject(avatar);
room.addRoomObject(avatar2);
room.addRoomObject(sofa);

room.onTileClick = (pos) => {
  console.log("tile clicked:", pos);
  avatar.walk(pos.roomX, pos.roomY, pos.roomZ, { direction: 2 });
};

application.stage.addChild(RoomCamera.forScreen(room));

console.log("Shroom test loaded!");
