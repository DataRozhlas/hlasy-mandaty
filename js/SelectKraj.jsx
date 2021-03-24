import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { CollectionsOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  input: {
    color: "red",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    alignSelf: "center"
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function SelectKraj({ kraj, setKraj, setScrollTarget }) {
  const classes = useStyles();
  const zmenKraj = (event) => {
//    setScrollTarget(event.target);
    setKraj(event.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="select-kraj-label">Vyberte kraj</InputLabel>
      <Select
        labelId="select-kraj-label"
        id="select-kraj"
        value={kraj}
        onChange={zmenKraj}
      >
          <MenuItem value={"Středočeský"}>Středočeský</MenuItem>
          <MenuItem value={"Hl. m. Praha"}>Hl. m. Praha</MenuItem>
          <MenuItem value={"Jihočeský"}>Jihočeský</MenuItem>
          <MenuItem value={"Plzeňský"}>Plzeňský</MenuItem>
          <MenuItem value={"Karlovarský"}>Karlovarský</MenuItem>
          <MenuItem value={"Ústecký"}>Ústecký</MenuItem>
          <MenuItem value={"Liberecký"}>Liberecký</MenuItem>
          <MenuItem value={"Královéhradecký"}>Královéhradecký</MenuItem>
          <MenuItem value={"Pardubický"}>Pardubický</MenuItem>
          <MenuItem value={"Vysočina"}>Vysočina</MenuItem>
          <MenuItem value={"Jihomoravský"}>Jihomoravský</MenuItem>
          <MenuItem value={"Olomoucký"}>Olomoucký</MenuItem>
          <MenuItem value={"Zlínský"}>Zlínský</MenuItem>
          <MenuItem value={"Moravskoslezský"}>Moravskoslezský</MenuItem>
      </Select>
    </FormControl>
  );
}

export default SelectKraj;
