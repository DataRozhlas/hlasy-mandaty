import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DalsiButton from "./DalsiButton.jsx";
import SimpleSelect from "./SimpleSelect.jsx";
import * as data from "../data/vysledky2017.json";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
    },
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

const Kalkulacka = function () {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("panel1");
  const [vysledek, setVysledek] = React.useState(data);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  function dalsiButtonClick(e) {
    const cislo = expanded.match(/\d+/);
    setExpanded(`panel${Number(cislo[0]) + 1}`);
  }
  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            1. Voliči „rozdají karty" 🗳️
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Záleží ale na přepočtu, jaké hry s nimi půjde hrát.
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Jeden výsledek voleb 🍏🍏🍏🍎🍎🍌🍒🍐🍋 může vést pokaždé k trochu
            jinému rozložení sil ve sněmovně 🍏🍏🍏🍏🍎🍎🍎🍌🍌🍒, i k jiné
            vládě 🍏🍏🍏🍏🍌. Záleží na způsobu přepočtení hlasů na mandáty.{" "}
            <strong>Vyberte, které sněmovní volby si chcete přepočítat</strong>.
          </Typography>
          <SimpleSelect setVysledek={setVysledek}></SimpleSelect>
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>
            2. Kdo dostane mandát?
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography className={classes.heading}>
            3. Mandátové číslo
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography className={classes.heading}>
            4. První skrutinium
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          <Typography className={classes.heading}>
            5. Rozdělení zbývajících mandátů
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel6"}
        onChange={handleChange("panel6")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel6a-content"
          id="panel6a-header"
        >
          <Typography className={classes.heading}>
            6. Přikázání mandátů v krajích
          </Typography>
        </AccordionSummary>

        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel7"}
        onChange={handleChange("panel7")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel7a-content"
          id="panel7a-header"
        >
          <Typography className={classes.heading}>
            7. Přikázání mandátů v krajích 2
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel8"}
        onChange={handleChange("panel8")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel8a-content"
          id="panel8a-header"
        >
          <Typography className={classes.heading}>
            8. Výsledné rozložení sil ve sněmovně
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Kalkulacka;
