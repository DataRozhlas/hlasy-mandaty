import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

function ZaverecneSlovo({ krok }) {
  switch (krok) {
    case false:
        return null;
    case 1:
      return null;
    case 2:
      return (
        <>
          <Typography paragraph={true}>
            Všechny návrhy obsahují pojistku pro případ, že by se do sněmovny
            dostala jen jedna strana. V takovém případě se hranice vstupu
            snižuje.{" "}
          </Typography>
          <Typography paragraph={true}>
            Donedávna platná nejpřísnější koaliční klauzule v Evropě přispěla k
            tomu, že za posledních patnáct let kandidovala do sněmovny jenom
            jedna: Koalice pro Českou republiku se skládala ze sedmi subjektů a
            v roce 2006 získala 8 140 hlasů – na postup do sněmovny by jí
            (těsně) nestačilo ani o milon hlasů víc.
          </Typography>
          <Typography paragraph={true}>
            Do letošních voleb se chystají dvě koalice, kterým předvolební
            průzkumy dávají naději, že by mohly překonat i původní vysokou
            vstupní bariéru: jednou jsou Piráti a Starostové, druhou SPOLU (ODS,
            KDU-ČSL a TOP 09).
          </Typography>
        </>
      );
    case 3:
      return null;
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

export default ZaverecneSlovo;
