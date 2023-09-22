
import React, {useState} from "react"
import axios from "axios"



const AddMovieForm = ({movies, setMovies}) =>{
    const [title, setTitle] = useState('')
    const [stars, setStars] = useState(1)

    const submit = async(event)=>{
        event.preventDefault()
        const newMovie = {title, stars}
        const {data} = await axios.post('api/movies', newMovie)
        setMovies([...movies, data])
    }

    return(
        <div>
            <form onSubmit={submit}>
            <label>
                    Title:
                    <input type="text" onChange={ev => setTitle(ev.target.value)}/>
                </label>
                <label>
                    Stars:
                    <input type="number" min="1" max="5" onChange={ev => setStars(ev.target.value)}/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
export default AddMovieForm