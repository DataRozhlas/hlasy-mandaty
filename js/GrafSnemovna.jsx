import React from "react";
import Highcharts from "highcharts";
import highchartsItem from "highcharts/modules/item-series";
import HighchartsReact from "highcharts-react-official";

const barvicky = {
  ANO: "#4F4CAD",
  "ANO 2011": "#4F4CAD",
  ODS: "#3985DB",
  Piráti: "#5C5C5C",
  SPD: "#D29332",
  Úsvit: "#D29332",
  KSČM: "#C22034",
  ČSSD: "#F88268",
  "TOP 09": "#B577BF",
  STAN: "#7897A5",
  SZ: "#76C973",
  VV: "#84A3D6",
  Úsvit: "#D29332",
  "KDU-ČSL": "#F3CE53",
};

const data = {
  2006
   : {

  },
  2010: {

  },
  2013: {

  },
  2017: {

  }
}

function GrafSnemovna({ data, titulek }) {
  highchartsItem(Highcharts);
  const options = {
    chart: {
      type: "item",
    },
    title: {
      text: titulek,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        animation: false,
      },
    },
    legend: {
      labelFormat: '{name} <span style="opacity: 0.4">{y}</span>',
    },
    series: [
      {
        name: "poslanců",
        keys: ["name", "y", "color", "label"],
        data: data
          .sort((a, b) => {
            return a[1] < b[1] ? 1 : -1;
          })
          .map((d) => [d[0], d[1], barvicky[d[0]], d[0]]),
        dataLabels: {
          enabled: true,
          format: "{point.label}",
        },
        // Circular options
        center: ["50%", "88%"],
        size: "170%",
        startAngle: -100,
        endAngle: 100,
      },
    ],
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { maxWidth: "100%" } }}
      />
    </>
  );
}

export default GrafSnemovna;
