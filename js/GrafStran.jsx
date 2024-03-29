import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function GrafStran({ vysledky, titulek }) {
  const data = vysledky.CR.strana
    .map((strana) => [strana.zkratka, strana.hlasy])
    .sort((a, b) => (a[1] < b[1] ? 1 : -1));
  const options = {
    chart: {
      type: "bar",
      height: data.length * 20,
    },
    title: {
      text: titulek,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        animation: false,
        dataLabels: {
          enabled: true,
        },
      },
    },
    yAxis: {
      visible: false,
    },
    xAxis: {
      type: "category",
    },
    tooltip: {
      formatter: function () {
        return vysledky.CR.strana.filter(
          (strana) => strana.zkratka === this.key
        )[0].nazev;
      },
    },
    series: [
      {
        data: data,
        name: "hlasů",
        color: "#e63946",
      },
    ],
  };
  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { maxWidth: "100%" } }}
        immutable={true}
      />
    </>
  );
}

export default GrafStran;
