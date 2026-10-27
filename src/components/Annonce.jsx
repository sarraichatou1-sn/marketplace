function Annonce(props) {
    return(
        <div className="carte">
            {props.image && <img src={props.image} width="200" />}
            <h3>{props.titre}</h3>
            <p className="prix">{props.prix}FCFA</p>
            <p className="ville">{props.ville}</p>
            {props.estMienne && <button onClick={props.onSupprimer}>Supprimer</button>}
        </div>
    )
}

export default Annonce