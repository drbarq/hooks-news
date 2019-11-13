import React from "react";
import { FirebaseContext } from "../../firebase";

function LinkList(props) {
  const { firebase } = React.useContext(FirebaseContext)

  React.useEffect(() => {
    getLinks()
  }, [])

  function getLinks() {
    firebase.db.collection('links').onSnapshot(handleSnapshot)
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return {id: doc.id, ...doc.data() }
    })
    console.log(links)
  }
  return <div>LinkList</div>;
}

export default LinkList;



// import React from "react";
// import useAuth from '../Auth/useAuth'

// function LinkList(props) {
//   const user = useAuth()
//   console.log(user)
//   return <div>LinkList</div>;
// }

// export default LinkList;
