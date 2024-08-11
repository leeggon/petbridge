import React, {useState, useRef, useEffect} from "react"
import SirenModal from "./SirenModal"
import {useSelector} from "react-redux"
import {selectIsAuthenticated} from "features/user/users-slice"

const Profile = ({isMe, userId, nickname, image}) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const popoverRef = useRef(null)
  const profileRef = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const openModal = () => {
    console.log(isMe)
    if (isAuthenticated) {
      setModalOpen(true)
    } else {
      alert("로그인이 필요합니다.")
    }
  }

  const closeModal = () => {
    setModalOpen(false)
  }
  const handleProfileClick = () => {
    setIsPopoverVisible(!isPopoverVisible)
  }
  useEffect(() => {
    //밖을 클릭하면 없어짐
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !profileRef.current.contains(event.target)
      ) {
        setIsPopoverVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative flex h-12 items-center justify-around space-x-2.5">
      <button
        ref={profileRef}
        className="cursor-pointer border-none bg-transparent p-0"
        onClick={handleProfileClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleProfileClick()
          }
        }}
        aria-haspopup="true"
        aria-expanded={isPopoverVisible}
      >
        <img
          src={
            image === "null" || image === null ? "/images/profile.jpg" : image
          }
          alt="프로필사진"
          className="size-12 rounded-full border"
        />
      </button>
      <div className="relative flex-1">
        <button
          className="text-lg font-semibold"
          ref={profileRef}
          onClick={handleProfileClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleProfileClick()
            }
          }}
        >
          {nickname}
        </button>
        {!isMe && (
          <div
            ref={popoverRef}
            className={`bottom-30 absolute left-0 z-50 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg ${isPopoverVisible ? "block" : "hidden"}`}
            role="dialog"
            aria-labelledby="popover-label"
          >
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => openModal()}
            >
              신고하기
            </button>
            <SirenModal
              isOpen={modalOpen}
              onClose={closeModal}
              reportType={"USER"}
              reportId={userId}
            />
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => alert("채팅하기 클릭됨")}
            >
              채팅하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
