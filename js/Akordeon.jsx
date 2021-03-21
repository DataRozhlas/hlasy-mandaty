import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DalsiButton from "./DalsiButton.jsx";
import Typography from "@material-ui/core/Typography";

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

function Akordeon({ id, nadpis, podnadpis, posledni, krok, setKrok }) {
  const classes = useStyles();

  const handleChange = (panel) => (event, isExpanded) => {
    setKrok(isExpanded ? panel : false);
  };

  const dalsiButtonClick = function (e) {
    setKrok(krok + 1);
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
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
        {posledni ? null : (
          <DalsiButton onClick={dalsiButtonClick}></DalsiButton>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default Akordeon;
