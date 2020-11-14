import "./App.css";
import React from "react";
import all from "./Folkhalsomyndigheten_Covid19.json";

let population: { [columnLetter: string]: any } = {
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

function color(x: number) {
  for (let i = 960; i >= 60; i /= 2) {
    if (x > i) return "color" + i;
  }
  if (x > 20) return "color20";
  if (x > 0) return "color1";
  return "color0";
}

function App() {
  let data = all["Antal per dag region"];
  let header: { [columnLetter: string]: string } = data[0] as {
    [columnLetter: string]: string;
  };
  console.log(JSON.stringify(header));
  let rows: Array<{ [columnLetter: string]: any }> = data.slice(1);
  let dates = rows.map((row) => row.A.substr(0, 10));

  let column: { [columnLetter: string]: Array<any> } = {};
  Object.keys(population).forEach((key) => {
    column[key] = rows.map(
      (row: { [columnLetter: string]: number }) => row[key]
    ) as Array<any>;
  });

  return (
    <div className="App">
      <table>
        {rows.map((row, i) => (
          <tr>
            <td>{dates[i]}</td>
            {Object.keys(population).map((key) => {
              let x =
                (column[key].slice(i - 13, i + 1).reduce((a, b) => a + b, 0) /
                  population[key]) *
                1e5;
              return <td className={color(x)}>{Math.round(x)}</td>;
            })}
          </tr>
        ))}
        <tr>
          <th>{header.A}</th>
          {Object.keys(population).map((key) => (
            <th>{header[key].substr(0, 7)}</th>
          ))}
        </tr>
      </table>
    </div>
  );
}

export default App;
