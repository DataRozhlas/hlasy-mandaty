import "./byeie"; // loučíme se s IE
import React from "react";
import ReactDOM from "react-dom";
import Kalkulacka from "./Kalkulacka.jsx";
import InfoPanel from "./InfoPanel.jsx";

ReactDOM.render(
  <InfoPanel />,
document.getElementById('infopanel')
);

ReactDOM.render(
    <Kalkulacka />,
  document.getElementById('kalkulacka')
);


/*
// snadné načtení souboru pro každého!
fetch("https://blabla.cz/blabla.json")
  .then(response => response.json()) // nebo .text(), když to není json
  .then(data => {
    // tady jde provést s daty cokoliv
  });
*/
