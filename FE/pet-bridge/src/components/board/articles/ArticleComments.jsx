import {
  // editBoardComment,
  getListBoardComment,
  registBoardComment,
  removeBoardComment,
} from "api/boards-api"
import Comment from "components/common/Comment"
import CommentIcon from "components/common/CommentIcon"
import {selectIsAuthenticated} from "features/user/users-slice"
import {useEffect, useState} from "react"
import {useSelector} from "react-redux"

const CommentInput = ({articleId, onCommentAdded}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [inputComment, setInputComment] = useState("")
  const sendMsg = async () => {
    console.log({inputComment})
    const newComment = {
      boardId: articleId,
      content: inputComment,
    }

    try {
      await registBoardComment(newComment)
      setInputComment("")
      onCommentAdded() //댓글 작성하면 콜백함수 호출
    } catch (e) {
      console.error(e)
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // e.preventDefault() // 기본 동작 방지
      sendMsg()
    }
  }

  return (
    <div className="flex h-16 flex-col justify-between space-x-2.5 ">
      {isAuthenticated ? (
        <div className="flex items-center space-x-2.5">
          <input
            type="text"
            className="mx-2 h-10 w-full rounded-md text-sm  outline outline-1 outline-stroke"
            placeholder="댓글을 남겨보세요"
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="h-10   w-12" onClick={sendMsg}>
            <img src="/icons/icon-send.svg" alt="sendIcon" />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2.5">
          <div className="mx-2 h-10 w-full content-center rounded-md px-2  text-sm text-stroke outline outline-1 outline-stroke">
            좋아요와 댓글을 남기려면 로그인하세요{" "}
          </div>
        </div>
      )}
    </div>
  )
}

const ArticleComments = ({articleId, currentUserId}) => {
  const [commentList, setCommentList] = useState([])

  //댓글리스트 불러올때 필요
  const fetchComments = async () => {
    const data = await getListBoardComment(articleId) //게시글 댓글 조회 api
    setCommentList(data)
    console.log(articleId)
  }
  useEffect(() => {
    fetchComments()
  }, [articleId])

  //댓글 등록하고나서 필요
  const handleCommentAdded = () => {
    fetchComments() // 댓글 등록 후 댓글 리스트를 다시 가져옴
  }

  //댓글 삭제할때 필요
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    if (deleteId !== null) {
      const goRemoveComment = async (id) => {
        try {
          await removeBoardComment(id) //댓글 삭제 api
          setDeleteId(null) // 삭제 후 deleteId 초기화
          fetchComments() // 삭제 후 댓글 목록 다시 가져오기
        } catch (e) {
          console.error(e)
        }
      }
      goRemoveComment(deleteId)
    }
  }, [deleteId])

  const handleDelete = (id) => {
    setDeleteId(id)
  }

  // //댓글 수정할때 필요 (보류)
  // const [modifyId, setModifyId] = useState(null)

  // useEffect(() => {
  //   if (modifyId !== null) {
  //     const goModifyComment = async (id) => {

  //       try {
  //         await editBoardComment(id)
  //         setModifyId(null)
  //         fetchComments()
  //       } catch (e) {
  //         console.error(e)
  //       }
  //     }
  //     goModifyComment(modifyId)
  //   }
  // }, [modifyId])

  // const handleModify = (id) => {
  //   setModifyId(id)
  // }

  return (
    <>
      <div className="m-3 flex items-center space-x-2">
        <CommentIcon size={"small"} />
        <div>댓글 {commentList?.length}</div>
      </div>
      <ul className="flex w-full flex-col justify-between">
        {commentList ? (
          commentList.map((comment, index) => (
            <li key={index} className="">
              <Comment
                data={comment}
                currentUserId={currentUserId}
                onDelete={handleDelete}
                // onModify={handleModify}
              />
            </li>
          ))
        ) : (
          <div className="m-12 h-24">댓글이 없습니다.</div>
        )}
      </ul>
      <CommentInput
        articleId={articleId}
        currentUserId={currentUserId}
        onCommentAdded={handleCommentAdded}
      />
    </>
  )
}

export default ArticleComments
