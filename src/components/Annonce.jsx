import { Link } from "react-router-dom"
function Annonce(props) {
    return(
        <div className="carte">
            <Link to={`/article/${props.id}`}>
                {props.image && <img src={props.image} width="200" />}
                <h3>{props.titre}</h3>
            </Link>
            <p className="prix">{props.prix}FCFA</p>
            <p className="ville">{props.ville}</p>
            {props.estMienne && <button onClick={props.onSupprimer}>Supprimer</button>}
        </div>
    )
}

export default Annonce