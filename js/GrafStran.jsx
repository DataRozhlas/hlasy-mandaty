import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function GrafStran({ vysledek }) {
  if (vysledek) {
    const data = vysledek.CR.STRANA.map((strana) => [
      strana._attributes.NAZ_STR,
      strana.HODNOTY_STRANA._attributes.HLASY,
    ]).sort((a, b) => a[1] < b[1]);
    const options = {
      chart: {
        type: "bar",
        height: data.length * 18,
      },
      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          animation: false,
        },
      },
      xAxis: {
        type: "category",
      },
      series: [
        {
          data: data,
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
  } else return null;
}

export default GrafStran;
