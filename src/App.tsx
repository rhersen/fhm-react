import "./App.css";
import React, { FC, useEffect, useState } from "react";
import population from "./population";

export const App: FC = () => {
  const [status, setStatus] = useState<string>("idle");
  const [headers, setHeaders] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [rows, setRows] = useState<number[][]>([]);

  useEffect(() => {
    setStatus("loading");
    fetch("/.netlify/functions/fauna").then((faunaResp) => {
      setStatus(`loaded ${faunaResp.ok}`);
      if (!faunaResp.ok) {
        return faunaResp.text().then((error) => {
          setStatus(error.toString());
        });
      }

      return faunaResp.json().then(
        (json) => {
          let [headerObject, ...dataObjects]: {
            [col: string]: any;
          }[] = json["Antal per dag region"];
          let [, ...headers] = Object.values(headerObject);

          setHeaders(headers);
          setDates(dataObjects.map((obj) => obj.A.substr(0, 10)));
          setRows(dataObjects.map(Object.values).map(([, ...row]) => row));
        },
        (error) => {
          setStatus(error.toString());
        }
      );
    });
  }, []);

  return (
    <>
      <div className="status">{status}</div>
      <div className="table">
        {rows.map(tableRow)}
        <span className="date" />
        {headers.map(columnHeader)}
      </div>
    </>
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
          .slice(rowIndex - 6, rowIndex + 1)
          .map((row) => row[colIndex])
          .reduce(sum, 0) /
          population[colIndex] /
          7) *
        1e6;

      return <span className={color(x)}>{Math.round(x)}</span>;

      function sum(a: number, b: number) {
        return a + b;
      }

      function color(x: number) {
        for (let i = 960; i >= 60; i /= 2) if (x > i) return "color" + i;
        if (x > 20) return "color20";
        if (x > 0) return "color1";
        return "color0";
      }
    }
  }
};

export default App;
