import "./App.css";
import React from "react";
import population from "./population";

class App extends React.Component<
  {},
  {
    headers: string[];
    dates: string[];
    rows: number[][];
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      headers: [],
      dates: [],
      rows: [],
    };
  }

  componentDidMount() {
    fetch("/.netlify/functions/fauna")
      .then((faunaResp) => faunaResp.json())
      .then(
        (json) => {
          let [headerObject, ...dataObjects]: { [col: string]: any }[] = json[
            "Antal per dag region"
          ];
          let [, ...headers] = Object.values(headerObject);

          this.setState({
            headers,
            dates: dataObjects.map((obj) => obj.A.substr(0, 10)),
            rows: dataObjects.map(Object.values).map(([, ...row]) => row),
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            headers: [error.toString()],
          });
        }
      );
  }

  render() {
    let { headers, dates, rows } = this.state;

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
            .slice(rowIndex - 6, rowIndex + 1)
            .map((row) => row[colIndex])
            .reduce(sum, 0) /
            population[colIndex] /
            7) *
          1e6;

        return <span className={color(x)}>{Math.round(x)}</span>;
      }
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
