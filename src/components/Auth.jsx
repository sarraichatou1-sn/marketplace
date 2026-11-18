import { useState } from "react";
import { supabase } from "../supabase";

function Auth() {
    const [email, setEmail]=useState("")
    const [motDePasse, setMotDePasse]=useState("")
    const [message, setMessage]=useState("")
    const [pseudo, setPseudo] = useState("")

    async function inscrire() {
        const { error } = await supabase.auth.signUp({
            email,
            password: motDePasse,
            options: { data: { pseudo } },
        })
        setMessage(error ? error.message : "Compte créé !")
    }
    async function connecter() {
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password: motDePasse,
        })
        setMessage(error ? error.message : "Connecté !")
    }

    return(
        <div className="formulaire">
            <h2>Connexion</h2>
            <input
                placeholder="Pseudo (pour t'inscrire)"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
            />
            <input
                placeholder="Email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}/>
            <input
                placeholder="Mot de passe"
                type="password"
                value={motDePasse}
                onChange={(e)=> setMotDePasse(e.target.value)}/>
            
            <button onClick={inscrire}>S'inscrire</button>
            <button onClick={connecter}>Se connecter</button>
            <p>{message}</p>

        </div>
    )
}

export default Auth