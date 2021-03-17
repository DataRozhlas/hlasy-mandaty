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
import TargetScroller from 'react-target-scroller';

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
  const [scrollTarget, setScrollTarget] = React.useState();
  const [vysledek, setVysledek] = React.useState();
  const [postupuji, setPostupuji] = React.useState([]);
  const [rok, setRok] = React.useState(2017);
  const [postaru, setPostaru] = React.useState({});
  const [uzka, setUzka] = React.useState({});
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
    setExpanded(isExpanded ? panel : false);
    panel != "panel1" && zjistiPostupujiciStrany(vysledek, spoctiUzkou);
    panel != "panel1" && spoctiPostaru(vysledek);
    setTimeout(() => setScrollTarget(`#${panel}a-header`), 500);
    
    // panel != "panel1" && spoctiUzkou(postupuji);
  };
  const dalsiButtonClick = (e) => {
    e.preventDefault();
    const cislo = expanded.match(/\d+/);
    handleChange(`panel${Number(cislo[0]) + 1}`)(e, true);
  };
  const zjistiPostupujiciStrany = (vysledek, callback) => {
    const result = vysledek.CR.STRANA.filter(
      (strana) => strana.HODNOTY_STRANA._attributes.PROC_HLASU > 5
    ).sort((a, b) =>
      a.HODNOTY_STRANA._attributes.HLASY < b.HODNOTY_STRANA._attributes.HLASY
        ? 1
        : -1
    );
    setPostupuji(result);
    callback(result, dopocitejUzkeMandaty);
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
          mandaty: mandaty.sort((a, b) => (a.delitel < b.delitel ? 1 : -1)),
        };
      }),
    });
  };

  const spoctiUzkou = (postupuji, callback) => {
    const result = {
      ...uzka,
      strany: postupuji.map((strana) => {
        const volebniCislo =
          Math.ceil(
            (postupuji.reduce(
              (acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY,
              0
            ) /
              200) *
              100
          ) / 100;
        const volebniCislo2 =
          Math.ceil(
            (postupuji.reduce(
              (acc, curr) => acc + curr.HODNOTY_STRANA._attributes.HLASY,
              0
            ) /
              201) *
              100
          ) / 100;
        return {
          nazev: strana._attributes.NAZ_STR,
          kstrana: strana._attributes.KSTRANA,
          mandatu: Math.floor(
            strana.HODNOTY_STRANA._attributes.HLASY / volebniCislo
          ),
          zbytek: strana.HODNOTY_STRANA._attributes.HLASY % volebniCislo,
          mandatu2: Math.floor(
            strana.HODNOTY_STRANA._attributes.HLASY / volebniCislo2
          ),
          zbytek2: strana.HODNOTY_STRANA._attributes.HLASY % volebniCislo2,
        };
      }),
    };
    setUzka(result);
    callback(result);
  };

  const dopocitejUzkeMandaty = (uzka) => {
    const chybiMandatu =
      200 - uzka.strany.reduce((acc, curr) => acc + curr.mandatu, 0);
    const chybiMandatu2 =
      200 - uzka.strany.reduce((acc, curr) => acc + curr.mandatu2, 0);
    setUzka({
      ...uzka,
      stranyExtraMandaty: uzka.strany
        .sort((a, b) => (a.zbytek < b.zbytek ? 1 : -1))
        .map((strana, i) => {
          return { ...strana, extramandat: i < chybiMandatu ? 1 : 0 };
        }),
      stranyExtraMandaty2: uzka.strany
        .sort((a, b) => (a.zbytek2 < b.zbytek2 ? 1 : -1))
        .map((strana, i) => {
          return { ...strana, extramandat2: i < chybiMandatu2 ? 1 : 0 };
        }),
    });
  };

  return (
    <div className={classes.root}>
      <TargetScroller target={scrollTarget} offset={40} />
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
            1. Voliči &bdquo;rozdají karty&ldquo;
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Jakou hru s nimi půjde hrát?
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Stejný výsledek voleb může vést k mírně odlišnému rozložení sil ve
            sněmovně a případně i k různým vládám. Tady si můžete vyzkoušet, jak
            by dopadly čtvery předchozí volby, kdyby se na ně vztahovaly
            aktuálně navrhované změny ve způsobu přepočtení hlasů na mandáty.{" "}
          </Typography>
          <Typography>
            Které sněmovní volby si s námi chcete přepočítat?
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
            2. Kdo se dostane sněmovny?
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
                    )} %, ${strana.HODNOTY_STRANA._attributes.HLASY.toLocaleString(
                      "cs-CZ"
                    )} hlasů`}
                  />
                </ListItem>
              );
            })}
          </List>
          <Typography paragraph={true}>
            Strana musí na celostátní úrovni dostat aspoň 5 % hlasů. Dokud ji na
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
          <Typography paragraph={true}>
            Přísné pravidlo přispělo k tomu, že za posledních patnáct let
            kandidovala do sněmovny jenom jedna: Koalice pro Českou republiku se
            skládala ze sedmi subjektů a v roce 2006 získala 8 140 hlasů – na
            postup do sněmovny by jí (těsně) nestačilo ani o milon hlasů víc.
          </Typography>
          <Typography paragraph={true}>
            Do letošních voleb se chystají dvě koalice, kterým předvolební
            průzkumy dávají naději, že by mohly překonat i původní vysokou
            vstupní bariéru: jednou jsou Piráti a Starostové, druhou SPOLU (ODS,
            KDU-ČSL a TOP 09).
          </Typography>
          <Typography paragraph={true}>
            <Link
              href="https://apps.odok.cz/veklep-detail?pid=ALBSBYGDNBUX"
              target="_blank"
            >
              Návrh ministerstva vnitra
            </Link>
            , který už schválila vláda a teď ho ve výborech posuzují poslanci,
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
            3. Kolik hlasů na poslance
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Mandátové/volební číslo.
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography paragraph={true}>
            Teď je potřeba aspoň přibližně spočítat, kolik hlasů
            &bdquo;stojí&ldquo; jedno místo v poslanecké sněmovně. Až do
            únorového{" "}
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
              ministerstva vnitra
            </Link>{" "}
            by se v návrhu zákona nově pojmenované <em>volební číslo</em> mělo
            počítat odlišně: Počtem poslanců by se nedělily všechny platné
            hlasy, ale{" "}
            <em>
              jen hlasy pro strany a koalice, které postoupily do sněmovny
            </em>
            . Nezaokrouhlovalo by se na celá čísla, ale na dvě desetinná místa
            nahoru.
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
              `Pokud by poslanci schválili druhou variantu navrženou ministerstvem vnitra a celá republika by byla jeden volební kraj, dělilo by se navíc počtem poslanců zvýšeným o jedna: ${postupuji
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
            4. Kolik poslanců bude mít který kraj
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
          <SimpleSelect
            stahniData={stahniData}
            rok={rok}
            setRok={setRok}
          ></SimpleSelect>
          <List dense={true} disablePadding={true}>
            {vysledek &&
              vysledek.KRAJ.sort((a, b) =>
                a._attributes.POCMANDATU < b._attributes.POCMANDATU ? 1 : -1
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
            5. Dělení mandátů nejprve v krajích
          </Typography>
          <Typography className={classes.secondaryHeading}>
            D'Hondtův dělitel
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography paragraph={true}>
            Před zásahem Ústavního soudu se mandáty v krajích rozdělovaly takto:
            U každého kandidáta se počet hlasů pro jeho stranu v daném kraji
            vydělil jeho pořadím na kandidátce. Lídr kandidátky jako by měl k dispozici všechny hlasy své strany,
            druhý na kandidátce polovinu hlasů, třetí třetinu atd.
          </Typography>
          <Typography paragraph={true}>
            Výsledky tohoto dělení u všech kandidátů a všech postupujících stran se pak
            shromáždily do jedné velké tabulky a seřadily od nejvyššího k
            nejnižšímu. Kdo byl v tabulce &bdquo;nad čarou&ldquo;, tedy měl pořadové číslo
            menší nebo rovné počtu mandátů pro daný kraj, stal se poslankyní či
            poslancem. (Zanedbejme možnost posouvat se na kandidátkách pomocí
            preferenčních hlasů, kterou Ústavní soud nezrušil.)
          </Typography>
          <Typography paragraph={true}>
            {`Takhle to dopadalo ve vámi zvoleném roce ${rok} v jednotlivých krajích:`}
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
                          secondary={`${(
                            Math.round(mandat.delitel * 100) / 100
                          ).toLocaleString(
                            "cs-CZ"
                          )} (výsledek dělení ${mandat.hlasy.toLocaleString(
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
          <Typography className={classes.heading}>
            6. Dělení mandátů nejprve celostátně
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Hareova kvóta
          </Typography>
        </AccordionSummary>

        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography paragraph={true}>
            Je možné, že v podzimních volbách se bude postupovat opačně: nejdřív
            se přidělí mandáty stranám, až poté krajům. Ministerstvo vnitra
            tento návrh označuje za &bdquo;úzkou variantu&ldquo;.
          </Typography>
          <Typography paragraph={true}>
            Volebním číslem vypočítaným v kroku 3, tak zvanou Hareovou kvótou,
            se vydělí celkový počet hlasů, který každá ze stran postoupivších do
            sněmovny získala ve všech krajích. Tím se zjistí počet mandátů,
            které by při tomto přepočtu po volbách {rok} ve sněmovně měla:
          </Typography>
          <List dense={true} disablePadding={true}>
            {uzka.stranyExtraMandaty &&
              uzka.stranyExtraMandaty
                .sort((a, b) =>
                  a.mandatu + a.extramandat < b.mandatu + b.extramandat ? 1 : -1
                )
                .map((strana) => {
                  return (
                    <ListItem key={strana.kstrana} dense={true}>
                      <ListItemText
                        primary={strana.nazev}
                        secondary={`${
                          strana.mandatu + strana.extramandat
                        } mandátů ${
                          strana.extramandat > 0
                            ? `(z toho 1 ve druhém kole)`
                            : ``
                        }`}
                      />
                    </ListItem>
                  );
                })}
          </List>
          <Typography paragraph={true}>
            {`Zaokrouhluje se dolů, takže je pravděpodobné, že na konci ještě
            nějaké mandáty zbudou. V našem případě zbyly ${
              uzka.strany &&
              200 - uzka.strany.reduce((acc, curr) => acc + curr.mandatu, 0)
            }. Ty se postupně
            rozdělí stranám s největším zbytkem po dělení. Pokud má více stran
            stejný zbytek, mandát připadne té s celkově vyšším počtem hlasů.`}
          </Typography>
          <Typography paragraph={true}>
            Až poté se obdobným způsobem rozpočítají pro každou stranu mandáty v
            krajích, aby se určilo, kteří konkrétní poslanci ze kterých
            kandidátek do sněmovny postoupí.
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
            7. Celá republika jako jeden kraj
          </Typography>
          <Typography className={classes.secondaryHeading}>
            Hagenbach-Bischoffova kvóta
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Strany by nepodávaly kandidátky v každém kraji, ale jen jednu
            společnou pro celou republiku. Počet hlasů pro každý subjekt, který
            by prošel do sněmovny, by se dělil číslem 201. Výsledek zaokrouhlený
            dolů by byl počtem mandátů pro danou stranu. Mandáty, které by
            případně zbyly, by se pak rozdělily postupně stranám s největším
            zbytkem po dělení.
          </Typography>
          <List dense={true} disablePadding={true}>
            {uzka.stranyExtraMandaty2 &&
              uzka.stranyExtraMandaty2
                .sort((a, b) =>
                  a.mandatu2 + a.extramandat2 < b.mandatu2 + b.extramandat2
                    ? 1
                    : -1
                )
                .map((strana) => {
                  return (
                    <ListItem key={strana.kstrana} dense={true}>
                      <ListItemText
                        primary={strana.nazev}
                        secondary={`${
                          strana.mandatu2 + strana.extramandat2
                        } mandátů ${
                          strana.extramandat2 > 0
                            ? `(z toho 1 ve druhém kole)`
                            : ``
                        }`}
                      />
                    </ListItem>
                  );
                })}
          </List>
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
            8. Jak by se lišilo rozložení sil ve sněmovně
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetailsInside}>
          <Typography>
            Na modelu předchozích čtyř voleb se od sebe dvě varianty přepočtu
            navrhované ministerstvem vnitra odchylují jen minimálně. Tři ze čtyř
            hlasování by po přepočtu dopadla stejně, jen v roce 2006 by
            nejsilnější ODS měla o jednoho poslance méně a nejslabší strana
            Zelených o jednoho více při použití &bdquo;širší&ldquo; varianty
            celé republiky jako jediného kraje.
          </Typography>
          <Typography>
            Při srovnání navrhovaných metod s dosud používaným systémem je vidět
            větší rozdíl: Velké strany by oslabily. Například ANO by v minulých
            volbách získalo o 15 mandátů méně.
          </Typography>
          <Typography>TADY BUDE GRAF TĚCH ROZDÍLŮ!</Typography>
          <Typography>
            Nicméně je ve hvězdách, co poslanci vymyslí, může to být i něco
            úplně jiného. Ve hře je stále také senátní a poslanecký návrh.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Kalkulacka;
