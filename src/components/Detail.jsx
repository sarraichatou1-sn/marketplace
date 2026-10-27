import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { calculerFrais } from '../frais'

function Detail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function charger() {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('id', id)
        .single()
      if (error) console.log(error)
      else setArticle(data)
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

  return (
    <div className="detail">
      {article.image_url && <img src={article.image_url} />}
      <div>
        <h2>{article.titre}</h2>
        <p className="prix">{article.prix} FCFA</p>
        <p>Frais de service : {calculerFrais(article.prix)} FCFA</p>
        <p><strong>Total : {article.prix + calculerFrais(article.prix)} FCFA</strong></p>
        <p>{article.ville}</p>
        <button onClick={acheter}>Acheter</button>
        <p>{message}</p>
        <p><Link to="/articles">← Retour aux articles</Link></p>
      </div>
    </div>
  )
}

export default Detail