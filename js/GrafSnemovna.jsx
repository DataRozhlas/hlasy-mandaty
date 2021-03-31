import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsItem from "highcharts/modules/item-series";

const barvicky = {
  ANO: "#5A4DB3",
  "ANO 2011": "#5A4DB3",
  ODS: "#287AD7",
  Piráti: "#666666",
  SPD: "#F1A713",
  Úsvit: "#F1A713",
  KSČM: "#D42B3C",
  ČSSD: "#FB9179",
  "TOP 09": "#AC5DAC",
  STAN: "#6A99AF",
  SZ: "#5DBF5A",
  VV: "#84A3D6",
  Úsvit: "#D29332",
  "KDU-ČSL": "#F4D63E",
};

const data = {
  2006: {
    dhondt: [
      ["ODS", 81],
      ["ČSSD", 74],
      ["KSČM", 26],
      ["KDU-ČSL", 13],
      ["SZ", 6],
    ],
    benda: [
      ["ODS", 81],
      ["ČSSD", 73],
      ["KSČM", 26],
      ["KDU-ČSL", 12],
      ["SZ", 8],
    ],
    poslanci: [
      ["ODS", 75],
      ["ČSSD", 69],
      ["KSČM", 27],
      ["KDU-ČSL", 15],
      ["SZ", 14],
    ],
    vnitro: [
      ["ODS", 76],
      ["ČSSD", 69],
      ["KSČM", 27],
      ["KDU-ČSL", 15],
      ["SZ", 13],
    ],
  },
  2010: {
    dhondt: [
      ["ČSSD", 56],
      ["ODS", 53],
      ["TOP 09", 41],
      ["KSČM", 26],
      ["VV", 24],
    ],
    benda: [
      ["ČSSD", 57],
      ["ODS", 50],
      ["TOP 09", 42],
      ["KSČM", 26],
      ["VV", 25],
    ],
    poslanci: [
      ["ČSSD", 54],
      ["ODS", 50],
      ["TOP 09", 41],
      ["KSČM", 28],
      ["VV", 27],
    ],
    vnitro: [
      ["ČSSD", 54],
      ["ODS", 50],
      ["TOP 09", 41],
      ["KSČM", 28],
      ["VV", 27],
    ],
  },
  2013: {
    dhondt: [
      ["ČSSD", 50],
      ["ANO 2011", 47],
      ["KSČM", 33],
      ["TOP 09", 26],
      ["ODS", 16],
      ["KDU-ČSL", 14],
      ["Úsvit", 14],
    ],
    benda: [
      ["ČSSD", 49],
      ["ANO 2011", 44],
      ["KSČM", 36],
      ["TOP 09", 27],
      ["KDU-ČSL", 15],
      ["ODS", 15],
      ["Úsvit", 14],
    ],
    poslanci: [
      ["ČSSD", 47],
      ["ANO 2011", 43],
      ["KSČM", 34],
      ["TOP 09", 27],
      ["ODS", 18],
      ["Úsvit", 16],
      ["KDU-ČSL", 15],
    ],
    vnitro: [
      ["ČSSD", 47],
      ["ANO 2011", 43],
      ["KSČM", 34],
      ["TOP 09", 27],
      ["ODS", 18],
      ["Úsvit", 16],
      ["KDU-ČSL", 15],
    ],
  },
  2017: {
    dhondt: [
      ["ANO", 78],
      ["ODS", 25],
      ["Piráti", 22],
      ["SPD", 22],
      ["ČSSD", 15],
      ["KSČM", 15],
      ["KDU-ČSL", 10],
      ["TOP 09", 7],
      ["STAN", 6],
    ],
    benda: [
      ["ANO", 69],
      ["ODS", 24],
      ["Piráti", 24],
      ["SPD", 23],
      ["KSČM", 16],
      ["ČSSD", 15],
      ["KDU-ČSL", 11],
      ["STAN", 9],
      ["TOP 09", 9],
    ],
    poslanci: [
      ["ANO", 63],
      ["ODS", 24],
      ["Piráti", 23],
      ["SPD", 23],
      ["KSČM", 17],
      ["ČSSD", 16],
      ["KDU-ČSL", 12],
      ["STAN", 11],
      ["TOP 09", 11],
    ],
    vnitro: [
      ["ANO", 63],
      ["ODS", 24],
      ["Piráti", 23],
      ["SPD", 23],
      ["KSČM", 17],
      ["ČSSD", 16],
      ["KDU-ČSL", 12],
      ["STAN", 11],
      ["TOP 09", 11],
    ],
  },
};

function GrafSnemovna({ titulek, rok, metoda, jeMobil }) {
  const pripravData = (data, rok, metoda, barvicky) => {
    const vybranaData = data[String(rok)][metoda];
    const obarvenaData = vybranaData.map((d) => {
      const dhondt = data[String(rok)].dhondt.filter(
        (f) => f[0] === d[0]
      )[0][1];
      return [
        d[0],
        d[1],
        barvicky[d[0]],
        `${
          dhondt > d[1]
            ? `${d[0]} (${d[1] - dhondt})`
            : dhondt < d[1]
            ? `${d[0]} (+${d[1] - dhondt})`
            : d[0]
        }`,
      ];
    });
    return obarvenaData;
  };

  highchartsItem(Highcharts);
  const options = {
    chart: {
      type: "item",
      animation: false,
    },
    title: {
      text: titulek,
    },
    credits: {
      enabled: false,
    },
    legend: {
      itemWidth: jeMobil ? 160 : null,
      labelFormat: jeMobil
        ? '<span style="opacity: 0.4">{y}</span> {label}'
        : '{name} <span style="opacity: 0.4">{y}</span>',
    },
    plotOptions: {
      item: {
        point: {
          events: {
            legendItemClick: function (e) {
              e.preventDefault();
            },
          },
        },
      },
    },
    series: [
      {
        name: "poslanců",
        keys: ["name", "y", "color", "label"],
        data: pripravData(data, rok, metoda, barvicky),
        dataLabels: {
          enabled: jeMobil ? false : true,
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
        immutable={true}
      />
    </>
  );
}

export default GrafSnemovna;
