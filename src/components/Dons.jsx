import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Dons() {
  const [collectes, setCollectes] = useState([])
  const [collecteId, setCollecteId] = useState("")
  const [texte, setTexte] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from('collectes')
        .select('*')
        .order('date_limite')
      if (data) {
        setCollectes(data)
        if (data.length > 0) setCollecteId(data[0].id)
      }
    }
    charger()
  }, [])

  async function donner() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage("Connecte-toi d'abord (page Vendre).")
      return
    }
    const { error } = await supabase.from('dons').insert({
      collecte_id: collecteId,
      user_id: user.id,
      description: texte,
    })
    if (error) setMessage(error.message)
    else {
      setMessage("Merci pour ton don !")
      setTexte("")
    }
  }

  return (
    <div>
      <section className="hero">
        <h1>Donne, <span>reçois</span></h1>
        <p>Offre une seconde vie à tes vêtements et chaussures, et gagne une récompense.</p>
      </section>

      <div className="grille">
        {collectes.map((c) => (
          <div className="carte" key={c.id}>
            <h3>{c.titre}</h3>
            <p>{c.description}</p>
            <p className="ville">{c.ville} · jusqu'au {c.date_limite}</p>
            <span className="badge">{c.recompense}</span>
          </div>
        ))}
      </div>

      <div className="formulaire">
        <h2>Faire un don</h2>
        <select value={collecteId} onChange={(e) => setCollecteId(e.target.value)}>
          {collectes.map((c) => (
            <option key={c.id} value={c.id}>{c.titre}</option>
          ))}
        </select>
        <input
          placeholder="Que veux-tu donner ? (ex : 5 robes, 2 paires de baskets)"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
        />
        <button onClick={donner}>Je donne</button>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Dons