import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function SimpleSelect() {
  const classes = useStyles();
  const [rok, setRok] = React.useState(2017);

  const handleChange = (event) => {
    setRok(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-rok-label">Sněmovní volby</InputLabel>
        <Select
          labelId="select-rok-label"
          id="select-rok"
          value={rok}
          onChange={handleChange}
        >
          <MenuItem value={2017}>2017 (vítěz ANO s A. Babišem)</MenuItem>
          <MenuItem value={2013}>2013 (vítěz ČSSD s B. Sobotkou)</MenuItem>
          <MenuItem value={2010}>2010 (vítěz ČSSD s J. Paroubkem)</MenuItem>
          <MenuItem value={2006}>2006 (vítěz ODS s M. Topolánkem)</MenuItem>
          <MenuItem value={2002}>2002 (vítěz ČSSD s V. Špidlou)</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default SimpleSelect;
