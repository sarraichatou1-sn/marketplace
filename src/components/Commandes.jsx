import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Commandes() {
  const [commandes, setCommandes] = useState([])

  useEffect(() => {
    async function charger() {
      const { data, error } = await supabase
        .from('commandes')
        .select('*, annonces(titre)')
        .order('created_at', { ascending: false })
      if (error) console.log(error)
      else setCommandes(data)
    }
    charger()
  }, [])

  return (
    <div className="formulaire">
      <h2>Mes commandes</h2>
      {commandes.length === 0 && <p>Aucune commande pour l'instant.</p>}
      {commandes.map((c) => (
        <p key={c.id}>
          {c.annonces?.titre} : {c.prix + c.frais} FCFA ({c.statut})
        </p>
      ))}
    </div>
  )
}

export default Commandes