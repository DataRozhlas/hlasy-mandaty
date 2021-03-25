import React from "react";
import Highcharts from "highcharts";
import blueGrey from '@material-ui/core/colors/red'
import highchartsItem from "highcharts/modules/item-series"
import HighchartsReact from "highcharts-react-official";



function GrafSnemovna({ data, titulek }) {
  if (data) {
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
      legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>',
      },
      series: [
        {
          name: "poslanců",
          keys: ["name", "y"],
          data: data,
          dataLabels: {
            enabled: true,
            format: "{point.name}",
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
  } else return null;
}

export default GrafSnemovna;
