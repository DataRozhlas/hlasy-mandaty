import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TargetScroller from "react-target-scroller";
import Typography from "@material-ui/core/Typography";
import Akordeon from "./Akordeon.jsx";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
    },
  };
});

const kapitoly = [
  ["Voliči „rozdají karty“", "Jakou hru s nimi půjde hrát?"],
  ["Kdo se dostane sněmovny?", "A proč bylo málo koalic"],
  ["Čára mezi kandidáty a poslanci", "Mandátové/volební číslo"],
  [
    "Kolik poslanců měl který kraj?",
    "Víc obvyvatel + vyšší účast = víc mandátů",
  ],
  ["Jak se dělily mandáty?", "D'Hondtův dělitel"],
  ["Celostátní rozpočítání a dělení po krajích", "Hareova kvóta"],
  ["Celá republika jako jeden kraj", "Hagenbach-Bischoffova kvóta"],
  ["Jak by se lišilo zastoupení ve sněmovně?", ""],
];

function Kalkulacka() {
  const classes = useStyles();
  const isFirstRun = useRef(true);

  //state
  const [krok, setKrok] = useState(1);
  const [scrollTarget, setScrollTarget] = useState("");

  //side effects
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setTimeout(() => setScrollTarget(`#panel${krok}a-header`), 500);
  }, [krok]);

  //funkce
  return (
    <div className={classes.root}>
      <TargetScroller target={scrollTarget} offset={40} />
      {kapitoly.map((kapitola, i) => (
        <Akordeon
          key={i}
          id={i + 1}
          nadpis={kapitola[0]}
          podnadpis={kapitola[1]}
          posledni={i + 1 === kapitoly.length}
          krok={krok}
          setKrok={setKrok}
        />
      ))}
    </div>
  );
}

export default Kalkulacka;
