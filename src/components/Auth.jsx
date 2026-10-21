import { useState } from "react";
import { supabase } from "../supabase";

function Auth() {
    const [email, setEmail]=useState("")
    const [motDePasse, setMotDePasse]=useState("")
    const [message, setMessage]=useState("")

    async function inscrire() {
        const {error} = await supabase.auth.signUp({
            email,
            password: motDePasse,
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
        <div>
            <h2>Connexion</h2>
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