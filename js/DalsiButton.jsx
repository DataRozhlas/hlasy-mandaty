import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Forward from "@material-ui/icons/Forward";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      maxWidth: "300px",
      marginTop: "1rem",
    },
  };
});

const DalsiButton = ({ onClick }) => {
  const classes = useStyles();

  return (
    <Button
      className={classes.root}
      variant="outlined"
      color="primary"
      endIcon={<Forward />}
      onClick={onClick}
    >
      Další krok
    </Button>
  );
};

export default DalsiButton;
