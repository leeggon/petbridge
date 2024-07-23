import React from "react"

import Siren from "../../assets/image/Siren-white.png"
const SirenModal = ({isOpen, onClose}) => {
  if (!isOpen) return null

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex-col sm:items-start ">
                <div className="sm:w-full flex justify-center my-5">
                  <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-alert sm:mx-0 sm:h-16 sm:w-16">
                    <img src={Siren} alt="Siren Icon" />
                  </div>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left ">
                  <h3
                    className="text-xl font-bold leading-6 text-gray-900 text-center my-5"
                    id="modal-title"
                  >
                    신고하시겠습니까?
                  </h3>

                  <textarea
                    className="w-full p-2 border border-gray-300 bg-gray-100 rounded focus:outline-none focus:border-indigo-500"
                    rows="4"
                    placeholder="신고 사유를 입력해주세요.(100자 이내)"
                  ></textarea>
                  <div className="w-full flex justify-end text-sm text-gray-300">
                    0/100
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row justify-center  sm:px-6">
              <button
                type="button"
                className="w-36 inline-flex justify-center rounded-md bg-alert px-3 py-3 text-sm text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-36 mr-3"
              >
                신고
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-36 justify-center rounded-md bg-white  py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-36"
                onClick={onClose}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SirenModal
