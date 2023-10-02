import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth, storage } from "./config/firebase";
//If we want to ger bunch of docs
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);

  //New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  //File Upload State
  const [fileUpload, setFileUpload] = useState(null);

  //Update Title State
  const [updateTitle, setUpdatedTitle] = useState("");

  const moviesCollectionRef = collection(db, "movies",);

  const getMovieList = async () => {
    //Read the Data
    //Set the Movie List
    try{
      const data = await getDocs(moviesCollectionRef);
      const filterData = data.docs.map((doc) =>({
        ...doc.data(), 
        id: doc.id,
      }));
      setMovieList(filterData);
    } catch(err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {title: updateTitle});
  };

  const uploadFile = async() => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try{
      await uploadBytes(filesFolderRef, fileUpload);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try{
    await addDoc(moviesCollectionRef, {
      title: newMovieTitle, 
      releasedate: newReleaseDate,
      receivedAnOscar: isNewMovieOscar,
      userId:  auth?.currentUser?.uid,
    });

    getMovieList();
  } catch(err) {
    console.error(err);
  }
  }

  return (
    <div className="App">
      <Auth />

      <div>
        <input placeholder='Movie title...' 
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input placeholder='Movie Date...'  
          type='number' 
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input type="checkbox" 
        checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{color: movie.receivedAnOscar ? "green" : "red"}}>{movie.title}</h1>
            <p>Date: {movie.releasedate}</p>

            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input placeholder='new title...'
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>Update title</button>
          </div>
        ))}
      </div>

      <div>
        <input 
          type='file' 
          onChange={(e) => setFileUpload(e.target.files[0])}
        />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
