import "./App.css";
import React from "react";
import fetchData from "./fetchData";

let population = [
  10230000,
  159748,
  287795,
  59636,
  287333,
  333202,
  130697,
  363351,
  245415,
  201290,
  250230,
  1376659,
  2374550,
  297169,
  383044,
  282342,
  271621,
  245380,
  275634,
  1724529,
  304634,
  465214,
];

function App() {
  let { headers, dates, rows } = fetchData();

  return (
    <div className="table">
      {rows.map(tableRow)}
      <span className="date" />
      {headers.map(columnHeader)}
    </div>
  );

  function columnHeader(header: string) {
    return <span>{header}</span>;
  }

  function tableRow(row: number[], rowIndex: number) {
    return (
      <>
        <span className="date">{dates[rowIndex]}</span>
        {row.map((value, colIndex) => tableCell(colIndex, rowIndex))}
      </>
    );

    function tableCell(colIndex: number, rowIndex: number) {
      let x =
        (rows
          .slice(rowIndex - 13, rowIndex + 1)
          .map((row) => row[colIndex])
          .reduce(sum, 0) /
          population[colIndex]) *
        1e5;

      return <span className={color(x)}>{Math.round(x)}</span>;
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
