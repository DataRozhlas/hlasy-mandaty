import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import GrafSnemovna from "./GrafSnemovna.jsx";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  };
});

function InfoPanel() {
  const classes = useStyles();

  const [rokPanel, setRokPanel] = useState(2017);

  const zmenRok = (event) => {
    setRokPanel(event.target.value);
  };

  return (
    <>
      <Box className={classes.root} style={{justifyContent: "center"}}>
        <FormControl className={classes.formControl}>
          <InputLabel id="select-panelrok-label">Vyberte rok</InputLabel>
          <Select
            labelId="select-panelrok-label"
            id="select-panelrok"
            value={rokPanel}
            onChange={zmenRok}
          >
            <MenuItem value={2017}>2017</MenuItem>
            <MenuItem value={2013}>2013</MenuItem>
            <MenuItem value={2010}>2010</MenuItem>
            <MenuItem value={2006}>2006</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className={classes.root}>
        <Box style={{ maxWidth: 520, width: "100%" }} mb={4}>
          <GrafSnemovna
            rok={rokPanel}
            metoda={"dhondt"}
            titulek={`${rokPanel}, skutečnost (D'Hondt)`}
            jeMobil={true}
          ></GrafSnemovna>
        </Box>
        <Box style={{ maxWidth: 520, width: "100%" }} mb={4}>
          <GrafSnemovna
            rok={rokPanel}
            metoda={"benda"}
            titulek={`${rokPanel}, návrh poslance Bendy`}
            jeMobil={true}
          ></GrafSnemovna>
        </Box>
        <Box style={{ maxWidth: 520, width: "100%" }} mb={4}>
          <GrafSnemovna
            rok={rokPanel}
            metoda={"poslanci"}
            titulek={`${rokPanel}, návrh poslanců KDU-ČSL`}
            jeMobil={true}
          ></GrafSnemovna>
        </Box>
        <Box style={{ maxWidth: 520, width: "100%" }} mb={4}>
          <GrafSnemovna
            rok={rokPanel}
            metoda={"vnitro"}
            titulek={`${rokPanel}, republika jako jeden kraj`}
            jeMobil={true}
          ></GrafSnemovna>
        </Box>
      </Box>
    </>
  );
}

export default InfoPanel;
