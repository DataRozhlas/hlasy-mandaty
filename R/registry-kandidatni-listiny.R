

library(foreign)
#2013
download.file("https://volby.cz/opendata/ps2013/PS2013reg20131026.zip", "2013.zip")
unzip("2013.zip")
read.dbf("PSRKL.dbf")
file.remove("PSRK.dbf")
file.remove("PSRKL.dbf")
file.remove("2013.zip")

#2010

download.file("https://volby.cz/opendata/ps2010/PS2010reg2010.zip", "2010.zip")
unzip("2010.zip")
read.dbf("PSRKL.dbf")
file.remove("PSRK.dbf")
file.remove("PSRKL.dbf")
file.remove("2010.zip")

#2006

download.file("https://volby.cz/opendata/ps2006/PS2006reg2006.zip", "2006.zip")
unzip("2006.zip")
data <- read.dbf("PSRKL.dbf") 
file.remove("PSRK.dbf")
file.remove("PSRKL.dbf")
file.remove("2006.zip")
