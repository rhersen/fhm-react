import "./App.css";
import React, { FC, useEffect, useState } from "react";
import population from "./population";

export const App: FC = () => {
  const [status, setStatus] = useState<string>("idle");
  const [headers, setHeaders] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [rolling7, setRolling7] = useState<number[][]>([]);
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    setStatus("loading");
    fetch("/.netlify/functions/fana").then(
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

            let rows: number[][] = dataObjects
              .map(Object.values)
              .map(([, ...row]: number[]): number[] => row);

            let rolling7 = rows.map(
              (column: number[], rowIndex: number): number[] =>
                column.map(
                  (value: number, colIndex: number): number =>
                    rows
                      .slice(rowIndex - 6, rowIndex + 1)
                      .map((row: number[]): number => row[colIndex])
                      .reduce((a: number, b: number): number => a + b, 0) / 7
                )
            );

            setHeaders(headers);
            setDates(
              dataObjects.map((obj: { [col: string]: any }): string =>
                obj.A.substr(0, 10)
              )
            );
            setRolling7(rolling7);
          },
          (error: any): void => {
            setStatus(error.toString());
          }
        );
      }
    );
  }, []);

  let yScale = 0.75;
  let start = 210;
  let sliced = rolling7.slice(start);

  let yValues = Array.from({ length: 7 }).map((value, i) => (i + 1) * 100);

  return (
    <>
      <div className="status">{status}</div>
      {selected === -1 ? (
        <div className="table">
          <span className="date" />
          {headers.map(columnHeader)}
          {sliced.map(tableRow)}
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
                points={sliced
                  .map(
                    (row: number[], rowIndex: number) =>
                      (rowIndex * 800) / sliced.length +
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

  function tableCell(colIndex: number, rowIndex: number) {
    let x = (sliced[rowIndex][colIndex] / population[colIndex]) * 1e6;

    return <span className={color(x)}>{Math.round(x)}</span>;

    function color(x: number) {
      for (let i = 960; i >= 60; i /= 2) if (x > i) return "color" + i;
      if (x > 20) return "color20";
      if (x > 0) return "color1";
      return "color0";
    }
  }

  function tableRow(row: number[], rowIndex: number) {
    return (
      <>
        <span className="date">{dates.slice(start)[rowIndex]}</span>
        {row.map((value, colIndex) => tableCell(colIndex, rowIndex))}
      </>
    );
  }
};

export default App;
