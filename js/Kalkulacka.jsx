import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DalsiButton from "./DalsiButton.jsx";
import SimpleSelect from "./SimpleSelect.jsx";
import GrafStran from "./GrafStran.jsx";

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
  const [vysledek, setVysledek] = React.useState();
  const [postupuji, setPostupuji] = React.useState([]);
  const [rok, setRok] = React.useState(2017);
  const stahniData = (rok) => {
    fetch(`https://data.irozhlas.cz/hlasy-mandaty/data/vysledky${rok}.json`)
      .then((response) => response.json())
      .then((data) => {
        setVysledek(data.VYSLEDKY);
      });
  };
  React.useEffect(() => {
    stahniData(2017);
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    panel === "panel2" && zjistiPostupujiciStrany(vysledek);
    panel === "panel3" && zjistiPostupujiciStrany(vysledek);
    setExpanded(isExpanded ? panel : false);
  };
  const dalsiButtonClick = (e) => {
    const cislo = expanded.match(/\d+/);
    handleChange(`panel${Number(cislo[0]) + 1}`)(e, true);
  };
  const zjistiPostupujiciStrany = (vysledek) => {
    const result = vysledek.CR.STRANA.filter(
      (strana) => strana.HODNOTY_STRANA._attributes.PROC_HLASU > 5
    ).sort(
      (a, b) =>
        a.HODNOTY_STRANA._attributes.HLASY < b.HODNOTY_STRANA._attributes.HLASY
    );
    setPostupuji(result);
  };
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
            1. Voliči &bdquo;rozdají karty&ldquo; 🗳️
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Záleží na přepočtu, jakou hru s nimi půjde hrát.
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Totožný výsledek voleb 🍏🍏🍏🍎🍎🍌🍒🍐🍋 může vést k odlišnému
            rozložení sil ve sněmovně 🍏🍏🍏🍏🍎🍎🍎🍌🍌🍒, a tedy i k jiné
            vládě 🍏🍏🍏🍏🍌. Záleží na způsobu přepočtení hlasů na mandáty.{" "}
            <strong>
              Vyberte, které sněmovní volby si s námi chcete přepočítat
            </strong>
            .
          </Typography>
          <SimpleSelect
            stahniData={stahniData}
            rok={rok}
            setRok={setRok}
          ></SimpleSelect>

          <Typography>
            {vysledek &&
              `${
                vysledek.CR.STRANA.length
              } politických stran obdrželo ${vysledek.CR.UCAST._attributes.PLATNE_HLASY.toLocaleString(
                "cs-CZ"
              )} platných hlasů`}
          </Typography>
          <GrafStran vysledek={vysledek}></GrafStran>
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
            2. Kdo se dostane sněmovny? 🧑🏽‍⚖️
          </Typography>
          <Typography className={classes.secondaryHeading}>
            A proč bylo málo koalic.
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography paragraph={true}>
            {`V roce ${rok}, který jste si vybrali, překonalo hranici pro vstup do sněmovny ${postupuji.length} stran:`}
          </Typography>
          <List dense={true} disablePadding={true}>
            {postupuji.map((strana) => {
              return (
                <ListItem key={strana._attributes.KSTRANA} dense={true}>
                  <ListItemText
                    primary={strana._attributes.NAZ_STR}
                    secondary={`${strana.HODNOTY_STRANA._attributes.PROC_HLASU.toLocaleString(
                      "cs-CZ"
                    )} %, tj. ${strana.HODNOTY_STRANA._attributes.HLASY.toLocaleString(
                      "cs-CZ"
                    )} hlasů`}
                  />
                </ListItem>
              );
            })}
          </List>
          <Typography paragraph={true}>
            Strana musí na celostátní úrovni dosáhnout hranice 5 % hlasů. Dokud
            ji{" "}
            <Link
              href="https://www.usoud.cz/fileadmin/user_upload/Tiskova_mluvci/Publikovane_nalezy/2021/Pl._US_44_17_vcetne_disentu.pdf"
              target="_blank"
            >
              Ústavní soud nezrušil
            </Link>
            , platila zvýšená <em>uzavírací klauzule</em>, tedy vyšší práh pro
            vstup do sněmovny, pro všechny koalice. Dvoučlenné musely získat 10
            %, tříčlenné 15 % a početnější 20 % hlasů.
          </Typography>
          <Typography paragraph={true}>
            Přísné pravidlo přispělo k tomu, že za posledních patnáct let
            kandidovala do sněmovny jedna jediná koalice: Koalice pro Českou
            republiku se skládala ze sedmi subjektů a zíkala 8 140 hlasů. Starší
            volební výsledky v této aplikaci nejsou, protože je{" "}
            <Link href="https://volby.cz/opendata/opendata.htm" target="_blank">
              ČSÚ nepublikuje ve standardním otevřeném formátu
            </Link>
            .
          </Typography>
          <Typography paragraph={true}>
            <Link
              href="https://apps.odok.cz/veklep-detail?pid=ALBSBYGDNBUX"
              target="_blank"
            >
              Návrh ministerstva vnitra
            </Link>
            , který už schválila vláda, a teď ho ve výborech posuzují poslanci,
            počítá v obou svých variantách se snížením hranice pro dvoukoalice
            na 7 % hlasů, u trojkoalic na 9 % a u větších uskupení na 11 %
            hlasů.{" "}
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
            3. Kolik hlasů na poslance 🧮
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Mandátové/volební číslo.
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography paragraph={true}>
            Teď je potřeba zjistit aspoň přibližně, kolik hlasů
            &bdquo;stojí&ldquo; jedno místo v poslanecké sněmovně. Až do
            únorového{" "}
            <Link
              href="https://www.usoud.cz/fileadmin/user_upload/Tiskova_mluvci/Publikovane_nalezy/2021/Pl._US_44_17_vcetne_disentu.pdf"
              target="_blank"
            >
              rozhodnutí Ústavního soudu
            </Link>{" "}
            k tomu sloužilo <em>republikové mandátové číslo</em>. To se počítalo tak, že
            se součet všech platných hlasů vydělil počtem poslanců, tedy 200.
          </Typography>
          <Typography paragraph={true}>
            V roce {rok}, který jste si vybrali v prvním kroku, vypadá výpočet
            následovně:
          </Typography>
          <Typography paragraph={true}>
            {vysledek &&
              `${vysledek.CR.UCAST._attributes.PLATNE_HLASY.toLocaleString(
                "cs-CZ"
              )} : 200 = ${(
                vysledek.CR.UCAST._attributes.PLATNE_HLASY / 200
              ).toLocaleString("cs-CZ")}`}
          </Typography>
          <Typography paragraph={true}>
            {vysledek &&
              `Výsledek se zaokrouhloval na jednotky. Vychází nám tedy republikové mandátové číslo ${Math.round(
                vysledek.CR.UCAST._attributes.PLATNE_HLASY / 200
              ).toLocaleString("cs-CZ")}.`}
          </Typography>
          <Typography paragraph={true}>
            Podle{" "}
            <Link
              href="https://apps.odok.cz/veklep-detail?pid=ALBSBYGDNBUX"
              target="_blank"
            >
              návrhu ministerstva vnitra
            </Link>{" "}
            by se nově pojmenované <em>volební číslo</em> počítalo odlišně: Počtem poslanců by se
            nedělily všechny hlasy, ale <em>jen hlasy pro strany a koalice, které
            postoupily do sněmovny</em>. Nezaokrouhlovalo by se na celá čísla, ale na dvě desetinná místa směrem nahoru. 
          </Typography>
          <Typography paragraph={true}>
              {postupuji.length>0 &&  `V našem příkladu by volební číslo vycházelo na ${postupuji.reduce((acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY, 0).toLocaleString("cs-CZ")} : 200 = ${(Math.ceil(postupuji.reduce((acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY, 0)/200*100)/100).toLocaleString("cs-CZ")}.`}
          </Typography>
          <Typography paragraph={true}>
              {postupuji.length>0 &&  `Pokud by poslanci schválili druhou variantu ministerstva vnitra a celá republika by byla jeden volební kraj, dělily by se počty hlasů počtem poslanců zvýšeným o jedna: ${postupuji.reduce((acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY, 0).toLocaleString("cs-CZ")} : 201 = ${(Math.ceil(postupuji.reduce((acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY, 0)/201*100)/100).toLocaleString("cs-CZ")}.`}
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
            4. 
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
            5. 
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
            6. 
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
            7. 
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
