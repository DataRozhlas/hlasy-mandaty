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
import SelectKraj from "./SelectKraj.jsx";
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
  const [postaru, setPostaru] = React.useState({});
  const [vybranykraj, setVybranykraj] = React.useState("Středočeský");
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
    panel != "panel1" && zjistiPostupujiciStrany(vysledek);
    panel != "panel1" && spoctiPostaru(vysledek);
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
  const spoctiPostaru = (vysledek) => {
    setPostaru({
      ...postaru,
      mandatoveCislo: Math.round(
        vysledek.CR.UCAST._attributes.PLATNE_HLASY / 200
      ),
      kraje: vysledek.KRAJ.map((kraj) => {
        let mandaty = [];
        kraj.STRANA.map((strana) => {
          if (strana.POSLANEC) {
            for (
              let i = 0;
              i < strana.HODNOTY_STRANA._attributes.MANDATY;
              i++
            ) {
              mandaty.push({
                hlasy: strana.HODNOTY_STRANA._attributes.HLASY,
                id: i,
                idStrana: strana._attributes.KSTRANA,
                nazev: strana._attributes.NAZ_STR,
                delitel: strana.HODNOTY_STRANA._attributes.HLASY / (i + 1),
              });
            }
          }
        });
        return {
          cislo: kraj._attributes.CIS_KRAJ,
          nazev: kraj._attributes.NAZ_KRAJ,
          mandaty: mandaty.sort((a, b) => a.delitel < b.delitel),
        };
      }),
    });
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
            Záleží také na přepočtu, jakou hru s nimi půjde hrát.
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Stejný výsledek voleb 🍏🍏🍏🍎🍎🍌🍒🍐🍋 může vést k mírně odlišnému
            rozložení sil ve sněmovně 🍏🍏🍏🍏🍎🍎🍎🍌🍌🍒, a případně i k
            různým vládám 🍏🍏🍏🍏🍌. Tady si můžete vyzkoušet, do jaké míry by
            ovlivnily předchozí volby nyní navrhované způsoby přepočtení hlasů
            na mandáty.{" "}
            <strong>Které sněmovní volby si s námi chcete přepočítat?</strong>
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
            kandidovala do sněmovny jediná koalice: Koalice pro Českou republiku
            se skládala ze sedmi subjektů a v roce 2006 získala 8 140 hlasů – na
            vstup do sněmovny by jí (těsně) nestočilo ani o milon hlasů víc.
          </Typography>
          <Typography paragraph={true}>
            Změna tohoto pravidla by tedy výsledky posledních čtyř hlasování
            nijak neovlivnila. Starší volební výsledky v této aplikaci nejsou,
            protože je{" "}
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
            Teď je potřeba zjistit, kolik hlasů &bdquo;stojí&ldquo; jedno místo
            v poslanecké sněmovně. Až do únorového{" "}
            <Link
              href="https://www.usoud.cz/fileadmin/user_upload/Tiskova_mluvci/Publikovane_nalezy/2021/Pl._US_44_17_vcetne_disentu.pdf"
              target="_blank"
            >
              rozhodnutí Ústavního soudu
            </Link>{" "}
            k tomu sloužilo <em>republikové mandátové číslo</em>. To se počítalo
            tak, že se součet všech platných hlasů vydělil počtem poslanců, tedy
            200.
          </Typography>
          <Typography paragraph={true}>
            V roce {rok}, který jste si vybrali v prvním kroku, vypadá výpočet
            následovně:
          </Typography>
          <Typography paragraph={true}>
            {vysledek &&
              `${vysledek.CR.UCAST._attributes.PLATNE_HLASY.toLocaleString(
                "cs-CZ"
              )} hlasů : 200 poslanců = ${(
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
            by se nově pojmenované <em>volební číslo</em> počítalo odlišně:
            Počtem poslanců by se nedělily všechny platné hlasy, ale{" "}
            <em>
              jen hlasy pro strany a koalice, které postoupily do sněmovny
            </em>
            . Nezaokrouhlovalo by se na celá čísla, ale na dvě desetinná místa
            směrem nahoru.
          </Typography>
          <Typography paragraph={true}>
            {postupuji.length > 0 &&
              `V našem příkladu by volební číslo vycházelo na ${postupuji
                .reduce(
                  (acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY,
                  0
                )
                .toLocaleString("cs-CZ")} : 200 = ${(
                Math.ceil(
                  (postupuji.reduce(
                    (acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY,
                    0
                  ) /
                    200) *
                    100
                ) / 100
              ).toLocaleString("cs-CZ")}.`}
          </Typography>
          <Typography paragraph={true}>
            {postupuji.length > 0 &&
              `Pokud by poslanci schválili druhou variantu ministerstva vnitra a celá republika by byla jeden volební kraj, dělilo by se navíc počtem poslanců zvýšeným o jedna: ${postupuji
                .reduce(
                  (acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY,
                  0
                )
                .toLocaleString("cs-CZ")} : 201 = ${(
                Math.ceil(
                  (postupuji.reduce(
                    (acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY,
                    0
                  ) /
                    201) *
                    100
                ) / 100
              ).toLocaleString("cs-CZ")}.`}
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
            4. Kolik poslanců bude mít který kraj ✨
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Víc obvyvatel + vyšší účast = víc mandátů
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography paragraph={true}>
            Republikovým mandátovým číslem se před rozhodnutím Ústavního soudu
            dělil počet hlasů odevzdaných v každém kraji. Kolikrát se do něj
            vešlo, tolik mandátů kraj získal.
          </Typography>
          <Typography paragraph={true}>
            Pokud nějaké mandáty po prvním dělení zbyly, přidělily se postupně
            krajům s největším zbytkem po dělení. V případě remízy rozhodoval
            los.{" "}
          </Typography>
          <List dense={true} disablePadding={true}>
            {vysledek &&
              vysledek.KRAJ.sort(
                (a, b) => a._attributes.POCMANDATU < b._attributes.POCMANDATU
              ).map((kraj) => {
                return (
                  <ListItem key={kraj._attributes.CIS_KRAJ} dense={true}>
                    <ListItemText
                      primary={kraj._attributes.NAZ_KRAJ}
                      secondary={`${
                        kraj._attributes.POCMANDATU
                      } mandátů (${kraj.UCAST._attributes.PLATNE_HLASY.toLocaleString(
                        "cs-CZ"
                      )} platných hlasů)`}
                    />
                  </ListItem>
                );
              })}
          </List>
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
            5. Rozdělení mandátů v krajích 🔪
          </Typography>
          <Typography className={classes.secondaryHeading}>
            D'Hondtův dělitel
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography paragraph={true}>
            Před zásahem Ústavního soudu se mandáty v krajích rozdělovaly takto:
            Počet hlasů pro danou stranu v daném kraji se postupně dělil pořadím
            na kandidátce, tedy čísly 1, 2, 3... až počet kandidátů. Výsledky
            všech kandidátů všech stran se pak shromáždily do jedné velké
            tabulky a seřadily.
          </Typography>
          <Typography paragraph={true}>
            Kdo v ní byl &bdquo;nad čarou&ldquo;, tedy měl pořadové číslo menší
            nebo rovné počtu mandátů pro daný kraj, stal se poslankyní či
            poslancem. (Teď zanedbejme možnost posouvat se na kandidátkách
            pomocí preferenčních hlasů, kterou Ústavní soud nezrušil.)
          </Typography>
          <SelectKraj
            vybranykraj={vybranykraj}
            setVybranykraj={setVybranykraj}
            vysledek={vysledek}
          ></SelectKraj>
          {
            <List dense={true} disablePadding={true}>
              {Object.entries(postaru).length > 0 &&
                postaru.kraje
                  .filter((kraj) => kraj.nazev === vybranykraj)[0]
                  .mandaty.map((mandat, i) => {
                    return (
                      <ListItem
                        key={`${mandat.idStrana}-${mandat.id}`}
                        dense={true}
                      >
                        <ListItemText
                          primary={`${i + 1}. mandát získává ${mandat.nazev}`}
                          secondary={`${mandat.delitel.toFixed()} (${mandat.hlasy.toLocaleString(
                            "cs-CZ"
                          )} hlasů : ${mandat.id + 1}. místo na kandidátce)`}
                        />
                      </ListItem>
                    );
                  })}
            </List>
          }
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
          <Typography className={classes.heading}>6.</Typography>
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
          <Typography className={classes.heading}>7.</Typography>
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
