import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import DalsiButton from "./DalsiButton.jsx";
import UvodniSlovo from "./UvodniSlovo.jsx";
import Dhondt from "./Dhondt.jsx";
import Benda from "./Benda.jsx";
import Poslanci from "./Poslanci.jsx";
import Vnitro1 from "./Vnitro1.jsx";
import Vnitro2 from "./Vnitro2.jsx";
import Senat from "./Senat.jsx";
import ZaverecneSlovo from "./ZaverecneSlovo.jsx";

const useStyles = makeStyles((theme) => {
  return {
    heading: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: 700,
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    accordionDetailsInside: {
      flexDirection: "column",
      alignItems: "center",
    },
  };
});

function Akordeon({
  id,
  nadpis,
  podnadpis,
  posledni,
  krok,
  setKrok,
  rok,
  setRok,
  vysledky,
  setScrollTarget
}) {
  const classes = useStyles();

  const [kraj, setKraj] = useState("Karlovarský");

  const handleChange = (panel) => (event, isExpanded) => {
    setKrok(isExpanded ? panel : false);
  };

  const dalsiButtonClick = function (e) {
    setKrok(krok + 1);
  };

  const postupuji = vysledky.CR.strana
    .filter((strana) => strana.proc > 5)
    .sort((a, b) => (a.proc < b.proc ? 1 : -1));

  const hlasyPostupujici = postupuji.reduce((acc, curr) => acc + curr.hlasy, 0);

  const republikoveCislo = Math.round(vysledky.CR.hlasy / 200);

  const volebniCislo = Math.round(((hlasyPostupujici / 200) * 100) / 100);

  const krajeDhondt = (vysledky, jenSoucet, kraj) => {
    const kraje = vysledky.kraje.map((kraj) => {
      return {
        id: kraj.id,
        nazev: kraj.nazev,
        hlasy: kraj.hlasy,
        deleni: kraj.hlasy / republikoveCislo,
        zbytek: kraj.hlasy % republikoveCislo,
        mandaty: kraj.mandaty,
      };
    });
    if (kraj) return kraje.filter((i) => i.nazev === kraj)[0].mandaty;
    const rozdelenoNapoprve = kraje.reduce(
      (acc, curr) => acc + Math.floor(curr.deleni),
      0
    );
    const zbyva = 200 - rozdelenoNapoprve;
    if (jenSoucet) return zbyva;
    const krajeSerazene = kraje.sort((a, b) => (a.zbytek < b.zbytek ? 1 : -1));
    const result = krajeSerazene.map((kraj, i) => {
      return { ...kraj, extramandat: i < zbyva };
    });
    return result.sort((a, b) => (a.mandaty < b.mandaty ? 1 : -1));
  };

  return (
    <Accordion expanded={krok === id} onChange={handleChange(id)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${id}a-content`}
        id={`panel${id}a-header`}
      >
        <Typography className={classes.heading}>
          {`${id}. ${nadpis}`}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          {podnadpis}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetailsInside}>
        <UvodniSlovo
          krok={krok}
          rok={rok}
          setRok={setRok}
          vysledky={vysledky}
          postupuji={postupuji}
          krajeDhondt={krajeDhondt}
        />
        <Dhondt
          krok={krok}
          rok={rok}
          vysledky={vysledky}
          postupuji={postupuji}
          kvota={republikoveCislo}
          krajeDhondt={krajeDhondt}
          kraj={kraj}
          setKraj={setKraj}
        />
        <Benda
          krok={krok}
          rok={rok}
          vysledky={vysledky}
          postupuji={postupuji}
          kvota={republikoveCislo}
          kraj={kraj}
          setKraj={setKraj}
        />
        <Poslanci
          krok={krok}
          vysledky={vysledky}
          postupuji={postupuji}
          hlasyPostupujici={hlasyPostupujici}
          kvota={volebniCislo}
        />
        <Senat
          krok={krok}
          vysledky={vysledky}
          postupuji={postupuji}
          hlasyPostupujici={hlasyPostupujici}
          kvota={volebniCislo}
        />
        <Vnitro1
          krok={krok}
          vysledky={vysledky}
          postupuji={postupuji}
          hlasyPostupujici={hlasyPostupujici}
          kvota={volebniCislo}
        />
        <Vnitro2
          krok={krok}
          vysledky={vysledky}
          postupuji={postupuji}
          hlasyPostupujici={hlasyPostupujici}
          kvota={volebniCislo}
        />
        <ZaverecneSlovo krok={krok} />

        {posledni ? null : (
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default Akordeon;
