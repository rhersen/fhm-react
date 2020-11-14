import "./App.css";
import React from "react";
import all from "./Folkhalsomyndigheten_Covid19.json";

let population: { [col: string]: number } = {
  B: 10230000,
  C: 159748,
  D: 287795,
  E: 59636,
  F: 287333,
  G: 333202,
  H: 130697,
  I: 363351,
  J: 245415,
  K: 201290,
  L: 250230,
  M: 1376659,
  N: 2374550,
  O: 297169,
  P: 383044,
  Q: 282342,
  R: 271621,
  S: 245380,
  T: 275634,
  U: 1724529,
  V: 304634,
  W: 465214,
};

function App() {
  let data = all["Antal per dag region"];
  let header = data[0] as { [col: string]: string };
  let rows: Array<{ [col: string]: any }> = data.slice(1);
  let dates = rows.map(date);
  let column = extractColumns(rows);

  return (
    <div className="table">
      {rows.map(tableRow)}
      <span className="date" />
      {Object.keys(population).map(columnHeader)}
    </div>
  );

  function columnHeader(key: string) {
    return <span>{header[key]}</span>;
  }

  function tableRow(row: { [col: string]: number }, i: number) {
    return (
      <>
        <span className="date">{dates[i]}</span>
        {Object.keys(population).map(tableCell)}
      </>
    );

    function tableCell(key: string) {
      let x =
        (column[key].slice(i - 13, i + 1).reduce(sum, 0) / population[key]) *
        1e5;

      return <span className={color(x)}>{Math.round(x)}</span>;
    }
  }
}

function date(row: { [col: string]: any }) {
  return row.A.substr(0, 10);
}

function extractColumns(rows: Array<{ [p: string]: any }>) {
  let column: { [col: string]: Array<number> } = {};
  Object.keys(population).forEach(set);
  return column;

  function set(key: string) {
    column[key] = rows.map((row: { [col: string]: number }) => row[key]);
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
