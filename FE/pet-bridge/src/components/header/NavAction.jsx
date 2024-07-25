import {jwtTest} from "api/usersApi"
import Button from "components/common/Button"
import {logOut, selectIsAuthenticated} from "features/user/usersSlice"
import {useSelector, useDispatch} from "react-redux"
import {Link} from "react-router-dom"

function NavAction() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const deleteRefreshTokenFromLocalStorage = () => {
    console.log(
      "NavAction.jsx => deleteRefreshTokenFromLocalStorage => 리프레시 토큰 삭제"
    )
    localStorage.removeItem("refreshToken")
  }

  const handleLogOut = () => {
    console.log("NavAction.jsx => handleLogOut 함수 호출")
    dispatch(logOut())
    deleteRefreshTokenFromLocalStorage()
  }

  const handleJwtTest = () => {
    jwtTest()
  }

  return (
    <ul className="flex h-12 items-center text-xl">
      <li className="mx-2.5 flex h-full cursor-pointer items-center text-xl">
        <button onClick={handleJwtTest}>JWT 테스트</button>
      </li>
      {isAuthenticated ? (
        <>
          <li className="mx-2.5 flex h-full cursor-pointer items-center text-xl">
            <button onClick={handleLogOut}>로그아웃</button>
          </li>
          <li className="mx-2.5 flex h-full cursor-pointer items-center text-xl">
            <Button text="마이 페이지" />
          </li>
        </>
      ) : (
        <>
          <li className="mx-2.5 flex h-full cursor-pointer items-center text-xl">
            <Link to="/login">로그인</Link>
          </li>
          <li className="mx-2.5 flex h-full cursor-pointer items-center text-xl">
            <Link to="/sign-up">회원가입</Link>
          </li>
        </>
      )}
    </ul>
  )
}

export default NavAction
