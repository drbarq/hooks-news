import React from "react";
import { Link, withRouter } from 'react-router-dom'
import { getDomain } from '../../utils'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { FirebaseContext } from "../../firebase";

function LinkItem({link, index, showCount, history}) {
  const { firebase, user } = React.useContext(FirebaseContext)
  
  function handleVote() {
    if (!user) {
      history.push('/login')
    } else {
      const voteRef = firebase.db.collection('links').doc(link.id)   
      voteRef.get().then(doc => {
        if (doc.exists) {
          const previousVotes = doc.data().votes
          const vote = { votedBy: { id: user.uid, name: user.displayName} }
          const updatedVotes = [...previousVotes, vote]
          const voteCount = updatedVotes.length
          voteRef.update({ votes: updatedVotes, voteCount: voteCount})
        }
      })
      // to update a document in fb you need the reference, and the full document
      // possible it wont be able to find it, need to have a back up case .exists
      // specify what value specifically you want to update
    }
  }
  // was the link posted by the same user who wants to delete it?
  const postedByAuthUser = user && user.uid === link.postedBy.id

  function handleDeleteLink() {
    const linkRef = firebase.db.collection('links').doc(link.id)
    linkRef.delete().then(() => {
      console.log(`Document with ID ${link.id} deleted`)
    }).catch(err => {
      console.error(`Error deleting document:`, err)
    })
  }

  return (
    <div className="flex items-start mt2">
      <div className="flex items-center">
        {showCount && <span className="gray">{index}</span>}
        <div className="vote-button" onClick={handleVote}>↑</div>
      </div>
      <div className="ml1">
        <div>
         <a href={link.url} className="black no-underline">{link.description}</a> <span className="link">({getDomain(link.url)})</span>
        </div> 
        <div className="f6 lh-copy grey">
          {link.voteCount} votes by {link.postedBy.name} {distanceInWordsToNow(link.created)}
          {" | "}
          <Link to={`/link/${link.id}`}>
            {link.comments.length > 0 
            ? `${link.comments.length} comments`
            : "discuss"}
          </Link>
          {postedByAuthUser && (
            <>
            {" | "}
            <span className="delete-button" onClick={handleDeleteLink}>delete</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default withRouter(LinkItem);


// PRE PAGNATION 
// import React from "react";
// import { Link, withRouter } from 'react-router-dom'
// import { getDomain } from '../../utils'
// import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
// import { FirebaseContext } from "../../firebase";

// function LinkItem({link, index, showCount, history}) {
//   const { firebase, user } = React.useContext(FirebaseContext)
  
//   function handleVote() {
//     if (!user) {
//       history.push('/login')
//     } else {
//       const voteRef = firebase.db.collection('links').doc(link.id)   
//       voteRef.get().then(doc => {
//         if (doc.exists) {
//           const previousVotes = doc.data().votes
//           const vote = { votedBy: { id: user.uid, name: user.displayName} }
//           const updatedVotes = [...previousVotes, vote]
//           voteRef.update({ votes: updatedVotes})
//         }
//       })
//       // to update a document in fb you need the reference, and the full document
//       // possible it wont be able to find it, need to have a back up case .exists
//       // specify what value specifically you want to update
//     }
//   }
//   // was the link posted by the same user who wants to delete it?
//   const postedByAuthUser = user && user.uid === link.postedBy.id

//   function handleDeleteLink() {
//     const linkRef = firebase.db.collection('links').doc(link.id)
//     linkRef.delete().then(() => {
//       console.log(`Document with ID ${link.id} deleted`)
//     }).catch(err => {
//       console.error(`Error deleting document:`, err)
//     })
//   }

//   return (
//     <div className="flex items-start mt2">
//       <div className="flex items-center">
//         {showCount && <span className="gray">{index}</span>}
//         <div className="vote-button" onClick={handleVote}>↑</div>
//       </div>
//       <div className="ml1">
//         <div>
//          <a href={link.url} className="black no-underline">{link.description}</a> <span className="link">({getDomain(link.url)})</span>
//         </div> 
//         <div className="f6 lh-copy grey">
//           {link.votes.length} votes by {link.postedBy.name} {distanceInWordsToNow(link.created)}
//           {" | "}
//           <Link to={`/link/${link.id}`}>
//             {link.comments.length > 0 
//             ? `${link.comments.length} comments`
//             : "discuss"}
//           </Link>
//           {postedByAuthUser && (
//             <>
//             {" | "}
//             <span className="delete-button" onClick={handleDeleteLink}>delete</span>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default withRouter(LinkItem);
