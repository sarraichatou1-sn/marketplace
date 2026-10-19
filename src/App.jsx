import Annonce from "./components/Annonce"
import { useState } from "react"

const articlesDepart= [
  {id:1, titre:"Robe ohPolly", prix:15000, ville:"Dakar"},
  {id:2, titre:"Set Lululemon", prix:8000, ville:"Thies"},
  {id:3, titre:"Basket numeris", prix:15000, ville:"Dakar"},
  {id:4, titre:"jean ZARA", prix:10000, ville:"Mbour"},
]
function App() {
  const [articles, setArticles] = useState(articlesDepart)
  const [ville, SetVille] = useState ("Toutes")
  const [recherche, SetRecherche] = useState ("")
  const [nouveauTitre, setNouveauTitre] = useState("")
  const [nouveauPrix, setNouveauPrix] = useState("")
  const [nouvelleVille, setNouvelleVille] = useState("Dakar")

  const articlesFiltres = articles.filter((a) =>
    (ville === "Toutes" || a.ville === ville) &&
    a.titre.toLowerCase().includes(recherche.toLowerCase())
  )
  function publier() {
  const article = {
    id: Date.now(),
    titre: nouveauTitre,
    prix: Number(nouveauPrix),
    ville: nouvelleVille,
  }
  setArticles([article, ...articles])
  setNouveauTitre("")
  setNouveauPrix("")
}


  return (
    <div>
      <h1>Sasap</h1>
      <p>Bienvenue sur ma marketplace</p>
      <h2>Publier une annonce</h2>
      <input
      placeholder="Titre"
      value={nouveauTitre}
      onChange={(e) => setNouveauTitre(e.target.value)}
      />
      <input
      placeholder="Prix"
      type="number"
      value={nouveauPrix}
      onChange={(e) => setNouveauPrix(e.target.value)}
      />
      <select value={nouvelleVille} onChange={(e) => setNouvelleVille(e.target.value)}>
        <option>Dakar</option>
        <option>Mbour</option>
        <option>Thies</option>
      </select>
      <button onClick={publier}>Publier</button>
    
      <input 
      placeholder="Rechercher un article..."
      value={recherche}
      onChange={(e) => SetRecherche(e.target.value)}
      />

      <select value={ville} onChange={(e) => SetVille(e.target.value)}>
        <option>Toutes</option>
        <option>Dakar</option>
        <option>Mbour</option>
        <option>Thies</option>
      </select>

      {articlesFiltres.map((a) => (
        <Annonce key={a.id} titre={a.titre} prix={a.prix} ville={a.ville} />
      ))}
    </div>
  )
}

export default App