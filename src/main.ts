import { Board } from "./board";
import "./styling/style.css";

const startButton = document.querySelector("#startButton") as HTMLButtonElement;

const board = new Board(30, 60);

board.initialize();

startButton.addEventListener("click", () => board.visualizeAlgorithm());

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.code === "Space") {
    board.visualizeAlgorithm();
  }
});
