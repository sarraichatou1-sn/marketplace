import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { calculerFrais } from '../frais'

function Detail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [message, setMessage] = useState("")
  const [texteMessage, setTexteMessage] = useState("")
  const [info, setInfo] = useState("")
  const [vendeur, setVendeur] = useState("")

  useEffect(() => {
    async function charger() {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('id', id)
        .single()
      if (error) console.log(error)
      else {
        setArticle(data)
        if (data.user_id) {
          const { data: membre } = await supabase
            .from('membres')
            .select('pseudo')
            .eq('id', data.user_id)
            .single()
          if (membre) setVendeur(membre.pseudo)
        }
      }
    }
    charger()
  }, [id])

  if (!article) return <p className="page">Chargement...</p>

  async function acheter() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    setMessage("Connecte-toi d'abord (page Vendre) pour acheter.")
    return
  }
  const { error } = await supabase.from('commandes').insert({
    annonce_id: article.id,
    acheteur_id: user.id,
    prix: article.prix,
    frais: calculerFrais(article.prix),
  })
  setMessage(error ? error.message : "Commande enregistrée !")
  }

  async function contacter() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    setInfo("Connecte-toi d'abord (page Vendre).")
    return
  }
  if (!article.user_id) {
    setInfo("Ce vendeur n'est pas joignable.")
    return
  }
  if (user.id === article.user_id) {
    setInfo("C'est ton annonce.")
    return
  }
  const { error } = await supabase.from('messages').insert({
    annonce_id: article.id,
    expediteur_id: user.id,
    destinataire_id: article.user_id,
    texte: texteMessage,
  })
  if (error) setInfo(error.message)
  else {
    setInfo("Message envoyé !")
    setTexteMessage("")
  }
}

  return (
    <div className="detail">
      {article.image_url && <img src={article.image_url} />}
      <div>
        <h2>{article.titre}</h2>
        <p className="prix">{article.prix} FCFA</p>
        <p>Frais de service : {calculerFrais(article.prix)} FCFA</p>
        <p><strong>Total : {article.prix + calculerFrais(article.prix)} FCFA</strong></p>
        <p>{article.ville}</p>
        {vendeur && <p>Vendu par <strong>{vendeur}</strong></p>}
        <button onClick={acheter}>Acheter</button>
        <input
          placeholder="Écris au vendeur..."
          value={texteMessage}
          onChange={(e) => setTexteMessage(e.target.value)}
        />
        <button onClick={contacter}>Contacter le vendeur</button>
        <p>{info}</p>
        <p>{message}</p>
        <p><Link to="/articles">← Retour aux articles</Link></p>
      </div>
    </div>
  )
}

export default Detail