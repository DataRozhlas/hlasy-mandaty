##############################
# Model pro vypocet mandatu ##
# Ondrej Tybl, Unor 2020    ##
# tybl@karlin.mff.cuni.cz   ##
##############################

# Porovnani metod d'Hondtovy, Hagenbach - Bishoffovy a celorepublikove metody

### Vymaz promenne

rm(list=ls())

### Knihovny

library(readxl)

### Funkce

zpracovani_vstupu <- function(data_preference, strany) {
  
  data_preference["Hodnota"] <- lapply(data_preference["Hodnota"], as.numeric)
  
  # Kontrola vstupu
  if (length(unique(data_preference$Format)) > 1) {
    print("Sloupec 'formát' zadán nesprávně.")
  }
  
  format <- data_preference$Format[1]
  
  if ((format == "PROCENTO") & (sum(data_preference$Hodnota) != 1)) {
    print("Vstup zadán v procentech, ale nesečte se na 1.")
  }
  
  # Data obsahuji kategorii OSTATNI
  if (!(is.element("OSTATNI", data_preference$Strana))) {
    data_preference[nrow(data_preference) + 1,] = c("OSTATNI", format, 0)
  }
  
  # Data obsahuji pouze zname strany (jinak pridat respondenty do OSTATNI)
  for(i in 1:nrow(data_preference)) {
    strana <- as.character(data_preference[i, "Strana"])
    hodnota <- as.numeric(data_preference[i, "Hodnota"])
    if (!(strana%in%unique(strany$Strana))) {
      
      # Pridat respondenty do kategorie OSTATNI
      data_preference[data_preference["Strana"] == "OSTATNI", "Hodnota"] <- data_preference[data_preference["Strana"] == "OSTATNI", "Hodnota"] + hodnota
      
      # Smazat zaznam
      data_preference <- data_preference[data_preference["Strana"] != strana, ]
    }
    
  }
  
  data_preference <- merge(data_preference, strany, by = "Strana")
  
  # Ve sloupci 'Preference' ulozime procentualni vyjadreni (tj. pokud format=="PROCENTO", pak se pouze prekopiruje sloupec 'Hodnota')
  data_preference["Preference"] <- data_preference$Hodnota/sum(data_preference$Hodnota)
  data_preference["Relevance"] <- (data_preference$Strana != "OSTATNI") & (data_preference$Preference/sum(data_preference$Preference) >= 0.05)
  # TODO: az budeme pocitat boost, tak vratit vypocet Relevance az za generovani
  
  return(data_preference)
}

mandaty_okrsek_dhondt <- function(data_preference_okrsek, mandatu_celkem) {
  
  # Pro kazdy delitel spocitat podil a cele ulozit do "podily"
  podily_vse <- data.frame(Strana=character(0), Delitel=integer(0), Podil=numeric(0))
  for (delitel in 1:mandatu_celkem) {
    delitele <- replicate(nrow(data_preference_okrsek), delitel)
    podily <- data_preference_okrsek$Preference/delitel*as.integer(data_preference_okrsek$Relevance) # Nerelevantni strany maji "podil==0"
    strany <- data_preference_okrsek$Strana
    
    podily_delitel <- data.frame(
      Strana=strany,
      Delitel=delitele,
      Podil=podily
    )
    
    podily_vse <- rbind(podily_vse, podily_delitel)
    
  }
  
  # Seradit dle podilu a priradit mandaty
  podily_vse <- podily_vse[with(podily_vse, order(-Podil)), ]
  podily_vse["Mandatu"] <- replicate(nrow(podily_vse), 0)
  podily_vse["Mandatu"][1:mandatu_celkem, ] <- 1
  
  # Spocitat mandaty pro stranu
  rtn <- aggregate(Mandatu ~ Strana, podily_vse, sum)
  names(rtn) <- c("Strana", "Mandatu")

  return(rtn)
}

odhadni_mandatu_v_kraji <- function(mandaty_kraje_historicke) {
  
  # Odhad je roven poctu mandatu v roce 2017
  
  mandaty_kraje_odhad <- mandaty_kraje_historicke[mandaty_kraje_historicke$Rok == 2017, c("Kraj", "Mandatu")]
  return(mandaty_kraje_odhad)
}

odhadni_koeficient_kraje <- function(vysledky_historicke) {
  
  # Koeficient kraje se vypocte na zaklade voleb 2017
  
  vysledky_posledni_volby <- vysledky_historicke[vysledky_historicke["Rok"] == 2017, ]

  # Secteni hlasu v novych koalicich
  koalice_1 <- c("PIRATI", "STAN")
  koalice_2 <- c("ODS", "TOP09", "KDUCSL")

  vysledky_posledni_volby_koalice <- vysledky_posledni_volby[vysledky_posledni_volby$Strana %in% c(koalice_1, koalice_2), ]
  vysledky_posledni_volby_koalice[vysledky_posledni_volby_koalice$Strana %in% koalice_1, "Strana"] <- "PIRATI_STAN"
  vysledky_posledni_volby_koalice[vysledky_posledni_volby_koalice$Strana %in% koalice_2, "Strana"] <- "SPOLU"
  vysledky_posledni_volby_koalice <- aggregate(Hlasu ~ Strana + Kraj, vysledky_posledni_volby_koalice, sum)
  vysledky_posledni_volby_koalice$Rok <- 2017
  
  vysledky_posledni_volby <- rbind(vysledky_posledni_volby, vysledky_posledni_volby_koalice)

  # Vypocet koeficientu
  cela_cr <- aggregate(Hlasu ~ Strana, vysledky_posledni_volby, sum)
  names(cela_cr) <- c("Strana", "Hlasu_cela_cr")
  cela_cr["Procent_cela_cr"] <- cela_cr$Hlasu/sum(cela_cr$Hlasu)
  
  vysledky_posledni_volby <- merge(x = vysledky_posledni_volby, y=cela_cr, by="Strana")
  
  kraje <- aggregate(Hlasu ~ Kraj, vysledky_posledni_volby, sum)
  names(kraje) <- c("Kraj", "Hlasu_kraj_celkem")
  vysledky_posledni_volby <- merge(x = vysledky_posledni_volby, y = kraje, by = "Kraj")
  
  vysledky_posledni_volby["Procent_kraj"] <- vysledky_posledni_volby$Hlasu/vysledky_posledni_volby$Hlasu_kraj_celkem
  vysledky_posledni_volby["Koeficient_kraje"] <- vysledky_posledni_volby["Procent_kraj"]/vysledky_posledni_volby["Procent_cela_cr"]

  rtn <- vysledky_posledni_volby[, c("Kraj", "Strana", "Koeficient_kraje")]
  
  # Rozlozeni pro TRIKOLORU prejate od SPD
  pomocne_trikolora <- rtn[rtn["Strana"] == "SPD", ]
  pomocne_trikolora$Strana = "TRIKOLORA"
  
  rtn <- rbind(rtn, pomocne_trikolora)
  
  return(rtn)
}

bodovy_odhad_dhondt <- function(data_preference, koeficient_kraje, mandaty_kraje) {
  
  # Pocitame mandaty po krajich, vzdy generujeme pocet respondentu (pro celou cr dohromady) v zavislosti na pruzkumu a koeficientu kraje (pocet mandatu konstantni, a to jako v roce 2017)
  n <- sum(data_preference$Hodnota*data_preference$Relevance)
  rtn <- data.frame(Strana=character(0), Mandatu=integer(0), Kraj=character(0))
  
  for (kraj in unique(koeficient_kraje$Kraj)) {
    
    koeficient_kraje_kraj <- koeficient_kraje[koeficient_kraje$Kraj == kraj, ]
    
    data_preference_odhad <- data.frame(
      Strana=data_preference$Strana,
      Preference_temp=data_preference$Preference,
      Relevance=data_preference$Relevance
    )
    data_preference_odhad <- merge(x=data_preference_odhad, y=koeficient_kraje_kraj, by="Strana")
    # (pozn.: vznikne necelociselny pocet Respondentu (nevadi, protoze nas zajimaji podily))
    data_preference_odhad$Preference <- n*data_preference_odhad$Koeficient_kraje*(data_preference_odhad$Preference_temp/sum(data_preference_odhad$Preference_temp))
    
    mandatu <- as.numeric(mandaty_kraje[mandaty_kraje["Kraj"] == kraj, "Mandatu"])
    
    rtn_kraj <- mandaty_okrsek_dhondt(data_preference_odhad, mandatu)
    rtn_kraj["Kraj"] <- kraj
    
    rtn <- rbind(rtn, rtn_kraj)
    
  }
  return(rtn)
}

bodovy_odhad_hb <- function(data_preference, vysledky_historicke_zpracovane, mandaty_kraje) {
 
  rtn <- data.frame(Strana=character(0), Mandatu=integer(0), Kraj=character(0))
  
  # Priprava dat
  n_strana <- aggregate(Hlasu ~ Strana, vysledky_historicke_zpracovane, sum)
  names(n_strana) <- c("Strana", "Celkem_hlasu_strana")
  odhad_hlasu <- vysledky_historicke_zpracovane[, c("Strana","Kraj", "Hlasu", "Celkem_hlasu_volby")]
  names(odhad_hlasu) <- c("Strana", "Kraj", "Hlasu_kraj", "Celkem_hlasu_volby")
  odhad_hlasu <- merge(odhad_hlasu, n_strana, by="Strana")
  odhad_hlasu <- merge(odhad_hlasu, data_preference[, c("Strana", "Preference", "Relevance")], by="Strana")

  # Skrutinium 1
  odhad_hlasu$Hlasu_skrutinium1 <- with(odhad_hlasu, Hlasu_kraj/Celkem_hlasu_strana*Celkem_hlasu_volby*Preference*Relevance) # Irelevantni strany maji 0 hlasu
  
  for (kraj in unique(odhad_hlasu$Kraj)) {
    
    odhad_hlasu_kraj <- odhad_hlasu[odhad_hlasu$Kraj == kraj, ]
    mandatu_kraj <- as.numeric(mandaty_kraje[mandaty_kraje["Kraj"] == kraj, "Mandatu"])
    
    rtn_kraj <- mandaty_okrsek_hb(odhad_hlasu_kraj, mandatu_kraj)
    rtn_kraj["Kraj"] <- kraj
    
    rtn <- rbind(rtn, rtn_kraj)
    
  }
  
  rtn <- aggregate(cbind(Mandatu_skrutinium1, Zbytek_hlasu_po_skrutiniu1) ~ Strana, rtn, sum)
  
  # Skrutinium 2
  mandatu_skrutinium2 <- 200 - sum(rtn$Mandatu_skrutinium1)
  volebni_cislo_skrutinium2 <- round(sum(rtn$Zbytek_hlasu_po_skrutiniu1)/(mandatu_skrutinium2 + 1), digits = 2)

  rtn$Mandatu_skrutinium2 <- floor(rtn$Zbytek_hlasu_po_skrutiniu1/volebni_cislo_skrutinium2)
  rtn$Zbytek_hlasu_po_skrutiniu2 <- rtn$Zbytek_hlasu_po_skrutiniu1 - rtn$Mandatu_skrutinium2*volebni_cislo_skrutinium2
  
  # Skrutinium 3 (i po druhej skrutiniu mohou zbyt hlasy, ty jsou prirazeny podle zbytku)
  mandatu_skrutinium3 <- mandatu_skrutinium2 - sum(rtn$Mandatu_skrutinium2)
  
  hranicni_zbytek <- rtn$Zbytek_hlasu_po_skrutiniu2[order(rtn$Zbytek_hlasu_po_skrutiniu2, decreasing=TRUE)][mandatu_skrutinium3]# Zbytek po deleni volebnim cislem ktery jeste obdrzi mandat
  
  rtn$Mandatu_skrutinium3 <- 0
  pocet_hranicnich_stran <- sum(rtn$Zbytek_hlasu_po_skrutiniu2 == hranicni_zbytek)
  rtn[rtn$Zbytek_hlasu_po_skrutiniu2 >  hranicni_zbytek, ]$Mandatu_skrutinium3 <- 1 # Mandat pro strany s vysokym zbytkem
  rtn[rtn$Zbytek_hlasu_po_skrutiniu2 ==  hranicni_zbytek, ]$Mandatu_skrutinium3 <- 1/pocet_hranicnich_stran # Strany s hranicnim zbytkem dostanou pomernou cast mandatu (odpovida v praxi nahodnemu losovani)
  
  # Soucet
  rtn$Mandatu <- rtn$Mandatu_skrutinium1 + rtn$Mandatu_skrutinium2 + rtn$Mandatu_skrutinium3
  rtn <- rtn[c("Strana", "Mandatu")]
  
  return(rtn)
}

bodovy_odhad_hb_bezokrsku <- function(data_preference) {
  
  # Skrutinium 1
  mandatu_skrutinium1 <- 200
  hlasu_skrutinium1 <- sum(data_preference[data_preference$Relevance == 1,]$Preference)
  volebni_cislo <-hlasu_skrutinium1/(mandatu_skrutinium1 + 1)
  
  data_preference$Mandatu_skrutinium1 <- floor(data_preference$Preference/volebni_cislo*data_preference$Relevance)
  data_preference$Zbytek_po_deleni <- data_preference$Preference/volebni_cislo*data_preference$Relevance - data_preference$Mandatu_skrutinium1
  
  # Skrutinium 2
  mandatu_skrutinium2 <- mandatu_skrutinium1 - sum(data_preference$Mandatu_skrutinium1)
  hranicni_zbytek <- data_preference$Zbytek_po_deleni[order(data_preference$Zbytek_po_deleni, decreasing=TRUE)][mandatu_skrutinium2]# Zbytek po deleni volebnim cislem ktery jeste obdrzi mandat
  
  data_preference$Mandatu_skrutinium2 <- 0
  pocet_hranicnich_stran <- sum(data_preference$Zbytek_po_deleni == hranicni_zbytek)
  
  if (mandatu_skrutinium2 > 0) {
    data_preference[data_preference$Zbytek_po_deleni ==  hranicni_zbytek, ]$Mandatu_skrutinium2 <- 1/pocet_hranicnich_stran # Strany s hranicnim zbytkem dostanou pomernou cast mandatu (odpovida v praxi nahodnemu losovani)
  }
  if (mandatu_skrutinium2 > 1) {
    data_preference[data_preference$Zbytek_po_deleni >  hranicni_zbytek, ]$Mandatu_skrutinium2 <- 1 # Mandat pro strany s vysokym zbytkem
  }

  # Soucet
  data_preference$Mandatu <- data_preference$Mandatu_skrutinium1 + data_preference$Mandatu_skrutinium2
  rtn <- data_preference[c("Strana", "Mandatu")]
  return(rtn)
  
}

mandaty_okrsek_hb <- function(odhad_hlasu_kraj, mandatu_kraj) {
  
  # Skrutinium 1
  hlasu_skrutinium <- sum(odhad_hlasu_kraj$Hlasu_skrutinium1)
  volebni_cislo <- round(hlasu_skrutinium/(mandatu_kraj + 1), digits = 2)
  
  odhad_hlasu_kraj$Mandatu_skrutinium1 <- floor(odhad_hlasu_kraj$Hlasu_skrutinium1/volebni_cislo)
  odhad_hlasu_kraj$Zbytek_hlasu_po_skrutiniu1 <- odhad_hlasu_kraj$Hlasu_skrutinium1 - odhad_hlasu_kraj$Mandatu_skrutinium1*volebni_cislo
  
  rtn <- odhad_hlasu_kraj[c("Strana", "Mandatu_skrutinium1", "Zbytek_hlasu_po_skrutiniu1")]
  return(rtn)
  
}

zpracuj_vysledky_historicke <- function(vysledky_historicke) {
  
  # Vypocet je pouze na zaklade voleb 2017
  
  vysledky_posledni_volby <- vysledky_historicke[vysledky_historicke["Rok"] == 2017, ]
  vysledky_posledni_volby$Celkem_hlasu_volby <- sum(vysledky_posledni_volby$Hlasu)
  
  # Secteni hlasu v novych koalicich
  koalice_1 <- c("PIRATI", "STAN")
  koalice_2 <- c("ODS", "TOP09", "KDUCSL")
  
  vysledky_posledni_volby_koalice <- vysledky_posledni_volby[vysledky_posledni_volby$Strana %in% c(koalice_1, koalice_2), ]
  vysledky_posledni_volby_koalice[vysledky_posledni_volby_koalice$Strana %in% koalice_1, "Strana"] <- "PIRATI_STAN"
  vysledky_posledni_volby_koalice[vysledky_posledni_volby_koalice$Strana %in% koalice_2, "Strana"] <- "SPOLU"
  vysledky_posledni_volby_koalice <- aggregate(Hlasu ~ Strana + Kraj, vysledky_posledni_volby_koalice, sum)
  vysledky_posledni_volby_koalice$Rok <- 2017
  vysledky_posledni_volby_koalice$Celkem_hlasu_volby <- sum(vysledky_posledni_volby$Hlasu)
  
  vysledky_posledni_volby <- rbind(vysledky_posledni_volby, vysledky_posledni_volby_koalice)
  
  # Pridani novych stran (pridame TRIKOLORU se stejnym rozlozenim hlasu jako SPD)
  
  vysledky_posledni_volby_nove <- vysledky_posledni_volby[vysledky_posledni_volby$Strana %in% c("SPD"), ]
  vysledky_posledni_volby_nove$Strana <- "TRIKOLORA"
  vysledky_posledni_volby_nove$Rok <- 2017
  vysledky_posledni_volby_nove$Celkem_hlasu_volby <- sum(vysledky_posledni_volby$Hlasu)
  
  
  vysledky_posledni_volby <- rbind(vysledky_posledni_volby, vysledky_posledni_volby_nove)

  return(vysledky_posledni_volby)
  
}

####### Run

# Zpracovani vstupu
setwd("M:/R/volebni_model_v2")
data_preference_vstup <- data.frame(read_excel("priklad_volebni_pruzkum.xls"))
strany <- data.frame(read_excel("seznam_stran.xls"))
data_preference <- zpracovani_vstupu(data_preference_vstup, strany)

# Odhad mandatu na kraj
mandaty_kraje_historicke <- data.frame(read_excel("mandaty_kraje_historicke.xls"))
mandaty_kraje <- odhadni_mandatu_v_kraji(mandaty_kraje_historicke)

# Odhad sily strany v kraji
vysledky_historicke <- data.frame(read_excel("vysledky_historicke.xls"))
koeficient_kraje <- odhadni_koeficient_kraje(vysledky_historicke)
vysledky_historicke_zpracovane <- zpracuj_vysledky_historicke(vysledky_historicke)

# d'Hondt s okrsky
vysledky_dhondt <- aggregate(Mandatu ~ Strana, bodovy_odhad_dhondt(data_preference, koeficient_kraje, mandaty_kraje), sum)
names(vysledky_dhondt) <- c("Strana", "Mandatu_dhondt")

# Hagenbach - Bishoff s okrsky
vysledky_hbokrsky <- aggregate(Mandatu ~ Strana, bodovy_odhad_hb(data_preference, vysledky_historicke_zpracovane, mandaty_kraje), sum)
names(vysledky_hbokrsky) <- c("Strana", "Mandatu_hbokrsky")

# Hagenbach - Bishoff cela CR
vysledky_hbcelacr <- bodovy_odhad_hb_bezokrsku(data_preference)
names(vysledky_hbcelacr) <- c("Strana", "Mandatu_hbcelacr")

# Spojit vysledky
vysledky_vse <- merge(vysledky_dhondt, vysledky_hbokrsky, by="Strana")
vysledky_vse <- merge(vysledky_vse, vysledky_hbcelacr, by="Strana")

vysledky_vse

