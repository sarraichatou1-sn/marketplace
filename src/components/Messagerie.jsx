import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Messagerie() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [reponses, setReponses] = useState({})
  const [pseudos, setPseudos] = useState({})

  async function charger() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (!user) return
    const { data } = await supabase
      .from('messages')
      .select('*, annonces(titre)')
      .order('created_at', { ascending: true })
    if (data) {
        setMessages(data)
        const ids = [...new Set(data.map((m) =>
            m.expediteur_id === user.id ? m.destinataire_id : m.expediteur_id
        ))]
        if (ids.length > 0) {
            const { data: membres } = await supabase
                .from('membres').select('*').in('id', ids)
            if (membres) {
            const table = {}
            membres.forEach((p) => { table[p.id] = p.pseudo })
            setPseudos(table)
            }
        } 
    }
  }

  useEffect(() => {
    charger()
  }, [])

  const conversations = {}
  if (user) {
    messages.forEach((m) => {
      const autre = m.expediteur_id === user.id ? m.destinataire_id : m.expediteur_id
      const cle = `${m.annonce_id}-${autre}`
      if (!conversations[cle]) {
        conversations[cle] = {
          annonce_id: m.annonce_id,
          titre: m.annonces?.titre,
          autre,
          liste: [],
        }
      }
      conversations[cle].liste.push(m)
    })
  }

  async function repondre(cle, conv) {
    const texte = reponses[cle]
    if (!texte) return
    const { error } = await supabase.from('messages').insert({
      annonce_id: conv.annonce_id,
      expediteur_id: user.id,
      destinataire_id: conv.autre,
      texte,
    })
    if (error) {
      console.log(error)
      return
    }
    setReponses({ ...reponses, [cle]: "" })
    charger()
  }

  if (!user) {
    return <p className="page">Connecte-toi (page Vendre) pour voir tes messages.</p>
  }

  return (
    <div>
      <section className="hero">
        <h1>Mes <span>messages</span></h1>
      </section>

      {Object.keys(conversations).length === 0 && (
        <p className="page">Aucun message pour l'instant.</p>
      )}

      {Object.entries(conversations).map(([cle, conv]) => (
        <div className="formulaire" key={cle}>
          <h3>{conv.titre} · avec {pseudos[conv.autre] || "un membre"}</h3>
          {conv.liste.map((m) => (
            <p key={m.id}>
              <strong>
                {m.expediteur_id === user.id ? "Toi" : (pseudos[m.expediteur_id] || "Un membre")} :
              </strong>
            </p>
          ))}
          <input
            placeholder="Ta réponse..."
            value={reponses[cle] || ""}
            onChange={(e) => setReponses({ ...reponses, [cle]: e.target.value })}
          />
          <button onClick={() => repondre(cle, conv)}>Répondre</button>
        </div>
      ))}
    </div>
  )
}

export default Messagerie