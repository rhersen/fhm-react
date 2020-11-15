import all from "./Folkhalsomyndigheten_Covid19.json";

export default function fetchData(): { headers: string[]; dates: string[]; rows: number[][] } {
  let cases = all["Antal per dag region"];
  let objects: { [col: string]: any }[] = cases.slice(1);

  return {
    headers: Object.values(cases[0]).slice(1) as string[],
    dates: objects.map(date),
    rows: objects.map((a) => Object.values(a).slice(1)),
  };
}

function date(row: { [col: string]: any }) {
  return row.A.substr(0, 10);
}
