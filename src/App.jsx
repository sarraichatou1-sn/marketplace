import Annonce from "./components/Annonce"
import { useEffect, useState } from "react"
import { supabase } from "./supabase"


function App() {
  const [articles, setArticles] = useState([])
  const [ville, SetVille] = useState ("Toutes")
  const [recherche, SetRecherche] = useState ("")
  const [nouveauTitre, setNouveauTitre] = useState("")
  const [nouveauPrix, setNouveauPrix] = useState("")
  const [nouvelleVille, setNouvelleVille] = useState("Dakar")

  useEffect(() => {
    async function charger() {
      const {data,error} = await supabase
        .from ('annonces')
        .select ('*')
        .order('created_at', {ascending:false})
      if (error) console.log(error)
      else setArticles(data)
  
    }
    charger()

  },[])  

  const articlesFiltres = articles.filter((a) =>
    (ville === "Toutes" || a.ville === ville) &&
    a.titre.toLowerCase().includes(recherche.toLowerCase())
  )
  async function publier() {
  const {data,error} = await supabase
    .from ('annonces')
    .insert({
      titre: nouveauTitre,
      prix: Number(nouveauPrix),
      ville: nouvelleVille,
    })
    .select()
    .single()
  if (error) {
      console.log(error)
      return
  }
    
  
  setArticles([data, ...articles])
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