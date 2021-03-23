import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TargetScroller from "react-target-scroller";
import Typography from "@material-ui/core/Typography";
import Akordeon from "./Akordeon.jsx";
import data from "./../data/2017.json";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
    },
  };
});

const jeMobil = window.innerWidth < 768;

const kapitoly = [
  ["Voliči „rozdají karty“", "Jakou hru s nimi půjde hrát?"],
  ["Kdo se dostane sněmovny?", "A proč tak málo koalic"],
  ["Čára mezi kandidáty a poslanci", "Mandátové číslo a jiné kvóty"],
  [
    "Kolik poslanců má mít který kraj?",
    "Rozhodoval počet obyvatel a účast",
  ],
  ["První dělení mandátů mezi strany", ""],
  ["Celostátní rozpočítání a dělení po krajích", ""],
  ["Celá republika jako jeden kraj", ""],
  ["Jak by se lišilo zastoupení ve sněmovně?", ""],
];

function Kalkulacka() {
  const classes = useStyles();
  const prvniBehScroll = useRef(true);
  const prvniBehLoad = useRef(true);

  //STATE
  const [krok, setKrok] = useState(5);
  const [scrollTarget, setScrollTarget] = useState();
  const [rok, setRok] = useState(2017);
  const [vysledky, setVysledky] = useState(data);

  //SIDE EFFECTS

  //fetch data
  useEffect(() => {
    if (prvniBehLoad.current) {
      prvniBehLoad.current = false;
      return;
    }
    fetch(`https://data.irozhlas.cz/hlasy-mandaty/data/${rok}.json`)
      .then((response) => response.json())
      .then((data) => {
        setVysledky(data);
      });
  }, [rok]);

  //scrolling
  useEffect(() => {
    if (prvniBehScroll.current) {
      prvniBehScroll.current = false;
      return;
    }
    setTimeout(() => setScrollTarget(`#panel${krok}a-header`), 500);
  }, [krok]);

  //funkce
  return (
    <div className={classes.root}>
      <TargetScroller target={scrollTarget} offset={jeMobil ? 0 : 40} />
      {kapitoly.map((kapitola, i) => (
        <Akordeon
          key={i}
          id={i + 1}
          nadpis={kapitola[0]}
          podnadpis={kapitola[1]}
          posledni={i + 1 === kapitoly.length}
          krok={krok}
          setKrok={setKrok}
          rok={rok}
          setRok={setRok}
          vysledky={vysledky}
        />
      ))}
    </div>
  );
}

export default Kalkulacka;