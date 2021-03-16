import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function SelectKraj({ vybranykraj, setVybranykraj, vysledek }) {
  const classes = useStyles();
  const zmenKraj = (event) => {
    setVybranykraj(event.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="select-kraj-label">Vyberte kraj</InputLabel>
      <Select
        labelId="select-kraj-label"
        id="select-kraj"
        value={vybranykraj}
        onChange={zmenKraj}
      >
        {vysledek &&
          vysledek.KRAJ.map((kraj) => {
            return (
              <MenuItem
                key={kraj._attributes.CIS_KRAJ}
                value={kraj._attributes.NAZ_KRAJ}
              >
                {kraj._attributes.NAZ_KRAJ}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}

export default SelectKraj;
