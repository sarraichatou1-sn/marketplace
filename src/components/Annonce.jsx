function Annonce(props) {
    return(
        <div>
            {props.image && <img src={props.image} width="200" />}
            <h3>{props.titre}</h3>
            <h3>{props.prix}FCFA</h3>
            <h3>{props.ville}</h3>
        </div>
    )
}

export default Annonce