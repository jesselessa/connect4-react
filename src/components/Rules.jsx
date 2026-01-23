//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//                          RULES.JSX                             //
//                      LINKED TO APP.JSX                         //
//              DEFINES GAME RULES ON THE LEFT SIDE               //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// React
import React from "react";
// Image
import children from "../assets/images/children.png";

class Rules extends React.Component {
  render() {
    return (
      <aside className="gameRules">
        <div className="logoTitle">
          <p className="title">
            <span className="letterM">M</span>
            <span className="letterB">B</span>
          </p>
          <p className="subtitle">JEUX</p>
        </div>

        <div className="ref">
          <img className="children" src={children} alt="children" />
          <p>6 ans-Adulte</p>
          <p className="players">2 joueurs</p>
          <div className="separator"></div>
        </div>

        <div className="rules">
          <p>
            <span>But du jeu :</span> Alignez 4 jetons de votre couleur
            (horizontalement, verticalement ou diagonalement) avant l'ordinateur.
          </p>
          <p>
            <span>Déroulement :</span> Choisissez qui commence, puis placez
            vos jetons à tour de rôle. L'IA (jetons jaunes) tentera de vous bloquer !
          </p>
          <p>
            <span>Fin de partie :</span> Si la grille est pleine sans alignement,
            le match est nul. Cliquez sur <span>"Reset"</span> pour retenter votre chance.
          </p>
        </div>
      </aside>
    );
  }
}

export default Rules;
