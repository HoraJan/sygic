import fs = require("fs");
import { ma } from "moving-averages";
import { buildGPX, GarminBuilder } from "gpx-builder";

import { headerStructure } from "./header_structure";
import { pointStructure } from "./point_structure";
import { parse } from "./parsing_function";
import GarminPoint from 'gpx-builder/dist/builder/GarminBuilder/models/GarminPoint';
import { Header, SygicPoint } from './types';

const { Point, Metadata } = GarminBuilder.MODELS;

export const parseFile = (name: string): void => {
    const file = fs.readFileSync(`./${name}.log`);

const arr = [...file];
const indexObject = { index: 0 };
const header = {} as Header;
const points = [] as SygicPoint[];

console.log(arr);

headerStructure.forEach((field) => {
    parse(field, indexObject, arr, header);
});

console.log(header);
const startTime = new Date();
startTime.setFullYear(2000 + parseInt(header.startTime.slice(0, 2), 10));
startTime.setMonth(parseInt(header.startTime.slice(2, 4), 10) - 1);
startTime.setDate(parseInt(header.startTime.slice(4, 6), 10));
startTime.setUTCHours(parseInt(header.startTime.slice(7, 9), 10));
startTime.setUTCMinutes(parseInt(header.startTime.slice(9, 11), 10));
startTime.setUTCSeconds(parseInt(header.startTime.slice(11, 13), 10));
startTime.setMilliseconds(0);

const pointsNum = header.pointCount ?? 0;

for (let i = 0; i < pointsNum; i++) {
  const point = {} as SygicPoint;
  pointStructure.forEach((field) => {
    parse(field, indexObject, arr, point);
  });
  points.push(point);
}

console.log(points[0]);

const rawSpeed = points.map((point: SygicPoint) => point.speed);

const speed = ma(rawSpeed, 50);

const rawElevation = points.map((point: SygicPoint) => point.elevation);

const elevation = ma(rawElevation, 50);

const gpxPoints: GarminPoint[] = points.map(
  (
    point: SygicPoint,
    index: number
  ) =>
    new Point(point.lat , point.lon , {
      ele: (elevation[index] ?? point.elevation),
      time: new Date(startTime.valueOf() + point.time),
      speed: (speed[index] ?? point.speed),
    })
);

const gpxData = new GarminBuilder();

const meta = new Metadata({
  name: header.startDescription + " - " + header.endDescription,
  time: startTime
});

gpxData.setMetadata(meta);

gpxData.setSegmentPoints(gpxPoints);

const gpx = buildGPX(gpxData.toObject());

fs.writeFileSync(`./${name}.gpx`, gpx);

}