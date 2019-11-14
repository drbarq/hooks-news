import React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from './LinkItem'

function LinkList(props) {
  const { firebase } = React.useContext(FirebaseContext)
  const [ links, setLinks ] = React.useState([])
  const isNewPage = props.location.pathname.includes("new")

  React.useEffect(() => {
    getLinks()
  }, [])

  function getLinks() {
    // firebase.db.collection('links').onSnapshot(handleSnapshot)
    firebase.db.collection('links').orderBy('created', 'desc').onSnapshot(handleSnapshot)
    // get all the links collection and sort them 
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return {id: doc.id, ...doc.data() }
    })
    setLinks(links)
    console.log(links)
  }

  function renderLinks() {
    // return the newest links or the top links depending on the page
    if (isNewPage) {
      return links
    }
    const topLinks = links.slice().sort((link1, link2) => link2.votes.length - link1.votes.length)
    return topLinks
  }


  return (
    <div>
      {renderLinks().map((link, index) => (
        <LinkItem key={link.id} showCount={true} link={link} index={index + 1}  />
      ))}
    </div>
  )
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
