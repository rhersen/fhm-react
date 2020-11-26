import "./App.css";
import React, { FC, useEffect, useState } from "react";
import population from "./population";

export const App: FC = () => {
  const [status, setStatus] = useState<string>("idle");
  const [headers, setHeaders] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [rows, setRows] = useState<number[][]>([]);
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    setStatus("loading");
    fetch("/.netlify/functions/fauna").then(
      (faunaResp: Response): Promise<void> => {
        setStatus(`loaded ${faunaResp.ok}`);
        if (!faunaResp.ok) {
          return faunaResp.text().then((error: string): void => {
            setStatus(error);
          });
        }

        return faunaResp.json().then(
          (json: any): void => {
            let [headerObject, ...dataObjects]: {
              [col: string]: any;
            }[] = json["Antal per dag region"];
            let [, ...headers] = Object.values(headerObject);

            setRows(
              dataObjects
                .map(Object.values)
                .map(([, ...row]: number[]): number[] => row)
            );

            setHeaders(headers);
            setDates(
              dataObjects.map((obj: { [col: string]: any }): string =>
                obj.A.substr(0, 10)
              )
            );
          },
          (error: any): void => {
            setStatus(error.toString());
          }
        );
      }
    );
  }, []);

  let yScale = 0.75;
  let yValues = Array.from({ length: 7 }).map((value, i) => (i + 1) * 100);

  let f = (a: number[], pop: number) =>
    (a.slice(-7).reduce((a, b) => a + b, 0) / 7 / pop) * 1e6;

  return (
    <>
      <div className="status">{status}</div>
      {selected === -1 ? (
        <div className="table">
          <span className="date" />
          {headers.map(columnHeader)}
          {rows.map((row: number[], rowIndex: number) => (
            <>
              <span className="date">{dates[rowIndex]}</span>
              {row.map((value, colIndex) => {
                let a = rows
                  .slice(rowIndex - 13, rowIndex + 1)
                  .map((row) => row[colIndex]);
                  let x = f(a, population[colIndex]);
                return <span className={color(x)}>{Math.round(x)}</span>;
              })}
            </>
          ))}
          <span className="date" />
          {headers.map(columnHeader)}
        </div>
      ) : (
        <>
          <button onClick={() => setSelected(-1)}>back</button>
          <div>{headers[selected]}</div>
          <div className="chart">
            <div className="y-values">
              {yValues.map((y) => (
                <div className="y-value">{y}</div>
              ))}
            </div>
            <svg viewBox="0 0 800 600">
              {yValues.map((y) => (
                <line x1="0" y1={y * yScale} x2="800" y2={y * yScale}></line>
              ))}

              <polyline
                fill="none"
                stroke="#c3227d"
                points={rows
                  .map(
                    (row: number[], rowIndex: number) =>
                      (rowIndex * 800) / rows.length +
                      "," +
                      (600 -
                        (row[selected] / population[selected]) * 1e6 * yScale)
                  )
                  .join(" ")}
              />
            </svg>
          </div>
        </>
      )}
    </>
  );

  function columnHeader(header: string, i: number) {
    return <span onClick={() => setSelected(i)}>{header}</span>;
  }

  function color(x: number) {
    for (let i = 960; i >= 60; i /= 2) if (x > i) return "color" + i;
    if (x > 20) return "color20";
    if (x > 0) return "color1";
    return "color0";
  }
};

export default App;
