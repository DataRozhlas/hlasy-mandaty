import React from "react";

function Poslanci( {krok} ) {
  switch (krok) {
    case 1:
      return null;
    case 2:
      return <div>povidy2</div>;
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

export default Poslanci;
