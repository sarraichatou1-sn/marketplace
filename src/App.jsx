import Annonce from "./components/Annonce"
import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import Auth from "./components/Auth"
import './App.css'
import { NavLink, Routes, Route} from "react-router-dom"
import Detail from "./components/Detail"

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
  async function supprimer(id) {
    const { error } = await supabase.from('annonces').delete().eq('id', id)
    if (error) {
      console.log(error)
      return
    }
    setArticles(articles.filter((a) => a.id !== id))
  }

  const grille = (
    <div className="grille">
      {articlesFiltres.map((a) => (
        <Annonce key={a.id} titre={a.titre} prix={a.prix} ville={a.ville} image={a.image_url} estMienne={session && a.user_id === session.user.id} onSupprimer={() => supprimer(a.id)} id={a.id} />
      ))}
    </div>
  )

  return (
    <div>
      <header className="entete">
      <img src="/logo.png" alt="SaSaP" className="logo" />
      <nav>
        <NavLink to="/" end>Accueil</NavLink>
        <NavLink to="/articles">Articles</NavLink>
        <NavLink to="/vendre">Vendre</NavLink>
        <NavLink to="/pro">Pro</NavLink>
        <NavLink to="/messagerie">Messagerie</NavLink>
      </nav>
      </header>
      <Routes>

        <Route path="/" element={
          <>
            <section className="hero">
              <h1>
                Solou akk <span>sa poche</span>
              </h1>
              <p>
                La mode qui respecte votre poche. Achète, vends et donne une seconde vie
                à tes vêtements, chaussures et sacs.
              </p>
            </section>
            {grille}
          </>
        }>
        </Route>
        <Route path="/article/:id" element={<Detail />} />
        <Route path="/articles" element={
          <>
            <div className="recherche">
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
            </div>
            {grille}
          </>
        }>
        </Route>
        <Route path="/vendre" element={
          <>
            {session ? (
            <div className="formulaire">
              <p>Connecte : {session.user.email}</p>
              <button onClick={() => supabase.auth.signOut()}>Se deconnecter</button>
            </div>
          ) : (
            <Auth />
          )}

          {session && (
            <div className="formulaire">
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

          </>

        } />
        <Route path="/pro" element={<h2 className="page">Offre Pro : bientôt disponible</h2>} />
        <Route path="/messagerie" element={<h2 className="page">Messagerie : bientôt disponible</h2>} />
      </Routes>


    

      <footer className="pied">
      <div>
        <strong>SaSaP Sn</strong>
        <p>Solou akk sa poche. La mode qui respecte votre poche.</p>
        <p>Sénégal-Dakar</p>
      </div>
      <div>
        <h4>Marketplace</h4>
        <p>Parcourir</p>
        <p>Vendre</p>
        <p>Offre Pro</p>
      </div>
      <div>
        <h4>Aide</h4>
        <p>Moyens de paiement</p>
        <p>Sécurité et confiance</p>
      </div>
      </footer>

    </div>
  )
}

export default App