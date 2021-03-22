import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => {
  return {
    boxik: {
      borderLeft: "0.2rem solid",
      paddingLeft: "1rem",
      borderColor: "#6200ea",
      alignSelf: "flex-start",
    },
  };
});

const url =
  "https://www.zakonyprolidi.cz/cs/1995-247/zneni-20190302#cast1-oddil2";

function Dhondt({ krok }) {
  const classes = useStyles();
  switch (krok) {
    case false:
      return null;
    case 1:
      return null;
    case 2:
      return (
        <>
          <Typography paragraph={true} className={classes.boxik}>
            Podle{" "}
            <Link href={url} target="_blank">
              dosavadních pravidel
            </Link>{" "}
            strany musí na celostátní úrovni dostat aspoň 5 % hlasů. Dokud ji na
            začátku února{" "}
            <Link
              href="https://www.usoud.cz/fileadmin/user_upload/Tiskova_mluvci/Publikovane_nalezy/2021/Pl._US_44_17_vcetne_disentu.pdf"
              target="_blank"
            >
              Ústavní soud nezrušil
            </Link>
            , platila zvýšená <em>uzavírací klauzule</em>, tedy vyšší práh pro
            vstup do sněmovny, pro všechny koalice složené z více stran.
            Dvoučlenné musely získat 10 %, tříčlenné 15 % a početnější 20 %
            hlasů.
          </Typography>
        </>
      );
    case 3:
      return <div>povidy3</div>;
    case 4:
      return <div>povidy4</div>;
    case 5:
      return <div>povidy5</div>;
    case 6:
      return <div>povidy6</div>;
    case 7:
      return <div>povidy7</div>;
    case 8:
      return <div>povidy8</div>;
  }
}

export default Dhondt;
