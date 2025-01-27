import React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from './LinkItem'
import { LINKS_PER_PAGE } from '../../utils/index'
import axios from 'axios'

function LinkList(props) {
  const { firebase } = React.useContext(FirebaseContext)
  const [ links, setLinks ] = React.useState([])
  const [cursor, setCursor] = React.useState(null)
  const [ loading, setLoading] = React.useState(false)
  const isNewPage = props.location.pathname.includes("new")
  const isTopPage = props.location.pathname.includes("top")
  const page = Number(props.match.params.page)
  const linksRef = firebase.db.collection('links')


  React.useEffect(() => {
    const unsubscribe = getLinks()
    return () => unsubscribe()
  }, [isTopPage, page])

  function getLinks() {
    setLoading(true)
    const hasCursor = Boolean(cursor)
    // firebase.db.collection('links').onSnapshot(handleSnapshot)
    if (isTopPage) {
      return linksRef.orderBy('voteCount', 'desc').limit(LINKS_PER_PAGE).onSnapshot(handleSnapshot)
    } else if (page === 1)  {
      return linksRef.orderBy('created', 'desc').limit(LINKS_PER_PAGE).onSnapshot(handleSnapshot)
    } else if (hasCursor) {
      return linksRef.orderBy('created', 'desc').startAfter(cursor.created).limit(LINKS_PER_PAGE).onSnapshot(handleSnapshot)
    } else {
      const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE
      axios.get(`https://us-central1-udemy-hooks.cloudfunctions.net/linksPagination?offset=${offset}`)
        .then(response => {
          console.log(response)
          const links = response.data
          const lastlink = links[links.length -1]
          setLinks(links)
          setCursor(lastlink)
          setLoading(false)
        })
        return () => {}
    }
    // get all the links collection and sort them 
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return {id: doc.id, ...doc.data() }
    })
    const lastLink = links[links.length - 1]
    setLinks(links)
    setCursor(lastLink)
    setLoading(false)
    console.log(links)
  }

  function visitPreviousPage() {
    props.history.push(`/new/${page -1}`)
  }

  function visitNextPage() {
    if (page <= links.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${page + 1}`)
    }
  }

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 1

  return (
    <div style={{opacity: loading ? 0.25 : 1}} >
      {links.map((link, index) => (
        <LinkItem key={link.id} showCount={true} link={link} index={index + pageIndex}  />
      ))}
      {isNewPage && (
        <div className="pagination">
          <div className="pointer mr2" onClick={visitPreviousPage}>Previous</div>
          <div className="pointer" onClick={visitNextPage}>Next</div>
        </div>
      )}
    </div>
  )
}

export default LinkList;

// Pre Pagation
// import React from "react";
// import { FirebaseContext } from "../../firebase";
// import LinkItem from './LinkItem'

// function LinkList(props) {
//   const { firebase } = React.useContext(FirebaseContext)
//   const [ links, setLinks ] = React.useState([])
//   const isNewPage = props.location.pathname.includes("new")

//   React.useEffect(() => {
//     getLinks()
//   }, [])

//   function getLinks() {
//     // firebase.db.collection('links').onSnapshot(handleSnapshot)
//     firebase.db.collection('links').orderBy('created', 'desc').onSnapshot(handleSnapshot)
//     // get all the links collection and sort them 
//   }

//   function handleSnapshot(snapshot) {
//     const links = snapshot.docs.map(doc => {
//       return {id: doc.id, ...doc.data() }
//     })
//     setLinks(links)
//     console.log(links)
//   }

//   function renderLinks() {
//     // return the newest links or the top links depending on the page
//     if (isNewPage) {
//       return links
//     }
//     const topLinks = links.slice().sort((link1, link2) => link2.votes.length - link1.votes.length)
//     return topLinks
//   }


//   return (
//     <div>
//       {renderLinks().map((link, index) => (
//         <LinkItem key={link.id} showCount={true} link={link} index={index + 1}  />
//       ))}
//     </div>
//   )
// }

// export default LinkList;