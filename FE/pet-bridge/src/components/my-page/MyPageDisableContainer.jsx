import {deleteSelfUser} from "api/users-api"
import Siren from "assets/image/Siren-white.png"
import {logOut} from "features/user/users-slice"
import {useDispatch} from "react-redux"
import {useNavigate, useParams} from "react-router-dom"
import Swal from "sweetalert2"
import {logOutUser} from "utils/user-utils"

const MyPageDisableContainer = () => {
  const dispatch = useDispatch()

  let {userId} = useParams()
  const clickCancelHandler = () => {
    console.log("MyPageDisableContainer > 취소 버튼 클릭")
    navigate(`/users/${userId}`)
  }
  const navigate = useNavigate()
  const clickDisableHandler = async () => {
    const result = await Swal.fire({
      title: "정말 탈퇴하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "네, 탈퇴합니다.",
      confirmButtonColor: "#d33",
      cancelButtonText: "아니요, 취소합니다",
      cancelButtonColor: "#a4a2a1",
      customClass: {
        confirmButton: "w-20 py-2 text-white font-semibold rounded-md",
        cancelButton: "w-20 py-2 text-white font-semibold rounded-md",
      },
    })

    if (result.isConfirmed) {
      try {
        // 내 회원 탈퇴
        const res = await deleteSelfUser()
        console.log(res)
        dispatch(logOut())
        logOutUser()
      } catch (error) {
        console.log(error)
      }
    }

    navigate("/")
  }
  return (
    <div className="flex size-full  flex-col items-center justify-center p-8">
      <div className="overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex-col sm:items-start ">
            <div className="my-5 flex justify-center sm:w-full">
              <div className="bg-alert mx-auto flex size-16 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-16">
                <img src={Siren} alt="Siren Icon" />
              </div>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left ">
              <h3
                className="my-5 text-center text-xl font-bold leading-6 text-gray-900"
                id="modal-title"
              >
                정말 탈퇴하시겠습니까?
              </h3>

              <div
                className="w-full rounded border border-gray-300 bg-gray-100 p-4 text-slate-400 focus:border-indigo-500 focus:outline-none"
                rows="4"
              >
                <p>
                  다음과 같은 정보들이 사라지게 됩니다. 정말로 탈퇴하시겠습니까?
                </p>
                <p>- 아이디, 비밀번호, 닉네임과 같은 개인 정보</p>
                <p>
                  - 좋아요, 팔로우, 채팅 내역, 입양 내역과 같은 서비스 이용 정보
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="justify-center bg-gray-50 px-4 py-3 sm:flex sm:flex-row  sm:px-6">
          <button
            type="button"
            className="bg-alert mr-3 inline-flex w-36 justify-center rounded-md p-3 text-sm text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-36"
            onClick={clickDisableHandler}
          >
            탈퇴하기
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-36 justify-center rounded-md bg-white  py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-36"
            onClick={clickCancelHandler}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyPageDisableContainer
