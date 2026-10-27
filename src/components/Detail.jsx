import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'

function Detail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)

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

  return (
    <div className="detail">
      {article.image_url && <img src={article.image_url} />}
      <div>
        <h2>{article.titre}</h2>
        <p className="prix">{article.prix} FCFA</p>
        <p>{article.ville}</p>
        <button>Acheter</button>
        <p><Link to="/articles">← Retour aux articles</Link></p>
      </div>
    </div>
  )
}

export default Detail