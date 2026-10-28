import { useState } from 'react'
import { supabase } from '../supabase'

function Pro() {
  const [type, setType] = useState("vendeur")
  const [texte, setTexte] = useState("")
  const [message, setMessage] = useState("")

  async function demander() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage("Connecte-toi d'abord (page Vendre).")
      return
    }
    const { error } = await supabase.from('demandes_pro').insert({
      user_id: user.id,
      type,
      message: texte,
    })
    setMessage(error ? error.message : "Demande envoyée, on te recontacte !")
  }

  return (
    <div>
      <section className="hero">
        <h1>Offre <span>Pro</span></h1>
        <p>Pour les vendeurs réguliers et les marques qui veulent se démarquer.</p>
      </section>

      <div className="avantages">
        <div className="carte">
          <h3>✓ Badge certifié</h3>
          <p>Un badge Pro sur toutes tes annonces pour inspirer confiance.</p>
        </div>
        <div className="carte">
          <h3>↑ Premier dans les recherches</h3>
          <p>Tes annonces apparaissent avant les autres.</p>
        </div>
        <div className="carte">
          <h3> Publicité pour les marques</h3>
          <p>Mets ta marque en avant auprès des acheteurs de SaSaP.</p>
        </div>
      </div>

      <div className="formulaire">
        <h2>Demander l'offre Pro</h2>
        <p>Prix de l'abonnement : à venir.</p>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="vendeur">Je suis vendeur/vendeuse</option>
          <option value="marque">Je suis une marque</option>
        </select>
        <input
          placeholder="Un mot sur toi ou ta marque"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
        />
        <button onClick={demander}>Envoyer ma demande</button>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Pro