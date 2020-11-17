import "./App.css";
import React from "react";
import fetchData from "./fetchData";
import population from "./population";

const regions = {
  SM: "Totalt_antal_fall",
  K: "Blekinge",
  W: "Dalarna",
  I: "Gotland",
  X: "Gävleborg",
  N: "Halland",
  Z: "Jämtland_Härjedalen",
  F: "Jönköping",
  H: "Kalmar",
  G: "Kronoberg",
  BD: "Norrbotten",
  M: "Skåne",
  AB: "Stockholm",
  D: "Sörmland",
  C: "Uppsala",
  S: "Värmland",
  AC: "Västerbotten",
  Y: "Västernorrland",
  U: "Västmanland",
  O: "Västra_Götaland",
  T: "Örebro",
  E: "Östergötland",
};

function App() {
  let { headers, dates, rows } = fetchData();
  let regionCodes = Object.keys(regions);
  rows = rows.slice(-14);
  return (
    <div className="table">
      {tableRow()}
      <span className="date" />
      {/*{headers.map(columnHeader)}*/}
    </div>
  );

  function columnHeader(header: string) {
    return <span className={header.toLowerCase()}>{header}</span>;
  }

  function tableRow() {
    return rows[0].map((value, colIndex) => tableCell(colIndex));

    function tableCell(colIndex: number) {
      let x =
        (rows.map((row) => row[colIndex]).reduce(sum, 0) /
          population[colIndex]) *
        1e5;

      return (
        <span className={color(x) + " " + regionCodes[colIndex]}>
          {Math.round(x)}
        </span>
      );
    }
  }
}

function sum(a: number, b: number) {
  return a + b;
}

function color(x: number) {
  for (let i = 960; i >= 60; i /= 2) if (x > i) return "color" + i;
  if (x > 20) return "color20";
  if (x > 0) return "color1";
  return "color0";
}

export default App;
