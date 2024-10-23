import preventZoom from "./preventZoom";
import "./style.css";
import { touchInit } from "./touch";

preventZoom();

const screen = document.getElementById("screen");
const target = document.getElementById("img-wrapper");

touchInit(screen, target);
