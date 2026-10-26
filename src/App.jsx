import Annonce from "./components/Annonce"
import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import Auth from "./components/Auth"


function App() {
  const [articles, setArticles] = useState([])
  const [ville, SetVille] = useState ("Toutes")
  const [recherche, SetRecherche] = useState ("")
  const [nouveauTitre, setNouveauTitre] = useState("")
  const [nouveauPrix, setNouveauPrix] = useState("")
  const [nouvelleVille, setNouvelleVille] = useState("Dakar")
  const [session, setSession] = useState(null)
  const [photo, setPhoto] = useState(null)

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const articlesFiltres = articles.filter((a) =>
    (ville === "Toutes" || a.ville === ville) &&
    a.titre.toLowerCase().includes(recherche.toLowerCase())
  )
  async function publier() {

    let imageUrl = null
    if (photo) {
      const extension = photo.name.split('.').pop()
      const nomFichier = `${session.user.id}/${Date.now()}.${extension}`
      const { error: erreurPhoto } = await supabase.storage
        .from('photos')
        .upload(nomFichier, photo)
      if (erreurPhoto) {
        console.log(erreurPhoto)
        return
      }
      imageUrl = supabase.storage.from('photos').getPublicUrl(nomFichier).data.publicUrl
    }
  const {data,error} = await supabase
    .from ('annonces')
    .insert({
      titre: nouveauTitre,
      prix: Number(nouveauPrix),
      ville: nouvelleVille,
      user_id: session.user.id,
      image_url: imageUrl,
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
  setPhoto(null)
  }


  return (
    <div>
      <h1>Sasap</h1>
      <p>Bienvenue sur ma marketplace</p>
      {session ? (
        <div>
          <p>Connecte : {session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()}>Se deconnecter</button>
        </div>
      ) : (
        <Auth />
      )}
      {session && (
        <div>
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
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
             />
            <button onClick={publier}>Publier</button>
        </div>
      )}

    
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
        <Annonce key={a.id} titre={a.titre} prix={a.prix} ville={a.ville} image={a.image_url} />
      ))}
    </div>
  )
}

export default App